import {Router} from "express"
import {registerUser,loginUser,logoutUser,refreshAccessToken,addWorkout,getUserDashboard,getWorkoutsByDate,calculateProgress } from "../controllers/User.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)

router.route("/dashboard").get(verifyJWT,getUserDashboard)
router.route("/workout").get(verifyJWT,getWorkoutsByDate)
router.route("/workout").post(verifyJWT,addWorkout)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/progress/:id").get(verifyJWT,calculateProgress)


export default router