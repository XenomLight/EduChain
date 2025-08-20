import { Router, Request, Response } from "express";
import * as path from "path";
import * as fs from "fs";
import fetch from "node-fetch";

const router: Router = Router();



// Helper untuk baca JSON file lokal
function readCourseFile(filename: string) {
  const filePath = path.join(__dirname, "course", filename);
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}


// Endpoint Khan Academy

router.get("/khanacademy", (req: Request, res: Response) => {
  try {
    res.json(readCourseFile("courseKhanAcademy.json"));
  } catch (error) {
    console.error("Error reading Khan Academy JSON:", error);
    res.status(500).json({ error: "Failed to load Khan Academy courses" });
  }
});


// Endpoint Coursera

router.get("/coursera", (req: Request, res: Response) => {
  try {
    res.json(readCourseFile("courseCousera.json"));
  } catch (error) {
    console.error("Error reading Coursera JSON:", error);
    res.status(500).json({ error: "Failed to load Coursera courses" });
  }
});


export default router;
