import { Router, Request, Response } from "express";
import * as path from "path";
import * as fs from "fs";

const router: Router = Router();

router.get("/khanacademy", (req: Request, res: Response) => {
  try {
    const filePath = path.join(__dirname, "course", "courseKhanAcademy.json");
    const data = fs.readFileSync(filePath, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    console.error("Error reading JSON:", error);
    res.status(500).json({ error: "Failed to load courses" });
  }
});

export default router;
