import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import sendEmail from '../email.js';


// SIGNUP
export const signup = async (req, res) => {
  
  try {
    const { name, email, password, role } = req.body;

    const effectiveRole = role || 'user';

    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    if (!['user', 'admin'].includes(effectiveRole)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }
  
    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }


    const trimmedEmail = email.trim().toLowerCase(); 
    const existing = await User.findOne({ email: trimmedEmail });

    if (existing) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const user = await User.create({
      name,
      email: trimmedEmail,
      password,
      role: effectiveRole,
    });


   //  Generate token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );


    
    //  Send welcome email using SendGrid
    await sendEmail(
      email,
      "Welcome to Our Platform 🎉",
      `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Welcome, ${user.name}!</h2>
        <p>We’re thrilled to have you on board.</p>
        <p>Explore your account and start using our services today.</p>
        <p><b>Role:</b> ${user.role}</p>
        <br/>
        <p>– The Team</p>
      </div>
      `
    );

    return res.status(201).json({
      msg: 'User registered successfully',
      token,
      data: {
      role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password} = req.body;
   const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email/password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
      //  console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email/password' });
    }

     user.lastLogin = new Date(); // ⏱️ save login time
      // console.log("Saving lastLogin for user:", user.email); 
     await user.save();


     //  Generate token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      msg: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// SENDGRID SETUP
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    const resetURL =`${process.env.CLIENT_URL}/reset-password/${token}`;
    const msg = {
      to: user.email,
      from: process.env.FROM_EMAIL,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetURL}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
    };

    await sgMail.send(msg);
    res.json({ message: "Reset link sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending reset email" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

   
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resetting password" });
  }
};