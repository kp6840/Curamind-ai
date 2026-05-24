import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const severityColors = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  moderate: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
};

const statusStyles = {
  ai_processing: 'bg-blue-50 text-blue-700 border-blue-200',
  pending_review: 'bg-amber-50 text-amber-700 border-amber-200',
  reviewed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  finalized: 'bg-slate-50 text-slate-700 border-slate-200',
};

export default function DiagnosticResultCard({ report }) {
  const [expanded, setExpanded] = useState(false);
  const anomalies = report.ai_anomalies_detected || [];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{report.patient_name}</p>
                <p className="text-xs text-muted-foreground">
                  {report.image_type?.replace(/_/g, ' ')} · {report.doctor_name ? `Dr. ${report.doctor_name}` : 'Unassigned'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={statusStyles[report.status] || ''}>
                {report.status?.replace(/_/g, ' ')}
              </Badge>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">AI Confidence</span>
                <span className="text-sm font-bold">{report.ai_confidence || 0}%</span>
              </div>
              <Progress
                value={report.ai_confidence || 0}
                className={cn("h-2", report.ai_confidence >= 80 ? "[&>div]:bg-emerald-500" : report.ai_confidence >= 50 ? "[&>div]:bg-amber-500" : "[&>div]:bg-red-500")}
              />
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Shield className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">{anomalies.length} anomalies</span>
            </div>
          </div>

          {/* Anomaly pills */}
          {anomalies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {anomalies.slice(0, 3).map((a, i) => (
                <Badge key={i} variant="outline" className={severityColors[a.severity] || ''}>
                  {a.region}: {a.severity}
                </Badge>
              ))}
              {anomalies.length > 3 && (
                <Badge variant="secondary">+{anomalies.length - 3} more</Badge>
              )}
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="mt-3 text-xs"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
            {expanded ? 'Less details' : 'View details'}
          </Button>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="border-t bg-muted/30 p-5 space-y-4">
            {report.ai_findings && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">AI Findings</h4>
                <p className="text-sm leading-relaxed">{report.ai_findings}</p>
              </div>
            )}
            {anomalies.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Detected Anomalies</h4>
                <div className="space-y-2">
                  {anomalies.map((anomaly, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-card border">
                      <AlertTriangle className={cn("w-4 h-4 mt-0.5 shrink-0",
                        anomaly.severity === 'critical' ? 'text-red-500' :
                        anomaly.severity === 'high' ? 'text-orange-500' :
                        anomaly.severity === 'moderate' ? 'text-amber-500' : 'text-emerald-500'
                      )} />
                      <div>
                        <p className="text-sm font-medium">{anomaly.region}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{anomaly.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={severityColors[anomaly.severity] || ''}>
                            {anomaly.severity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{anomaly.confidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {report.recommendations && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Recommendations</h4>
                <p className="text-sm leading-relaxed">{report.recommendations}</p>
              </div>
            )}
            {report.doctor_review && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Doctor's Review</h4>
                <p className="text-sm leading-relaxed">{report.doctor_review}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}