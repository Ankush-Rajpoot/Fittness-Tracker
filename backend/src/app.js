import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { generateAccessAndRefereshTokens } from "./controllers/user.controller.js";
import { User } from "./models/user.model.js";
import dotenv from "dotenv";
import { google } from 'googleapis';

dotenv.config();

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (origin === process.env.CORS_ORIGIN || !origin) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization",
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Setup sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "xezfmrEV7hNa1nK4plYhnKvJKdPYvTo0",
    resave: false,
    saveUninitialized: true,
  })
);

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: [
        "profile",
        "email",
      ],
    },
    async (googleAccessToken, googleRefreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = new User({
            googleId: profile.id,
            fullName: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          });
          await user.save();
        }
        const { accessToken: jwtAccessToken, refreshToken: jwtRefreshToken } =
          await generateAccessAndRefereshTokens(user._id);
        user.accessToken = jwtAccessToken;
        user.refreshToken = jwtRefreshToken;
        await user.save();
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    const { accessToken, refreshToken } = req.user;
    console.log("authentication successful:", req.user);
    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .redirect("http://localhost:5173/dashboard");
  }
);

app.get("/login/success", async (req, res) => {
  if (req.user) {
    res.status(200).json({ message: "User Logged In", user: req.user });
  } else {
    res.status(400).json({ message: "Not Authorized" });
  }
});

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.redirect(process.env.CORS_ORIGIN);
  });
});

// routes import
import userRouter from "./routes/user.routes.js";
import fitnessRouter from "./routes/fitness.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);
// app.use("/api/v1/fitness", fitnessRouter);

export { app };