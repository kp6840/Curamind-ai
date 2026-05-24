import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Doctor, AuditLog } from '@/lib/db';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

import {
  Avatar,
  AvatarFallback
} from '@/components/ui/avatar';

import {
  Plus,
  Search
} from 'lucide-react';

import { useToast } from '@/components/ui/use-toast';

const emptyDoctor = {
  name:'',
  email:'',
  specialization:'',
  license_number:'',
  phone:'',
  bio:'',
  years_of_experience:'',
  availability:'available',
  status:'active'
};

export default function Doctors(){

const [search,setSearch]=useState('');

const [open,setOpen]=useState(false);

const [form,setForm]=useState(emptyDoctor);

const [editId,setEditId]=useState(null);

const {toast}=useToast();

const queryClient=useQueryClient();

const {
data:doctors=[],
isLoading
}=useQuery({

queryKey:['doctors'],

queryFn:Doctor.list

});

const saveMutation=useMutation({

mutationFn:async(data)=>{

let result;

if(editId){

result=
await Doctor.update(
editId,
data
);

await AuditLog.create({

action:'update',

entity_type:'doctor',

entity_id:editId,

description:`Doctor ${data.name} updated`,

severity:'info',

user_email:'admin'

});

}else{

result=
await Doctor.create(
data
);

await AuditLog.create({

action:'create',

entity_type:'doctor',

entity_id:result[0]?.id,

description:`Doctor ${data.name} created`,

severity:'info',

user_email:'admin'

});

}

return result;

},

onSuccess:()=>{

queryClient.invalidateQueries({
queryKey:['doctors']
});

queryClient.invalidateQueries({
queryKey:['audit_logs']
});

setOpen(false);

setForm(emptyDoctor);

setEditId(null);

toast({

title:
editId
? 'Doctor updated'
: 'Doctor added'

});

}

});

const handleSubmit=(e)=>{

e.preventDefault();

saveMutation.mutate({

...form,

years_of_experience:
form.years_of_experience
? Number(
form.years_of_experience
)
: null

});

};

const openEdit=(doc)=>{

setForm({

...emptyDoctor,
...doc

});

setEditId(
doc.id
);

setOpen(true);

};

const filtered=
doctors.filter(

d=>

d.name
?.toLowerCase()
.includes(
search.toLowerCase()
)

||

d.specialization
?.toLowerCase()
.includes(
search.toLowerCase()
)

);

return(

<div className="space-y-6">

<div className="flex justify-between">

<div>

<h1 className="text-2xl font-bold">

Doctors

</h1>

<p className="text-sm text-muted-foreground">

{doctors.length}
registered specialists

</p>

</div>

<Dialog
open={open}
onOpenChange={setOpen}
>

<DialogTrigger asChild>

<Button>

<Plus className="w-4 h-4 mr-2"/>

Add Doctor

</Button>

</DialogTrigger>

<DialogContent>

<DialogHeader>

<DialogTitle>

{editId
? 'Edit'
: 'Add'}

Doctor

</DialogTitle>

</DialogHeader>

<form
onSubmit={handleSubmit}
className="space-y-4"
>

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

<Button
type="submit"
>

{editId
? 'Update'
: 'Add'}

</Button>

</form>

</DialogContent>

</Dialog>

</div>

<div className="relative max-w-sm">

<Search className="absolute left-3 top-3 w-4 h-4"/>

<Input
placeholder="Search..."
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

{filtered.map(doc=>(

<Card
key={doc.id}
onClick={()=>
openEdit(doc)
}
>

<CardContent className="p-4">

<Avatar>

<AvatarFallback>

{doc.name
?.charAt(0)}

</AvatarFallback>

</Avatar>

<p className="font-bold">

{doc.name}

</p>

<p className="text-sm">

{doc.email}

</p>

</CardContent>

</Card>

))}

</div>

)}

</div>

);

}