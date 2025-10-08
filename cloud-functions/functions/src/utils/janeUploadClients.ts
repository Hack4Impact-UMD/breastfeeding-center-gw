import csv from "csvtojson";
import { Baby, Client } from "../types/ClientType";

export async function parseClientSheet(
  fileName: string,
  fileAsBuffer: Buffer<ArrayBufferLike>,
) {
  const parts = fileName.split(".");
  let isCsv = false;

  let extension = parts.length > 1 ? parts.pop()!.toLowerCase() : "";
  if (extension === "csv") {
    isCsv = true;
  } else if (extension !== "xlsx") {
    return "error not csv/xlsx";
  }

  const requiredHeaders = [
    "patient_number",
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
    // watch out for dob being string or number maybe
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

  return [clientList, babyList];
}

function parseClient(clientRawData: any) {
  const client = {} as Client;
  client.id = clientRawData["Patient Number"].trim();
  client.email = clientRawData.Email.trim();
  client.firstName = clientRawData["First Name"].trim();
  client.lastName = clientRawData["Last Name"].trim();
  if (clientRawData["Middle Name"].length !== 0) {
    client.middleName = clientRawData["Middle Name"];
  }
  if (clientRawData["Insurance Company Name"].length !== 0) {
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

  if (babyRawData["Middle Name"].length !== 0) {
    baby.middleName = babyRawData["Middle Name"];
  }

  return baby;
}
