import * as XLSX from "xlsx";
import csv from "csvtojson";
import { JaneAppt, VisitType } from "../types/janeType";

export async function parseAppointmentSheet(
  fileType: string,
  fileAsBuffer: Buffer<ArrayBufferLike>,
) {
  const requiredHeaders = [
    "id",
    "patient_number",
    "patient_first_name",
    "patient_last_name",
    "start_at",
    "end_at",
    "treatment_name",
    "staff_member_name",
    "first_visit",
  ];

  let jsonArray = [];
  const isCsv = fileType === "csv";

  if (isCsv) {
    const fileAsString = fileAsBuffer.toString();
    jsonArray = await csv().fromString(fileAsString);
    const headers = Object.keys(jsonArray[0]);
    const missing = headers.filter((h: string) => requiredHeaders.includes(h));
    if (missing.length !== 9) {
      throw new Error("Missing headers");
    }
  } else {
    const workbook = XLSX.read(fileAsBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const xlsxDataArray = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      raw: true,
    });

    const headers: string[] = xlsxDataArray[0] as string[];
    const columnIndices = requiredHeaders.map((col) => headers.indexOf(col));
    if (columnIndices.includes(-1)) {
      throw new Error("Missing headers");
    }

    // convert the array of string arrays into array of json objects
    jsonArray = (xlsxDataArray.slice(1) as any[]).map((data: string[]) => {
      const jsonObj = {};
      requiredHeaders.forEach((columnName, idx) => {
        // add key pair value for relevant columns
        (jsonObj as any)[columnName] = data[columnIndices[idx]];
      });
      return jsonObj;
    });
  }
  console.log(jsonArray);

  type PatientInfo = {
    firstName: string;
    lastName: string;
  };

  // initializing the objects to return
  const patientNames: { [id: string]: PatientInfo } = {};
  const appointments: JaneAppt[] = [];

  // looping through each element in jsonArray to turn into JaneAppt obj
  for (const rawAppt of jsonArray) {
    // parsing rawAppt data in jsonArray and adding it to appointments list
    const appt = parseAppointment(rawAppt);
    appointments.push(appt);

    // parsing rawAppt data in jsonArray and adding it to patientNames list
    patientNames[rawAppt.patient_number] = {
      firstName: rawAppt.patient_first_name,
      lastName: rawAppt.patient_last_name,
    };
  }

  return { appointments, patientNames };
}

function parseAppointment(appt: any) {
  const janeAppt = {} as JaneAppt;
  janeAppt.apptId = appt.id;
  janeAppt.patientId = appt.patient_number.trim();
  janeAppt.clinician = appt.staff_member_name.trim();
  janeAppt.firstVisit = appt.first_visit.trim() === "true";

  // dates
  janeAppt.startAt = new Date(appt.start_at.trim()).toISOString();
  janeAppt.endAt = new Date(appt.end_at.trim()).toISOString();

  // parse visit type
  const fullServiceType = appt.treatment_name.replace(/:/g, "").trim();
  const serviceLowercase = fullServiceType.toLowerCase();
  // get service from the visit type
  let visitType: VisitType = "OFFICE"; // default
  let service = fullServiceType.trim();

  // NEED TO FIX - maybe find index of the word and then grab whatever is after that. shouldn't be hardcoded
  if (serviceLowercase.includes("telehealth short")) {
    visitType = "TELEHEALTH";
    service = fullServiceType.substring(17).trim();
  } else if (serviceLowercase.includes("telehealth")) {
    visitType = "TELEHEALTH";
    service = fullServiceType.substring(11).trim();
  } else if (serviceLowercase.includes("dc office")) {
    visitType = "OFFICE";
    service = fullServiceType.substring(10).trim();
  } else if (serviceLowercase.includes("home visit")) {
    visitType = "HOMEVISIT";
    service = fullServiceType.substring(11).trim();
  }

  janeAppt.visitType = visitType;
  janeAppt.service = service;

  return janeAppt;
}
