import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

import {
Card,
CardContent,
CardHeader,
CardTitle,
CardDescription
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import {
Shield,
Bell
} from 'lucide-react';

export default function Settings(){

const navigate = useNavigate();

/* FIX: hook must be here */
const { signOut } = useAuth();

const handleLogout = async()=>{

try{

await signOut();

localStorage.clear();

sessionStorage.clear();

navigate("/login");

}catch(error){

console.log(
"Logout error:",
error
);

}

};

return(

<div className="space-y-6 max-w-4xl">

<div>

<h1 className="text-2xl font-bold">

Settings

</h1>

<p className="text-sm text-muted-foreground">

Platform configuration and compliance settings

</p>

</div>

<Card className="border-emerald-200 bg-gradient-to-r from-emerald-50/50 to-transparent">

<CardContent className="p-6">

<div className="flex items-center gap-4">

<div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">

<Shield className="w-6 h-6 text-emerald-700"/>

</div>

<div className="flex-1">

<h3 className="font-bold text-lg">

Security Status

</h3>

<p className="text-sm text-muted-foreground">

All compliance requirements met

</p>

</div>

<Badge className="bg-emerald-100 text-emerald-800">

All Clear

</Badge>

</div>

</CardContent>

</Card>

<Card>

<CardHeader>

<CardTitle>

Notification Preferences

</CardTitle>

<CardDescription>

Configure alert settings

</CardDescription>

</CardHeader>

<CardContent className="space-y-4">

{[
'Critical anomaly alerts',
'Appointment reminders',
'Audit warnings',
'System health updates'
].map(item=>(

<div
key={item}
className="flex justify-between"
>

<Label>

{item}

</Label>

<Switch defaultChecked/>

</div>

))}

</CardContent>

</Card>

<Card>

<CardHeader>

<CardTitle>

Account

</CardTitle>

</CardHeader>

<CardContent>

<Button
variant="destructive"
onClick={handleLogout}
>

Sign Out

</Button>

</CardContent>

</Card>

</div>

);

}