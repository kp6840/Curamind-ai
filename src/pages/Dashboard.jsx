import React from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  Patient,
  Doctor,
  Appointment,
  MedicalRecord
} from '@/lib/db';

import {
  Users,
  UserCog,
  Calendar,
  AlertTriangle
} from 'lucide-react';

import StatCard from '../components/dashboard/StatCard';
import RecentAppointments from '../components/dashboard/RecentAppointments';
import RecentRecords from '../components/dashboard/RecentRecords';
import ActivityChart from '../components/dashboard/ActivityChart';

export default function Dashboard() {

  const {
    data: patients = [],
    isLoading: pLoading
  } = useQuery({
    queryKey:['patients'],
    queryFn: Patient.list
  });

  const {
    data: doctors = [],
    isLoading: dLoading
  } = useQuery({
    queryKey:['doctors'],
    queryFn: Doctor.list
  });

  const {
    data: appointments = [],
    isLoading: aLoading
  } = useQuery({
    queryKey:['appointments'],
    queryFn: Appointment.list
  });

  const {
    data: records = [],
    isLoading: rLoading
  } = useQuery({
    queryKey:['records'],
    queryFn: MedicalRecord.list
  });

  const pendingReviews =
    records.filter(
      r => r.status === 'pending_review'
    ).length;

  const aiCompleted =
    records.filter(
      r => r.ai_analysis_status === 'completed'
    ).length;

  return (

<div className="space-y-6">

<div>

<h1 className="text-2xl font-heading font-bold">
Dashboard
</h1>

<p className="text-sm text-muted-foreground mt-1">
Welcome back. Here's your platform overview.
</p>

</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

<StatCard
title="Total Patients"
value={patients.length}
icon={Users}
subtitle="from last month"
trend="+12%"
trendUp
colorClass="bg-primary"
/>

<StatCard
title="Active Doctors"
value={doctors.length}
icon={UserCog}
subtitle="specialists"
colorClass="bg-accent"
/>

<StatCard
title="Appointments"
value={appointments.length}
icon={Calendar}
subtitle="this week"
trend="+8%"
trendUp
colorClass="bg-chart-3"
/>

<StatCard
title="Pending Reviews"
value={pendingReviews}
icon={AlertTriangle}
subtitle={`${aiCompleted} AI analyzed`}
colorClass="bg-chart-4"
/>

</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

<div className="lg:col-span-2">
<ActivityChart />
</div>

<RecentAppointments
appointments={appointments}
isLoading={aLoading}
/>

</div>

<RecentRecords
records={records}
isLoading={rLoading}
/>

</div>

);

}