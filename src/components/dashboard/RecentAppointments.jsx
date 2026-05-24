import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

const statusStyles = {
  scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-slate-50 text-slate-600 border-slate-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  no_show: 'bg-gray-50 text-gray-600 border-gray-200',
};

export default function RecentAppointments({ appointments, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-lg font-heading">Upcoming Appointments</CardTitle></CardHeader>
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
      <CardHeader>
        <CardTitle className="text-lg font-heading">Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {(!appointments || appointments.length === 0) ? (
          <p className="text-sm text-muted-foreground text-center py-8">No upcoming appointments</p>
        ) : (
          appointments.slice(0, 5).map((apt) => (
            <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{apt.patient_name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Dr. {apt.doctor_name}</span>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {apt.time}
                    </div>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className={statusStyles[apt.status] || ''}>
                {apt.status?.replace(/_/g, ' ')}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}