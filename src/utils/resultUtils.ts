// Helper function to format tuition fee
export function formatTuitionFee(fee: string): string {
  const numFee = parseFloat(fee);
  if (isNaN(numFee)) return fee;
  return `${(numFee / 1000000).toFixed(1)} triệu VNĐ`;
}
