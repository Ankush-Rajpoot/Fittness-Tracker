import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
// mongoose-aggreagate-paginate-v2
const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        password: {
            type: String,
            type: String,
            required: function () {
                return !this.googleId; // Password required only for non-OAuth users
            },
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,  // `sparse` allows some users to have this field null
        },
        profileImage: {
            type: String,
        },
        age: {
            type: Number,
        },
        lastLogin:{
            type:Date,
            default:Date.now(),
        },
        accessToken: {
            type: String
        },
        refreshToken: {
            type: String
        },
        // isVerified:{
        //     type:Boolean,
        //     default:false,
        // },
        // resetPasswordToken: String,
		// resetPasswordExpiresAt: Date,
		// verificationToken: String,
		// verificationTokenExpiresAt: Date,  
    },
    {
        timestamps: true,
    }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);