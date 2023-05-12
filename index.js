import express from "express";
import db from "./config/database.js";
import dotenv from "dotenv";
// import Users from "./models/userModel.js";
import Mahasiswa from "./models/mahasiswaModel.js";
import Ipk from "./models/ipkModel.js";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

try {
  await db.authenticate();
  console.log("Database Connected ...");
  await Mahasiswa.sync();
  await Ipk.sync();
} catch (error) {
  console.error(error);
}

app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(5000, () => console.log("server running at port 5000"));
