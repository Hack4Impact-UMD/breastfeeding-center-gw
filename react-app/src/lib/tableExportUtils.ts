import { download, generateCsv, mkConfig } from "export-to-csv";


type CsvPrimitive = string | number | boolean | null | undefined;

const flattenObject = (
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, CsvPrimitive> => {
  if (obj === null || typeof obj !== "object") {
    return {};
  }
  return Object.keys(obj).reduce(
    (acc: Record<string, CsvPrimitive>, key) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      if (value && typeof value === "object" && !Array.isArray(value)) {
        Object.assign(
          acc,
          flattenObject(value as Record<string, unknown>, newKey)
        );
      } else if (Array.isArray(value)) {
        acc[newKey] = value.join(", ");
      } else {
        acc[newKey] = value as CsvPrimitive;
      }
      return acc;
    },
    {}
  );
};

export const exportCsv = (jsonData: Record<string, unknown>[], fileName?: string) => {
  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
    filename: fileName
  });

  const generator = generateCsv(csvConfig);
  const downloader = download(csvConfig);
  if (!jsonData || jsonData.length === 0) {
    console.warn("No data to export");
    return;
  }

  try {
    const flattenedData = jsonData.map((row) => flattenObject(row));
    const csv = generator(flattenedData);
    downloader(csv);
  } catch (error) {
    console.error("Error exporting to CSV:", error);
  }
};


