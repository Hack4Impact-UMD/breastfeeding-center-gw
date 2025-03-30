import React from "react";
import * as XLSX from "xlsx";
function Test() {
  const handleFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<Array<{ parent: any; path: any }>> => {
    const file = e.target.files![0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    //const jsonData = XLSX.utils.sheet_to_json(worksheet);
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: ["parent", "path"],
      range: 1,
    }) as Array<{ parent: any; path: any }>;

    const parentValues = jsonData.map((row) => row.parent);

    const pathValues = jsonData.map((row) => row.path);

    console.log("Parent column values:", parentValues);
    console.log("Path column values:", pathValues);

    return jsonData;
  };

  const printFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = await handleFile(e);
    console.log(data);
  };

  return (
    <>
      <h1>Parse</h1>
      <input
        className="border-1 border-solid"
        type="file"
        onChange={(e) => printFile(e)}
      />
    </>
  );
}

export default Test;
