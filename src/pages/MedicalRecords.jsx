import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { MedicalRecord, Patient, Doctor, AuditLog } from "@/lib/db";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const emptyRecord = {
  patient_id: "",
  patient_name: "",

  doctor_id: "",
  doctor_name: "",

  title: "",
  description: "",
  diagnosis: "",

  record_type: "consultation",

  priority: "routine",

  status: "pending_review",

  ai_analysis_status: "pending"
};

export default function MedicalRecords(){

const [open,setOpen]=useState(false);

const [form,setForm]=useState(emptyRecord);

const queryClient=useQueryClient();

const {data:records=[]}=useQuery({
queryKey:["medical_records"],
queryFn:MedicalRecord.list
});

const {data:patients=[]}=useQuery({
queryKey:["patients"],
queryFn:Patient.list
});

const {data:doctors=[]}=useQuery({
queryKey:["doctors"],
queryFn:Doctor.list
});

const saveMutation=useMutation({

mutationFn:async(data)=>{

const result=
await MedicalRecord.create(
data
);

await AuditLog.create({

action:'create',

entity_type:'medical_record',

entity_id:result[0]?.id,

description:
`Medical record ${data.title} created`,

severity:'info',

user_email:'admin'

});

return result;

},

onSuccess:()=>{

queryClient.invalidateQueries({
queryKey:["medical_records"]
});

queryClient.invalidateQueries({
queryKey:["audit_logs"]
});

setForm(emptyRecord);

setOpen(false);

}

});

function handleSubmit(e){

e.preventDefault();

console.log("Submitting:",form);

saveMutation.mutate(form);

}

return(

<div>

<div className="flex justify-between mb-6">

<h1 className="text-3xl font-bold">

Records

</h1>

<Dialog
open={open}
onOpenChange={setOpen}
>

<DialogTrigger asChild>

<Button>

+ New Record

</Button>

</DialogTrigger>

<DialogContent>

<form
onSubmit={handleSubmit}
className="space-y-4"
>

<Select
value={form.patient_name}
onValueChange={(v)=>{

const p=
patients.find(
x=>x.name===v
);

setForm({

...form,
patient_name:v,
patient_id:p?.id||""

});

}}
>

<SelectTrigger>

<SelectValue placeholder="Patient"/>

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

<Select
value={form.doctor_name}
onValueChange={(v)=>{

const d=
doctors.find(
x=>x.name===v
);

setForm({

...form,
doctor_name:v,
doctor_id:d?.id||""

});

}}
>

<SelectTrigger>

<SelectValue placeholder="Doctor"/>

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

<Input
placeholder="Title"
value={form.title}
onChange={(e)=>
setForm({
...form,
title:e.target.value
})
}
/>

<Textarea
placeholder="Description"
value={form.description}
onChange={(e)=>
setForm({
...form,
description:e.target.value
})
}
/>

<Input
placeholder="Diagnosis"
value={form.diagnosis}
onChange={(e)=>
setForm({
...form,
diagnosis:e.target.value
})
}
/>

<Button
type="submit"
disabled={saveMutation.isPending}
>

Save Record

</Button>

</form>

</DialogContent>

</Dialog>

</div>

{records.map(r=>(

<div
key={r.id}
className="border rounded p-4 mb-3"
>

<h3>{r.title}</h3>

<p>{r.patient_name}</p>

<p>{r.diagnosis}</p>

</div>

))}

</div>

);

}