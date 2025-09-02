export const normalizeFormat = (format: string) => {
  const loweredFormat = String(format || "").toLowerCase();

  if (loweredFormat.includes("blu")) return "Blu-Ray";
  if (loweredFormat.includes("vhs")) return "VHS";

  return "DVD";
};
