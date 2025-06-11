import {User} from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

export const signup = async (req, res) => {
    const {email, password, name} = req.body;

    try {
        if(!email || !password || !name){
            throw new Error("All fields are required")
        }

        const userAlreadyExists = await User.findOne({email});
        console.log("User Already Exists: ", userAlreadyExists);

        if(userAlreadyExists){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const verificationToken = Math.floor(100000 + Math.random() * 900000);

        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        })
        await user.save();

        //jwt 
        generateTokenAndSetCookie(res, user._id);

        sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully"
            ,
            user: {
                ...user._doc,
                password: undefined,
            }
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}
export const verifyEmail = async (req, res) => {
    const {code} = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: {$gt: Date.now()},
        });

        if(!user) {
            return res.status(400).json({
                success:false,
                message: "Invalid or expired verification code"
            })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user:{
                ...user._doc,
                password: undefined,
            }
        })

    } catch (error) {
        console.log("Error in verifyEmail", error);
        res.status(500).json({
            success:false,
            message: "Server error"
        })
    }
}
export const login = async (req, res) => {
    
}
export const logout = async (req, res) => {

}
export const forgotPassword = async (req, res) => {

}
export const resetPassword = async (req, res) => {

}
export const checkAuth = async (req, res) => {

}