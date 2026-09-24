export function formatCurrency(amount) {
  const numericAmount = typeof amount === "number" ? amount : parseFloat(amount) || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericAmount);
}
