import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Brain, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const priorityStyles = {
  routine: 'bg-slate-50 text-slate-600 border-slate-200',
  urgent: 'bg-amber-50 text-amber-700 border-amber-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
};

const typeIcons = {
  xray: '🩻',
  mri: '🧠',
  ct_scan: '📡',
  ultrasound: '🔊',
  lab_result: '🧪',
  prescription: '💊',
  clinical_note: '📝',
  pathology: '🔬',
};

export default function RecentRecords({ records, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-lg font-heading">Recent Medical Records</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-heading">Recent Medical Records</CardTitle>
        <Link to="/records" className="text-xs text-primary font-medium hover:underline">View all</Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {(!records || records.length === 0) ? (
          <p className="text-sm text-muted-foreground text-center py-8">No records yet</p>
        ) : (
          records.slice(0, 5).map((record) => (
            <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center border text-lg">
                  {typeIcons[record.record_type] || '📄'}
                </div>
                <div>
                  <p className="text-sm font-semibold">{record.title}</p>
                  <p className="text-xs text-muted-foreground">{record.patient_name} · {record.record_type?.replace(/_/g, ' ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {record.ai_analysis_status === 'completed' && (
                  <Brain className="w-4 h-4 text-primary" />
                )}
                <Badge variant="outline" className={priorityStyles[record.priority] || ''}>
                  {record.priority}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}