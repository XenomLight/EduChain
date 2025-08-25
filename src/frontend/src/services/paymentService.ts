// src/frontend/src/services/paymentService.ts
export async function createQrisPayment(amount: number, referenceNo: string) {
  const res = await fetch("http://localhost:5000/api/qris", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, referenceNo }),
  });

  if (!res.ok) throw new Error("Failed to create payment");
  return res.json();
}
