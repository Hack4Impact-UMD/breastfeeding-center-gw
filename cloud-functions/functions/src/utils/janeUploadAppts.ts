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
    // only push if appt is not null (ids not found)
    if (appt) {
      appointments.push(appt);
      // parsing rawAppt data in jsonArray and adding it to patientNames list
      patientNames[rawAppt.patient_number] = {
        firstName:
          rawAppt.patient_first_name === undefined ||
          rawAppt.patient_first_name === ""
            ? "N/A"
            : rawAppt.patient_first_name.trim(),
        lastName:
          rawAppt.patient_last_name === undefined ||
          rawAppt.patient_last_name === ""
            ? "N/A"
            : rawAppt.patient_last_name.trim(),
      };
    }
  }

  return { appointments, patientNames };
}

function parseAppointment(appt: any) {
  const janeAppt = {} as JaneAppt;

  if (appt.id === undefined || appt.id.toString().trim() === "") {
    return null;
  }
  janeAppt.apptId = appt.id;

  if (
    appt.patient_number === undefined ||
    appt.patient_number.toString().trim() === ""
  ) {
    return null;
  }
  janeAppt.patientId = appt.patient_number.trim();

  janeAppt.clinician =
    appt.staff_member_name === undefined || appt.staff_member_name.trim() === ""
      ? "N/A"
      : appt.staff_member_name.trim();
  janeAppt.firstVisit =
    appt.first_visit === undefined || appt.first_visit.trim() === ""
      ? false
      : appt.first_visit.trim() === "true";

  // dates
  janeAppt.startAt =
    appt.start_at === undefined || appt.start_at.trim() === ""
      ? "N/A"
      : new Date(appt.start_at.trim()).toISOString();
  janeAppt.endAt =
    appt.end_at === undefined || appt.end_at.trim() === ""
      ? "N/A"
      : new Date(appt.end_at.trim()).toISOString();

  let visitType: VisitType = "OFFICE"; // default
  let service = "N/A";
  // parse visit type
  if (appt.treatment_name && appt.treatment_name.trim() !== "") {
    let fullServiceType = appt.treatment_name.replace(/:/g, "").trim();
    const serviceLowercase = fullServiceType.toLowerCase();

    // get service from the visit type
    service = fullServiceType.trim();

    if (serviceLowercase.includes("telehealth")) {
      visitType = "TELEHEALTH";
      // convert "telehealth short" to just "telehealth"
      fullServiceType = fullServiceType
        .replace(/telehealth(\s)*(short)*/i, "telehealth")
        .trim();

      let idx = fullServiceType.indexOf("telehealth") + 10;
      service = fullServiceType.substring(idx).trim();
    } else if (serviceLowercase.includes("office")) {
      visitType = "OFFICE";
      service = fullServiceType
        .substring(serviceLowercase.indexOf("office") + 6)
        .trim();
    } else if (serviceLowercase.includes("home visit")) {
      visitType = "HOMEVISIT";
      service = fullServiceType
        .substring(serviceLowercase.indexOf("home visit") + 10)
        .trim();
    }
  }

  janeAppt.visitType = visitType;
  janeAppt.service = service;

  return janeAppt;
}
