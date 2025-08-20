import * as express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  const { referenceNo, amount, status } = req.body;

  console.log(" Callback diterima:", { referenceNo, amount, status });

  res.json({
    resultCd: "0000",
    resultMsg: "Callback diterima",
    referenceNo,
    amount,
    status,
  });
});

export default router;
