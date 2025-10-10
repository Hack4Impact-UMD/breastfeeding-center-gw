import csv from "csvtojson";
import * as XLSX from "xlsx";
import { Baby, Client } from "../types/clientTypes";

export async function parseClientSheet(
  fileType: string,
  fileAsBuffer: Buffer<ArrayBufferLike>,
) {
  const requiredHeaders = [
    "Patient Number",
    "First Name",
    "Last Name",
    "Email",
    "Birth Date",
    "Middle Name", // this and below do not need to be populated
    "Preferred Name",
    "Mobile Phone",
    "Insurance Company Name",
  ];

  let jsonArray = [];
  const isCsv = fileType === "csv";

  if (isCsv) {
    const fileAsString = fileAsBuffer.toString();
    jsonArray = await csv().fromString(fileAsString);
    const headers = Object.keys(jsonArray[0]);
    const missing = headers.filter((h: string) => requiredHeaders.includes(h));
    if (missing.length !== 8) {
      console.log(missing);
      throw new Error("Missing headers");
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
    if (columnIndices.includes(-1)) {
      throw new Error("Missing headers");
    }

    // console.log(xlsxDataArray);
    // console.log(columnIndices);

    jsonArray = (xlsxDataArray.slice(1) as any[]).map((data: string[]) => {
      const jsonObj = {};
      requiredHeaders.slice().forEach((columnName, idx) => {
        // add key pair value for relevant columns
        (jsonObj as any)[columnName] = data[columnIndices[idx]];
      });
      return jsonObj;
    });
  }

  // check array for any undefined values on required columns
  // const objsUndefinedData = jsonArray.filter((obj) =>
  //   requiredHeaders.slice(0, 5).forEach((h) => obj[h] === undefined),
  // );
  // if (objsUndefinedData.length !== 0) {
  //   console.log("required data missing");
  //   console.log(objsUndefinedData);
  //   return "error";
  // }

  // parse raw json data into client type or baby type
  const clientList: Client[] = [];
  const babyList: Baby[] = [];
  jsonArray.forEach((jsonObj) => {
    if (
      jsonObj["Preferred Name"]?.toLowerCase().includes("baby") ||
      jsonObj["Preferred Name"]?.toLowerCase().includes("twin")
    ) {
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
  client.middleName = clientRawData["Middle Name"]?.trim();
  client.insurance = clientRawData["Insurance Company Name"]?.trim();

  return client;
}

function parseBaby(babyRawData: any) {
  const baby = {} as Baby;
  baby.id = babyRawData["Patient Number"].trim();
  baby.dob = new Date(babyRawData["Birth Date"].trim()).toISOString();
  baby.firstName = babyRawData["First Name"].trim();
  baby.lastName = babyRawData["Last Name"].trim();
  baby.middleName = babyRawData["Middle Name"]?.trim();

  return baby;
}
