import * as XLSX from "xlsx";
import csv from "csvtojson";
import { JaneAppt, VisitType } from "../types/janeType";
// import { logger } from "firebase-functions";

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
    if (!fileAsString.trim()) throw new Error("Empty file");
    jsonArray = await csv().fromString(fileAsString);
    if (jsonArray.length === 0) throw new Error("Empty file");
    const headers = Object.keys(jsonArray[0] ?? {});

    const matchingHeaders = headers.filter((h: string) =>
      requiredHeaders.includes(h),
    );
    if (matchingHeaders.length !== requiredHeaders.length) {
      throw new Error("Missing headers");
    }
  } else {
    const workbook = XLSX.read(fileAsBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const xlsxDataArray = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      raw: false,
    });

    if (!xlsxDataArray || xlsxDataArray.length == 0) throw new Error("Empty file")

    const headers: string[] = xlsxDataArray[0] as string[];
    const columnIndices = requiredHeaders.map((col) => headers.indexOf(col));
    if (columnIndices.includes(-1)) {
      throw new Error("Missing headers");
    }

    // convert the array of string arrays into array of json objects
    jsonArray = (xlsxDataArray.slice(1) as string[][]).map((data: string[]) => {
      const jsonObj: Record<string, string> = {};
      requiredHeaders.forEach((columnName, idx) => {
        // add key pair value for relevant columns
        jsonObj[columnName] = data[columnIndices[idx]];
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
  const babyAppts: JaneAppt[] = []

  // looping through each element in jsonArray to turn into JaneAppt obj
  for (const rawAppt of jsonArray) {
    // parsing rawAppt data in jsonArray and adding it to appointments list

    const appt = parseAppointment(rawAppt);


    // only push if appt is not null (ids not found)
    if (appt) {
      if (isBabyAppt(rawAppt)) {
        // logger.info("baby appt found!", appt);
        babyAppts.push(appt);
      }
      appointments.push(appt);
      // parsing rawAppt data in jsonArray and adding it to patientNames list
      patientNames[String(rawAppt.patient_number)] = {
        firstName: (String(rawAppt.patient_first_name ?? "").trim() || "N/A"),
        lastName: (String(rawAppt.patient_last_name ?? "").trim() || "N/A"),
      };
    }
  }

  return { appointments, patientNames, babyAppts };
}

function isBabyAppt(appt: Record<string, string>) {
  const firstName = appt.patient_first_name ?? "";
  const preferredName = appt.patient_preferred_name ?? "";
  const lastName = appt.patient_last_name ?? "";

  return ((firstName + lastName + preferredName).toLowerCase().includes("baby") || (firstName + lastName + preferredName).toLowerCase().includes("twin"))
}

function parseAppointment(appt: Record<string, string>) {
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

      const idx = fullServiceType.indexOf("telehealth") + 10;
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
