import React from "react";
import * as XLSX from "xlsx";

interface Appointment {
  id: string;
  location_name: string;
  start_at: string;
  end_at: string;
  patient_guid: string;
  patient_number: string;
  patient_prefix: string;
  patient_first_name: string;
  patient_preferred_name: string;
  patient_last_name: string;
  treatment_name: string;
  staff_member_name: string;
  break: string;
  insurance_state: string;
  state: string;
  first_visit: string;
  chart_status: string;
  notes_text: string;
  visit_type: string; 
}

function Test() {
  const handleFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files![0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // convert excel sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1, 
    });

    const headers: string[] = jsonData[0] as string[];

    // these are target columns in excel sheet
    const relevantColumns = [
      "id", "location_name", "start_at", "end_at", "patient_guid", 
      "patient_number", "patient_prefix", "patient_first_name", 
      "patient_preferred_name", "patient_last_name", "treatment_name", 
      "staff_member_name", "break", "insurance_state", "state", 
      "first_visit", "chart_status", "notes_text"
    ];

    // get idx of target columns 
    const columnIndexes = relevantColumns.map((col) => headers.indexOf(col));

    // get info from each col for each appointment
    const extractedAppointments: Appointment[] = (jsonData.slice(1) as any[]).map((row: string[]) => {
      const appointment = {} as Appointment;

      relevantColumns.forEach((column, index) => {
        appointment[column as keyof Appointment] = row[columnIndexes[index]] || "";
      });

      // get visit type from treatment_name
      const treatment = appointment.treatment_name.toLowerCase();
      let visitType = ""

      if (treatment.includes("telehealth")) {
        visitType = "telehealth";
      } else if (treatment.includes("home visit")) {
        visitType = "home visit";
      } else if (treatment.includes("dc office")) {
        visitType = "dc office";
      }

      appointment.visit_type = visitType;

      return appointment;
    });

    console.log(extractedAppointments);  
  };

  const printFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleFile(e);
  };

  return (
    <>
      <h1>Parse</h1>
      <input
        className="border-1 border-solid"
        type="file"
        onChange={(e) => printFile(e)}
      />
    </>
  );
}

export default Test;