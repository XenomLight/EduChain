import * as express from "express";
import qrisRouter from "./qris";
import callbackRouter from "./callback";
import * as cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/qris", qrisRouter);
app.use("/api/callback", callbackRouter);

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
