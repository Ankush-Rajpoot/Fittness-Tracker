import {Router} from "express"
import {registerUser,loginUser,logoutUser,getCurrentUser,refreshAccessToken,addWorkout,getUserDashboard,getWorkoutsByDate,calculateProgress,getUserProfile, checkAuth, getExercisesByBodyPart } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/dashboard").get(verifyJWT,getUserDashboard)
router.route("/workout").get(verifyJWT,getWorkoutsByDate)
router.route("/workout").post(verifyJWT,addWorkout)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/progress/:id").get(verifyJWT,calculateProgress)
router.route("/profile").get(verifyJWT, getUserProfile) // Add route for getting user profile
router.route("/check-auth").get(verifyJWT, checkAuth)
router.route("/exercises/:bodyPart").get(getExercisesByBodyPart)

export default router