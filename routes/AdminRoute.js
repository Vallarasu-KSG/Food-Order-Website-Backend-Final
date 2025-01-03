import express from "express";
import { loginUser, registerUser } from "../controllers/AdminController.js";

const AdminRoute = express.Router()

AdminRoute.post("/register",registerUser)
AdminRoute.post("/login",loginUser)

export default AdminRoute;