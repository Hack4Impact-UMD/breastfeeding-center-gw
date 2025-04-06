import * as XLSX from "xlsx";

interface Appointment {
  date: string;
  patient_first_name: string;
  patient_last_name: string;
  treatment_name?: string;
  status: string;
  notes: string;
  visit_type: string;
  service: string;
}

export async function getAppointment(
  e: React.ChangeEvent<HTMLInputElement>
): Promise<Appointment[]> {
  const file = e.target.files![0];
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  // convert excel sheet to JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
  });

  const headers: string[] = jsonData[0] as string[];

  // these are target columns in excel sheet
  const relevantColumns = [
    { excel: "start_at", json: "date" },
    "patient_first_name",
    "patient_last_name",
    "treatment_name",
    { excel: "chart_status", json: "status" },
    { excel: "notes_text", json: "notes" },
  ];

  // get idx of target columns
  const columnIndexes = relevantColumns.map((col) =>
    headers.indexOf(typeof col === "string" ? col : col.excel)
  );

  // get info from each col for each appointment
  const extractedAppointments: Appointment[] = (jsonData.slice(1) as any[])
    .map((row: string[]) => {
      const appointment = {} as Appointment;

      relevantColumns.forEach((column, index) => {
        const columnName = typeof column === "string" ? column : column.json;
        appointment[columnName as keyof Appointment] =
          row[columnIndexes[index]] || "";
      });

      // filter out data where status is not signed
      if (appointment.status.toString().toLowerCase() !== "signed") {
        return null;
      }

      // get visit type from treatment_name
      const fullServiceType = appointment.treatment_name!.replace(/:/g, "");
      const serviceLowercase = fullServiceType.toLowerCase();
      appointment["date"] = appointment["date"].slice(0, 10);

      let visitType = "";
      let service = "";

      if (serviceLowercase.includes("telehealth short")) {
        visitType = "TELEHEALTH";
        service = fullServiceType.substring(17);
      } else if (serviceLowercase.includes("telehealth")) {
        visitType = "TELEHEALTH";
        service = fullServiceType.substring(11);
      } else if (serviceLowercase.includes("dc office")) {
        visitType = "DC Office";
        service = fullServiceType.substring(10);
      } else if (serviceLowercase.includes("home visit")) {
        visitType = "Home Visit";
        service = fullServiceType.substring(11);
      }

      appointment.visit_type = visitType;
      appointment.service = service;
      delete appointment.treatment_name;

      return appointment;
    })
    .filter((appointment): appointment is Appointment => appointment !== null);

  return extractedAppointments;
}
