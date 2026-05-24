import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Groq from "groq-sdk";

import { MedicalRecord, AuditLog } from "@/lib/db";
import { supabase } from "@/lib/supabaseClient";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function Diagnostics() {
  const [selectedRecord, setSelectedRecord] = useState("");

  const [result, setResult] = useState(null);

  const queryClient = useQueryClient();

  const { data: records = [] } = useQuery({
    queryKey: ["medical_records"],

    queryFn: MedicalRecord.list,
  });

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const record = records.find((r) => r.id === selectedRecord);

      if (!record) {
        throw new Error("No record selected");
      }

      const prompt = `

Analyze this medical data:

Patient:
${record.patient_name}

Diagnosis:
${record.diagnosis}

Description:
${record.description}

Return JSON only:

{
"findings":"",
"confidence":"",
"recommendation":""
}

`;

      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        response_format: {
          type: "json_object",
        },
      });

      const analysis = JSON.parse(response.choices[0].message.content);

      setResult(analysis);

      await supabase.from("diagnostic_reports").insert([
        {
          medical_record_id: record.id,

          patient_id: record.patient_id,

          patient_name: record.patient_name,

          doctor_id: record.doctor_id,

          doctor_name: record.doctor_name,

          ai_findings: analysis.findings,

          ai_confidence: analysis.confidence,

          recommendations: analysis.recommendation,

          status: "completed",
        },
      ]);
      await AuditLog.create({
        action: "ai_analysis",

        entity_type: "diagnostic_report",

        entity_id: record.id,

        description: `AI analysis completed for ${record.patient_name}`,

        severity: "info",

        user_email: "admin",
      });

      return analysis;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Diagnostics</h1>

        <p className="text-muted-foreground">
          Computer vision assisted analysis
        </p>
      </div>

      <div className="border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Select Medical Record</h2>

        <Select value={selectedRecord} onValueChange={setSelectedRecord}>
          <SelectTrigger>
            <SelectValue placeholder="Choose record" />
          </SelectTrigger>

          <SelectContent>
            {records.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.patient_name}-{r.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          className="mt-5"
          disabled={!selectedRecord || analyzeMutation.isPending}
          onClick={() => analyzeMutation.mutate()}
        >
          Run Analysis
        </Button>
      </div>

      {result && (
        <div className="border rounded-xl p-6">
          <h2 className="font-bold mb-4">Diagnostic Report</h2>

          <p>
            <strong>Findings:</strong>

            {result.findings}
          </p>

          <p>
            <strong>Confidence:</strong>

            {result.confidence}
          </p>

          <p>
            <strong>Recommendation:</strong>

            {result.recommendation}
          </p>
        </div>
      )}
    </div>
  );
}
