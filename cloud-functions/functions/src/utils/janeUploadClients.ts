// import * as XLSX from "xlsx";
// import { Jane, VisitType } from "../types/JaneType";

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
