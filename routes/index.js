import express from "express";
import { getUsers, registerUser, loginUser, Logout } from "../controller/userController.js";
import { getAllMahasiswa, updateMahasiswa, deleteMahasiswa, createMahasiswa } from "../controller/mahasiswaController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controller/refreshToken.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.get("/mahasiswa", verifyToken, getAllMahasiswa);
router.delete("/mahasiswa/(:id)", verifyToken, deleteMahasiswa);
router.post("/mahasiswa/(:id)", verifyToken, updateMahasiswa);
router.post("/mahasiswa", verifyToken, createMahasiswa);
router.post("/users", registerUser);
router.post("/login", loginUser);
router.get("/token", refreshToken);
router.delete("/logout", Logout);

export default router;
