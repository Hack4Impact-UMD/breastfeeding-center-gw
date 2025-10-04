// import * as XLSX from "xlsx";
import csv from "csvtojson";
import { JaneAppt, VisitType } from "../../../../react-app/src/types/JaneType";

export async function parseAppointmentSheet(
  fileAsString: string,
  isCsv: boolean,
) {
  const jsonArray = await csv().fromString(fileAsString);

  const requiredHeaders = [
    "id",
    "patient_number",
    "start_at",
    "end_at",
    "treatment_name",
    "staff_member_name",
    "first_visit",
  ];
  const headers = Object.keys(jsonArray[0]);
  const missing = headers.filter((h: string) => requiredHeaders.includes(h));
  if (missing.length !== 7) {
    console.log(missing);
    return "Missing headers";
  }
  console.log(jsonArray);

  return jsonArray;
}

export function parseAppointmentRow(appt: any) {
  const janeAppt = {} as JaneAppt;
  janeAppt.apptId = appt.id.trim();
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
  let service = "";

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
// export async function getJaneTypes(
//   e: React.ChangeEvent<HTMLInputElement>,
// ): Promise<Jane[]> {
//   const file = e.target.files![0];
//   const data = await file.arrayBuffer();
//   const workbook = XLSX.read(data);
//   const worksheet = workbook.Sheets[workbook.SheetNames[0]];

//   const jsonData = XLSX.utils.sheet_to_json(worksheet, {
//     header: 1,
//     raw: true,
//   });

//   const headers: string[] = jsonData[0] as string[];

//   const relevantColumns = [
//     { excel: "id", json: "apptId" },
//     { excel: "patient_first_name", json: "firstName" },
//     { excel: "patient_last_name", json: "lastName" },
//     "treatment_name",
//     { excel: "insurance_state", json: "insurance" },
//     { excel: "start_at", json: "date" },
//   ];

//   const columnIndexes = relevantColumns.map((col) =>
//     headers.indexOf(typeof col === "string" ? col : col.excel),
//   );

//   const janes: Jane[] = (jsonData.slice(1) as any[]).map((row: string[]) => {
//     const jane = {} as Jane;

//     relevantColumns.forEach((column, index) => {
//       const columnName = typeof column === "string" ? column : column.json;
//       (jane as any)[columnName] = row[columnIndexes[index]] || "";

//       if (columnName === "date") {
//         const value = (jane as any)[columnName];
//         console.log(value, typeof value);

//         if (typeof value === "number") {
//           // Convert Excel serial number to JS Date
//           const date = new Date(Math.round((value - 25569) * 86400 * 1000));
//           // Format it as ISO or however you want
//           (jane as any)[columnName] = date.toISOString();
//         } else if (typeof value === "string" && value.trim() !== "") {
//           // If Excel or XLSX already parsed it into a string
//           const jsDate = new Date(value);
//           (jane as any)[columnName] = jsDate.toISOString();
//         }
//         console.log(jane.date);
//       }
//     });

//     // Process visit type and treatment from treatment_name
//     const fullServiceType = (row[columnIndexes[3]] || "")
//       .replace(/:/g, "")
//       .trim();
//     const serviceLowercase = fullServiceType.toLowerCase();

//     let visitType: VisitType = "OFFICE"; // default
//     let treatment = "";

//     if (serviceLowercase.includes("telehealth short")) {
//       visitType = "TELEHEALTH";
//       treatment = fullServiceType.substring(17).trim();
//     } else if (serviceLowercase.includes("telehealth")) {
//       visitType = "TELEHEALTH";
//       treatment = fullServiceType.substring(11).trim();
//     } else if (serviceLowercase.includes("dc office")) {
//       visitType = "OFFICE";
//       treatment = fullServiceType.substring(10).trim();
//     } else if (serviceLowercase.includes("home visit")) {
//       visitType = "HOMEVISIT";
//       treatment = fullServiceType.substring(11).trim();
//     }

//     jane.visitType = visitType;
//     jane.treatment = treatment;
//     delete (jane as any).treatment_name;

//     jane.email = "email@gmail.com"; // hardcoded
//     jane.babyDob = "01/01/2026"; // hardcoded

//     return jane;
//   });

//   return janes;
// }
