import * as XLSX from "xlsx";
import csv from "csvtojson";
import { JaneAppt, VisitType } from "../types/janeType";

export async function parseAppointmentSheet(
  fileName: string,
  fileAsBuffer: Buffer<ArrayBufferLike>,
) {
  const parts = fileName.split(".");
  let isCsv = false;

  const extension = parts.length > 1 ? parts.pop()!.toLowerCase() : "";
  if (extension === "csv") {
    isCsv = true;
  } else if (extension !== "xlsx") {
    return "error not csv/xlsx";
  }

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

  if (isCsv) {
    const fileAsString = fileAsBuffer.toString();
    jsonArray = await csv().fromString(fileAsString);
    const headers = Object.keys(jsonArray[0]);
    const missing = headers.filter((h: string) => requiredHeaders.includes(h));
    if (missing.length !== 9) {
      console.log(missing);
      return "Missing headers";
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
      return "Missing headers";
    }

    // convert the array of string arrays into array of json objects
    jsonArray = (xlsxDataArray.slice(1) as any[]).map((data: string[]) => {
      const jsonObj = {};
      requiredHeaders.forEach((columnName, idx) => {
        // add key pair value for relevant columns
        (jsonObj as any)[columnName] = data[columnIndices[idx]];

        // need to convert date at all???
        // if (columnName === "start_at" || columnName === "end_at") {
        //   // remove the timezone so that ISO string will be consistent later on?
        //   const value = (jsonObj as any)[columnName];
        //   if (value.includes("-0400")) {
        //     (jsonObj as any)[columnName] = data[columnIndices[idx]].slice(
        //       0,
        //       -6,
        //     );
        //   }
        // }
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
