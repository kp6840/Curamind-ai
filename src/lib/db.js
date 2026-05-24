import { supabase } from "./supabaseClient";

/* =========================
   PATIENTS
========================= */

export const Patient = {
  async list() {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) throw error;

    return data;
  },

  async create(patient) {
    const { data, error } = await supabase
      .from("patients")
      .insert(patient)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async update(id, changes) {
    const { data, error } = await supabase
      .from("patients")
      .update(changes)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async delete(id) {
    const { error } = await supabase.from("patients").delete().eq("id", id);

    if (error) throw error;
  },
};

/* =========================
   DOCTORS
========================= */

export const Doctor = {
  async list() {
    const { data, error } = await supabase.from("doctors").select("*");

    if (error) {
      console.log("LIST ERROR:", error);
      throw error;
    }

    return data || [];
  },

  async create(doctor) {
    console.log("Doctor payload:", doctor);

    const { data, error } = await supabase
      .from("doctors")
      .insert([
        {
          name: doctor.name,
          email: doctor.email,
        },
      ])
      .select();

    if (error) {
      console.log("CREATE ERROR:", error);

      alert(JSON.stringify(error));

      throw error;
    }

    return data;
  },

  async update(id, changes) {
    const { data, error } = await supabase
      .from("doctors")
      .update(changes)
      .eq("id", id)
      .select();

    if (error) {
      console.log("UPDATE ERROR:", error);
      throw error;
    }

    return data;
  },
};

/* =========================
   APPOINTMENTS
========================= */

export const Appointment = {
  async list() {
    const { data, error } = await supabase.from("appointments").select("*");

    if (error) {
      console.log("LIST ERROR:", error);

      throw error;
    }

    return data || [];
  },

  async create(appointment) {
    console.log("Appointment payload:", appointment);

    const { data, error } = await supabase
      .from("appointments")
      .insert([appointment])
      .select();

    if (error) {
      console.log("CREATE ERROR:", error);

      alert(JSON.stringify(error));

      throw error;
    }

    return data;
  },

  async update(id, changes) {
    const { data, error } = await supabase
      .from("appointments")
      .update(changes)
      .eq("id", id)
      .select();

    if (error) {
      console.log("UPDATE ERROR:", error);

      throw error;
    }

    return data;
  },
};

/* =========================
   MEDICAL RECORDS
========================= */

export const MedicalRecord = {
  async list() {
    const { data, error } = await supabase.from("medical_records").select("*");

    if (error) {
      console.log(error);
      throw error;
    }

    return data || [];
  },

  async create(record) {
    console.log("Medical Record payload:", record);

    const { data, error } = await supabase
      .from("medical_records")
      .insert([record])
      .select();

    if (error) {
      console.log("CREATE ERROR:", error);

      alert(JSON.stringify(error));

      throw error;
    }

    return data;
  },

  async update(id, changes) {
    const { data, error } = await supabase
      .from("medical_records")
      .update(changes)
      .eq("id", id)
      .select();

    if (error) {
      throw error;
    }

    return data;
  },
};

/* =========================
   AUDIT LOGS
========================= */

export const AuditLog = {

async list(){

const {data,error}=await supabase
.from("audit_logs")
.select("*")
.order(
"created_at",
{ascending:false}
);

if(error){

console.log(error);

throw error;

}

return data || [];

},

async create(log){

const {data,error}=await supabase
.from("audit_logs")
.insert([log])
.select();

if(error){

console.log(
"Audit Log Error:",
error
);

throw error;

}

return data;

}

};

/* =========================
   DIAGNOSTIC REPORTS
========================= */

export const DiagnosticReport = {
  async list() {
    const { data, error } = await supabase
      .from("diagnostic_reports")
      .select("*");

    if (error) throw error;

    return data;
  },

  async create(report) {
    const { data, error } = await supabase
      .from("diagnostic_reports")
      .insert(report)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};

