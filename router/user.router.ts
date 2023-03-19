import * as express from "express";
import { UserController } from "../src/controller/user.controller";
import { authJwt } from '../middleware/jwt';

const controller = new UserController()
const userRoute = express.Router()

userRoute.post("/register", controller.register)
userRoute.get("/profile", authJwt, controller.getProfile)
userRoute.post("/login", controller.login)

export default userRoute