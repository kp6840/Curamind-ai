import React,{
createContext,
useContext,
useEffect,
useState
} from "react";

import { supabase } from "./supabaseClient";

const AuthContext=
createContext();

export function AuthProvider({
children
}){

const [user,setUser]=
useState(null);

const [loading,setLoading]=
useState(true);

useEffect(()=>{

async function getUser(){

const {
data:{session}
}=await supabase.auth.getSession();

setUser(
session?.user || null
);

setLoading(false);

}

getUser();

const {
data:{subscription}
}=supabase.auth.onAuthStateChange(
(event,session)=>{

setUser(
session?.user || null
);

}
);

return ()=>{

subscription.unsubscribe();

};

},[]);

async function signIn(
email,
password
){

return await supabase.auth
.signInWithPassword({

email,
password

});

}

async function signOut(){

await supabase.auth
.signOut();

setUser(null);

}

return(

<AuthContext.Provider
value={{

user,
loading,
signIn,
signOut

}}
>

{children}

</AuthContext.Provider>

);

}

export function useAuth(){

return useContext(
AuthContext
);

}