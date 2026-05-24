import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Patient,
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
  Avatar,
  AvatarFallback
} from '@/components/ui/avatar';

import {
  Plus,
  Search,
  Phone,
  Mail,
  Droplets,
  AlertCircle
} from 'lucide-react';

import { useToast } from '@/components/ui/use-toast';


const emptyPatient = {

  name:'',
  email:'',
  phone:'',
  date_of_birth:'',
  gender:'',
  blood_type:'',
  allergies:'',
  medical_history:'',
  insurance_provider:'',
  insurance_id:'',
  emergency_contact_name:'',
  emergency_contact_phone:'',
  status:'active'

};


export default function Patients(){

const [search,setSearch]=useState('');

const [open,setOpen]=useState(false);

const [form,setForm]=useState(emptyPatient);

const [editId,setEditId]=useState(null);

const {toast}=useToast();

const queryClient=useQueryClient();


const {
data:patients=[],
isLoading
}=useQuery({

queryKey:['patients'],

queryFn:Patient.list

});


const saveMutation=useMutation({

mutationFn:async(data)=>{

let result;

if(editId){

result=
await Patient.update(
editId,
data
);

await AuditLog.create({

action:'update',

entity_type:'patient',

entity_id:editId,

description:`Patient ${data.name} updated`,

severity:'info',

user_email:'admin'

});

}else{

result=
await Patient.create(
data
);

await AuditLog.create({

action:'create',

entity_type:'patient',

entity_id:result[0]?.id,

description:`Patient ${data.name} created`,

severity:'info',

user_email:'admin'

});

}

return result;

},

onSuccess:()=>{

queryClient.invalidateQueries({
queryKey:['patients']
});

queryClient.invalidateQueries({
queryKey:['audit_logs']
});

setOpen(false);

setForm(emptyPatient);

setEditId(null);

toast({

title:
editId
?'Patient updated'
:'Patient registered'

});

}

});


const handleSubmit=(e)=>{

e.preventDefault();

saveMutation.mutate(form);

};


const openEdit=(patient)=>{

setForm({

...emptyPatient,
...patient

});

setEditId(patient.id);

setOpen(true);

};


const filtered=patients.filter(

p=>

p.name
?.toLowerCase()
.includes(
search.toLowerCase()
)

||

p.email
?.toLowerCase()
.includes(
search.toLowerCase()
)

);


const statusColor={

active:
'bg-emerald-50 text-emerald-700',

inactive:
'bg-gray-50 text-gray-700',

discharged:
'bg-blue-50 text-blue-700'

};


return(

<div className="space-y-6">

<div className="flex justify-between">

<div>

<h1 className="text-2xl font-bold">

Patients

</h1>

<p className="text-sm text-muted-foreground">

{patients.length} registered patients

</p>

</div>

<Dialog
open={open}
onOpenChange={setOpen}
>

<DialogTrigger asChild>

<Button>

<Plus className="w-4 h-4 mr-2"/>

Add Patient

</Button>

</DialogTrigger>


<DialogContent
className="max-w-2xl"
>

<DialogHeader>

<DialogTitle>

{editId
?'Edit'
:'Register'}

Patient

</DialogTitle>

</DialogHeader>

<form
onSubmit={handleSubmit}
className="space-y-4"
>

<div className="grid grid-cols-2 gap-4">

<Input
placeholder="Name"
value={form.name}
onChange={(e)=>

setForm({

...form,
name:e.target.value

})

}
/>

<Input
placeholder="Email"
value={form.email}
onChange={(e)=>

setForm({

...form,
email:e.target.value

})

}
/>

<Input
placeholder="Phone"
value={form.phone}
onChange={(e)=>

setForm({

...form,
phone:e.target.value

})

}
/>

<Input
type="date"
value={form.date_of_birth}
onChange={(e)=>

setForm({

...form,
date_of_birth:e.target.value

})

}
/>

</div>

<Textarea

placeholder="Medical History"

value={form.medical_history}

onChange={(e)=>

setForm({

...form,
medical_history:e.target.value

})

}

/>

<div className="flex justify-end gap-3">

<Button
variant="outline"
type="button"
onClick={()=>{
setOpen(false)
}}
>

Cancel

</Button>

<Button
type="submit"
disabled={saveMutation.isPending}
>

{editId
?'Update'
:'Register'}

</Button>

</div>

</form>

</DialogContent>

</Dialog>

</div>


<div className="relative max-w-sm">

<Search
className="absolute left-3 top-3 w-4 h-4"
/>

<Input

placeholder="Search"

value={search}

onChange={(e)=>

setSearch(
e.target.value
)
}

className="pl-10"

/>

</div>


{isLoading ? (

<div>

Loading...

</div>

):(

<div className="grid grid-cols-3 gap-4">

{filtered.map(patient=>(

<Card
key={patient.id}
onClick={()=>
openEdit(patient)
}
>

<CardContent className="p-4">

<Avatar>

<AvatarFallback>

{patient.name
?.charAt(0)}

</AvatarFallback>

</Avatar>

<p className="font-bold">

{patient.name}

</p>

<p className="text-sm">

{patient.email}

</p>

<Badge
className={
statusColor[
patient.status
]
}
>

{patient.status}

</Badge>

</CardContent>

</Card>

))}

</div>

)}

</div>

);

}