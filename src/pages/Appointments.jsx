import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Appointment,
  Patient,
  Doctor,
  AuditLog
} from '@/lib/db';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  Tabs,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

import {
  Plus,
  Clock,
  Stethoscope
} from 'lucide-react';

import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const timeSlots = [
  "08:00","08:30","09:00","09:30",
  "10:00","10:30","11:00","11:30",
  "12:00","13:00","13:30","14:00",
  "14:30","15:00","15:30","16:00",
  "16:30","17:00"
];

const types = [
  "consultation",
  "follow_up",
  "imaging",
  "telehealth",
  "emergency"
];

const statusStyles = {
  scheduled:"bg-blue-50 text-blue-700",
  confirmed:"bg-emerald-50 text-emerald-700",
  completed:"bg-slate-50 text-slate-700",
  cancelled:"bg-red-50 text-red-700"
};

const typeStyles = {
  consultation:"bg-primary/10 text-primary",
  follow_up:"bg-violet-50 text-violet-700",
  imaging:"bg-cyan-50 text-cyan-700",
  telehealth:"bg-emerald-50 text-emerald-700",
  emergency:"bg-red-50 text-red-700"
};

const emptyApt = {

patient_name:"",
doctor_name:"",

patient_id:"",
doctor_id:"",

appointment_date:"",
appointment_time:"",
appointment_type:"consultation",

status:"scheduled",

reason:"",
notes:""

};

export default function Appointments(){

const [open,setOpen]=useState(false);

const [form,setForm]=useState(emptyApt);

const [editId,setEditId]=useState(null);

const [tab,setTab]=useState("all");

const {toast}=useToast();

const queryClient=useQueryClient();

const {
data:appointments=[],
isLoading
}=useQuery({

queryKey:["appointments"],
queryFn:Appointment.list

});

const {
data:patients=[]
}=useQuery({

queryKey:["patients"],
queryFn:Patient.list

});

const {
data:doctors=[]
}=useQuery({

queryKey:["doctors"],
queryFn:Doctor.list

});

const saveMutation=useMutation({

mutationFn:async(data)=>{

let result;

if(editId){

result=
await Appointment.update(
editId,
data
);

await AuditLog.create({

action:'update',

entity_type:'appointment',

entity_id:editId,

description:
`Appointment updated for ${data.patient_name}`,

severity:'info',

user_email:'admin'

});

}else{

result=
await Appointment.create(
data
);

await AuditLog.create({

action:'create',

entity_type:'appointment',

entity_id:result[0]?.id,

description:
`Appointment created for ${data.patient_name}`,

severity:'info',

user_email:'admin'

});

}

return result;

},

onSuccess:()=>{

queryClient.invalidateQueries({
queryKey:['appointments']
});

queryClient.invalidateQueries({
queryKey:['audit_logs']
});

setOpen(false);

setForm(emptyApt);

setEditId(null);

toast({

title:
editId
?'Appointment updated'
:'Appointment scheduled'

});

}

});

const handleSubmit=(e)=>{

e.preventDefault();

saveMutation.mutate(form);

};

const openEdit=(apt)=>{

setForm({

...emptyApt,
...apt

});

setEditId(apt.id);

setOpen(true);

};

const filtered=

tab==="all"

? appointments

: appointments.filter(

a=>a.status===tab

);

return(

<div className="space-y-6">

<div className="flex justify-between">

<div>

<h1 className="text-2xl font-bold">

Appointments

</h1>

<p className="text-sm text-muted-foreground">

{appointments.length} total appointments

</p>

</div>

<Dialog
open={open}
onOpenChange={setOpen}
>

<DialogTrigger asChild>

<Button>

<Plus className="w-4 h-4 mr-2"/>

Schedule Appointment

</Button>

</DialogTrigger>

<DialogContent>

<DialogHeader>

<DialogTitle>

{editId
? "Edit"
: "Schedule"}

Appointment

</DialogTitle>

</DialogHeader>

<form
onSubmit={handleSubmit}
className="space-y-4"
>

<div className="grid grid-cols-2 gap-4">

<div>

<Label>Patient</Label>

<Select
value={form.patient_name}
onValueChange={(v)=>{

const p=
patients.find(
pt=>pt.name===v
);

setForm({

...form,

patient_name:v,

patient_id:
p?.id || ""

});

}}
>

<SelectTrigger>

<SelectValue/>

</SelectTrigger>

<SelectContent>

{patients.map(p=>(

<SelectItem
key={p.id}
value={p.name}
>

{p.name}

</SelectItem>

))}

</SelectContent>

</Select>

</div>

<div>

<Label>Doctor</Label>

<Select
value={form.doctor_name}
onValueChange={(v)=>{

const d=
doctors.find(
dc=>dc.name===v
);

setForm({

...form,

doctor_name:v,

doctor_id:
d?.id || ""

});

}}
>

<SelectTrigger>

<SelectValue/>

</SelectTrigger>

<SelectContent>

{doctors.map(d=>(

<SelectItem
key={d.id}
value={d.name}
>

{d.name}

</SelectItem>

))}

</SelectContent>

</Select>

</div>

<div>

<Label>Date</Label>

<Input
type="date"
value={form.appointment_date}
onChange={(e)=>

setForm({

...form,

appointment_date:
e.target.value

})

}
/>

</div>

<div>

<Label>Time</Label>

<Select
value={form.appointment_time}
onValueChange={(v)=>

setForm({

...form,

appointment_time:v

})

}
>

<SelectTrigger>

<SelectValue/>

</SelectTrigger>

<SelectContent>

{timeSlots.map(t=>(

<SelectItem
key={t}
value={t}
>

{t}

</SelectItem>

))}

</SelectContent>

</Select>

</div>

<div>

<Label>Type</Label>

<Select
value={form.appointment_type}
onValueChange={(v)=>

setForm({

...form,

appointment_type:v

})

}
>

<SelectTrigger>

<SelectValue/>

</SelectTrigger>

<SelectContent>

{types.map(t=>(

<SelectItem
key={t}
value={t}
>

{t}

</SelectItem>

))}

</SelectContent>

</Select>

</div>

</div>

<div>

<Label>Reason</Label>

<Input
value={form.reason}
onChange={(e)=>

setForm({

...form,

reason:e.target.value

})

}
/>

</div>

<div>

<Label>Notes</Label>

<Textarea
value={form.notes}
onChange={(e)=>

setForm({

...form,

notes:e.target.value

})

}
/>

</div>

<div className="flex justify-end gap-2">

<Button
variant="outline"
type="button"
onClick={()=>
setOpen(false)
}
>

Cancel

</Button>

<Button
type="submit"
disabled={
saveMutation.isPending
}
>

{editId
? "Update"
: "Schedule"}

</Button>

</div>

</form>

</DialogContent>

</Dialog>

</div>

<Tabs
value={tab}
onValueChange={setTab}
>

<TabsList>

<TabsTrigger value="all">
All
</TabsTrigger>

<TabsTrigger value="scheduled">
Scheduled
</TabsTrigger>

<TabsTrigger value="confirmed">
Confirmed
</TabsTrigger>

<TabsTrigger value="completed">
Completed
</TabsTrigger>

<TabsTrigger value="cancelled">
Cancelled
</TabsTrigger>

</TabsList>

</Tabs>

<div className="space-y-3">

{filtered.map(apt=>(

<Card
key={apt.id}
onClick={()=>
openEdit(apt)
}
>

<CardContent className="p-4">

<div className="flex justify-between">

<div>

<p className="font-semibold">

{apt.patient_name}

</p>

<p className="text-sm">

Dr. {apt.doctor_name}

</p>

<p className="text-xs">

{apt.appointment_date
? format(
new Date(
apt.appointment_date
),
"dd MMM yyyy"
)
:""}

{" • "}

{apt.appointment_time}

</p>

</div>

<Badge
className={
statusStyles[
apt.status
]
}
>

{apt.status}

</Badge>

</div>

</CardContent>

</Card>

))}

</div>

</div>

);

}