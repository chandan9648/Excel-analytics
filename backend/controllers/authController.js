import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// signup 
export const signup = async (req, res) => {
  
  try {
    const { name, email, password, role  } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ msg: 'All fields are required' });
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
      role,
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


// login 
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










