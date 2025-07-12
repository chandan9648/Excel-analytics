import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';



// Signup controller
export const signup = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

const trimmedEmail = email.toLowerCase().trim()

    const existing = await User.findOne({ email: trimmedEmail });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const hashed = await bcrypt.hash(password.trim(), 10);

    const user = await User.create({
      name, 
      email: trimmedEmail,
      password: hashed,
      role,
    });

    res.status(201).json({
      msg: 'User signuped!',
      data: { role: user.role }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// LOGIN controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

        const trimmedEmail = email.toLowerCase().trim();
    const trimmedPassword = password.trim();

    const user = await User.findOne({ email: trimmedEmail });
    if (!user) 
      return res.status(400).json({ msg: 'Invalid credential' });

    const isMatch = await bcrypt.compare(trimmedPassword, user.password);
    if (!isMatch)
       return res.status(400).json({ msg: 'Invalid email / password' });

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};