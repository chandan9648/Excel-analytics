import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// signup controller
export const signup = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const trimmedEmail = email.toLowerCase().trim();
    const trimmedPassword = password.trim();
    const existing = await User.findOne({ email: trimmedEmail });

    if (existing) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    
    const user = await User.create({
      name,
      email: trimmedEmail,
      password: trimmedPassword,
      role,
    });

    return res.status(201).json({
      msg: 'User registered successfully',
      data: {
       role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// login controlller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = email.toLowerCase().trim();
    const trimmedPassword = password.trim();

    const user = await User.findOne({ email: trimmedEmail });
      //  console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }


    const isMatch = await bcrypt.compare(trimmedPassword, user.password);
      //  console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email/password' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
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
      }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



