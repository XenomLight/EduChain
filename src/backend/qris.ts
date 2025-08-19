import * as express from "express";
const router = express.Router();


router.post("/", (req, res) => {
  const { referenceNo, amount, billingNm, billingPhone, billingEmail } = req.body;

  if (!referenceNo || !amount || !billingNm || !billingPhone || !billingEmail) {
    return res.status(400).json({ error: "Semua field wajib diisi: amount, referenceNo, billingNm, billingPhone, billingEmail" });
  }

  // Generate QR dummy
  const qrContent = `DUMMYQR-${referenceNo}-${amount}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrContent)}&size=256x256`;

  res.json({
    qrContent,
    qrUrl,
    referenceNo,
    amount,
  });
});

export default router;
