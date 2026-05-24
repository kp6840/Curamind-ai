import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

import { Card,CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login(){

const {signIn}=useAuth();

const navigate=useNavigate();

const [form,setForm]=useState({

email:"",
password:"",
role:"admin"

});

const [error,setError]=useState("");

async function handleSubmit(e){

e.preventDefault();

try{

const {data,error}=await signIn(
form.email,
form.password
);

if(error) throw error;

/*
role stored in user metadata
*/

const role=
data.user?.user_metadata?.role
|| "admin";

if(role==="admin"){

navigate("/");

}
else if(role==="doctor"){

navigate("/doctors");

}
else if(role==="patient"){

navigate("/patients");

}

}catch(err){

setError(
err.message
);

}

}

return(

<div className="flex justify-center items-center min-h-screen">

<Card className="w-[400px]">

<CardContent className="p-6">

<h1 className="text-2xl font-bold mb-4">

CuraMind Login

</h1>

<form
onSubmit={handleSubmit}
className="space-y-4"
>

<select
className="w-full border p-2 rounded"
value={form.role}
onChange={(e)=>

setForm({

...form,
role:e.target.value

})

}
>

<option value="admin">

Admin

</option>

<option value="doctor">

Doctor

</option>

<option value="patient">

Patient

</option>

</select>

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
type="password"
placeholder="Password"
value={form.password}
onChange={(e)=>

setForm({

...form,
password:e.target.value

})

}
/>

{error && (

<p className="text-red-500">

{error}

</p>

)}

<Button
type="submit"
className="w-full"
>

Login

</Button>

</form>

</CardContent>

</Card>

</div>

);

}