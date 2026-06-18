export const formatDate = (date: Date | string | null) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};