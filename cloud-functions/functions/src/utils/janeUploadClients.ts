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
    const matchingHeaders = headers.filter((h: string) =>
      requiredHeaders.includes(h),
    );
    if (matchingHeaders.length !== requiredHeaders.length) {
      console.log(matchingHeaders);
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

    jsonArray = (xlsxDataArray.slice(1) as string[][]).map((data: string[]) => {
      const jsonObj: Record<string, string> = {};
      requiredHeaders.slice().forEach((columnName, idx) => {
        // add key pair value for relevant columns
        jsonObj[columnName] = data[columnIndices[idx]];
      });
      return jsonObj;
    });
  }

  // parse raw json data into client type or baby type
  const clientList: Client[] = [];
  const babyList: Baby[] = [];
  jsonArray.forEach((jsonObj) => {
    // skip rows with undefined patient numbers
    if (
      jsonObj["Patient Number"] !== undefined &&
      jsonObj["Patient Number"].toString().trim() !== ""
    ) {
      if (
        jsonObj["Preferred Name"]?.toLowerCase().includes("baby") ||
        jsonObj["Preferred Name"]?.toLowerCase().includes("twin") ||
        jsonObj["First Name"]?.toLowerCase().includes("baby") ||
        jsonObj["First Name"]?.toLowerCase().includes("twin")
      ) {
        babyList.push(parseBaby(jsonObj));
      } else {
        clientList.push(parseClient(jsonObj));
      }
    }
  });

  return { clientList, babyList };
}

function parseClient(clientRawData: any) {
  const client = {} as Client;
  client.id = clientRawData["Patient Number"].trim();

  client.email =
    clientRawData.Email === undefined || clientRawData.Email.trim() === ""
      ? "N/A"
      : clientRawData.Email.trim();

  client.firstName =
    clientRawData["First Name"] === undefined ||
      clientRawData["First Name"].trim() === ""
      ? "N/A"
      : clientRawData["First Name"].trim();
  client.lastName =
    clientRawData["Last Name"] === undefined ||
      clientRawData["Last Name"].trim() === ""
      ? "N/A"
      : clientRawData["Last Name"].trim();

  client.baby = [];

  if (
    clientRawData["Middle Name"] !== undefined &&
    clientRawData["Middle Name"].length !== 0
  ) {
    client.middleName = clientRawData["Middle Name"].trim();
  }
  if (
    clientRawData["Insurance Company Name"] !== undefined &&
    clientRawData["Insurance Company Name"].length !== 0
  ) {
    client.insurance = clientRawData["Insurance Company Name"].trim();
  }
  if (
    clientRawData["Mobile Phone"] !== undefined &&
    clientRawData["Mobile Phone"].length !== 0
  ) {
    client.phone = clientRawData["Mobile Phone"].trim();
  }

  return client;
}

function parseBaby(babyRawData: any) {
  const baby = {} as Baby;
  baby.id = babyRawData["Patient Number"].trim();

  const birthDateStr = babyRawData["Birth Date"]?.trim();
  if (birthDateStr) {
    const date = new Date(birthDateStr);
    if (!isNaN(date.getTime())) {
      baby.dob = date.toISOString();
    }
  } else {
    baby.dob = "N/A";
  }
  baby.firstName =
    babyRawData["First Name"] === undefined ||
      babyRawData["First Name"].trim() === ""
      ? "N/A"
      : babyRawData["First Name"].trim();
  // "baby" or "twin" may be in first name
  baby.firstName = baby.firstName.replace(/(twin)*(baby)*(\s)*/i, "");

  baby.lastName =
    babyRawData["Last Name"] === undefined ||
      babyRawData["Last Name"].trim() === ""
      ? "N/A"
      : babyRawData["Last Name"].trim();

  if (
    babyRawData["Middle Name"] !== undefined &&
    babyRawData["Middle Name"].length !== 0
  ) {
    baby.middleName = babyRawData["Middle Name"];
  }

  return baby;
}
