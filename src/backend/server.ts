import * as express from "express";
import qrisRouter from "./qris";
import callbackRouter from "./callback";
import * as cors from "cors";
// import * as path from "path";
// import * as fs from "fs";
import coursesRouter from "./courses";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/qris", qrisRouter);
app.use("/api/callback", callbackRouter);
app.use("/api/courses", coursesRouter);
app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});

// Endpoint untuk kirim JSON kursus Khan Academy
// app.get("/api/courses/khanacademy", (req, res) => {
//   const filePath = path.join(__dirname, "course", "courseKhanAcademy.json");
//   const data = fs.readFileSync(filePath, "utf-8");
//   res.json(JSON.parse(data));
// });