import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const demoData = [
  { name: 'Mon', appointments: 12, scans: 8, diagnostics: 5 },
  { name: 'Tue', appointments: 19, scans: 12, diagnostics: 9 },
  { name: 'Wed', appointments: 15, scans: 10, diagnostics: 7 },
  { name: 'Thu', appointments: 22, scans: 15, diagnostics: 11 },
  { name: 'Fri', appointments: 18, scans: 13, diagnostics: 10 },
  { name: 'Sat', appointments: 8, scans: 5, diagnostics: 3 },
  { name: 'Sun', appointments: 5, scans: 3, diagnostics: 2 },
];

export default function ActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-heading">Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={demoData}>
              <defs>
                <linearGradient id="colorAppt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(172, 66%, 50%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(172, 66%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(215, 14%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 14%, 46%)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(214, 20%, 90%)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="appointments" stroke="hsl(199, 89%, 48%)" fill="url(#colorAppt)" strokeWidth={2} />
              <Area type="monotone" dataKey="scans" stroke="hsl(172, 66%, 50%)" fill="url(#colorScans)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}