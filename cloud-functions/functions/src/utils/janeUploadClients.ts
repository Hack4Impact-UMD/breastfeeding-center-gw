import csv from "csvtojson";
import * as XLSX from "xlsx";
import { Baby, Client } from "../types/clientTypes";

export async function parseClientSheet(
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
    "Patient Number",
    "First Name",
    "Middle Name",
    "Last Name",
    "Email",
    "Mobile Phone",
    "Insurance Company Name",
    "Preferred Name",
    "Birth Date",
  ];

  let jsonArray = [];

  if (isCsv) {
    const fileAsString = fileAsBuffer.toString();
    jsonArray = await csv().fromString(fileAsString);
    const headers = Object.keys(jsonArray[0]);
    const missing = headers.filter((h: string) => requiredHeaders.includes(h));
    if (missing.length !== 8) {
      console.log(missing);
      return "Missing headers";
    }
  } else {
    // xlsx here
    const workbook = XLSX.read(fileAsBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const xlsxDataArray = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      raw: true,
    });

    const headers: string[] = xlsxDataArray[0] as string[];
    console.log("headers", headers);
    const columnIndices = requiredHeaders.map((col) => headers.indexOf(col));
    // requiredHeaders.forEach((h) => {
    //   if (headers.indexOf(h) === -1) {
    //     console.log(h, "is missing");
    //   }
    // });
    if (columnIndices.includes(-1)) {
      console.log("missing");
      return "Missing headers";
    }

    // console.log(xlsxDataArray);
    // console.log(columnIndices);

    jsonArray = (xlsxDataArray.slice(1) as any[]).map((data: string[]) => {
      const jsonObj = {};
      requiredHeaders.forEach((columnName, idx) => {
        // add key pair value for relevant columns
        (jsonObj as any)[columnName] = data[columnIndices[idx]];
        // console.log(columnName, data[columnIndices[idx]]);

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
  // parse raw json data into client type
  // check if baby or client by looking at preferred name
  // call appropriate function
  const clientList: Client[] = [];
  const babyList: Baby[] = [];
  jsonArray.forEach((jsonObj) => {
    if (jsonObj["Preferred Name"].toLowerCase().includes("baby")) {
      babyList.push(parseBaby(jsonObj));
    } else {
      clientList.push(parseClient(jsonObj));
    }
  });

  return { clientList, babyList };
}

function parseClient(clientRawData: any) {
  const client = {} as Client;
  client.id = clientRawData["Patient Number"].trim();
  client.email = clientRawData.Email.trim();
  client.firstName = clientRawData["First Name"].trim();
  client.lastName = clientRawData["Last Name"].trim();
  if (
    clientRawData["Middle Name"] !== undefined &&
    clientRawData["Middle Name"].length !== 0
  ) {
    client.middleName = clientRawData["Middle Name"];
  }
  if (
    clientRawData["Insurance Company Name"] !== undefined &&
    clientRawData["Insurance Company Name"].length !== 0
  ) {
    client.insurance = clientRawData["Insurance Company Name"];
  }
  return client;
}

function parseBaby(babyRawData: any) {
  const baby = {} as Baby;
  baby.id = babyRawData["Patient Number"].trim();
  baby.dob = new Date(babyRawData["Birth Date"].trim()).toISOString();
  baby.firstName = babyRawData["First Name"].trim();
  baby.lastName = babyRawData["Last Name"].trim();

  if (
    babyRawData["Middle Name"] !== undefined &&
    babyRawData["Middle Name"].length !== 0
  ) {
    baby.middleName = babyRawData["Middle Name"];
  }

  return baby;
}
