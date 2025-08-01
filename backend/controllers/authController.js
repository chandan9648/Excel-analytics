import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// signup controller
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const trimmedEmail = email.toLowerCase().trim();
    const trimmedPassword = password.trim();
    const existing = await User.findOne({ email: trimmedEmail });

    if (existing) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
    
    const user = await User.create({
      name,
      email: trimmedEmail,
      password: trimmedPassword,
      role
      
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


// login controlller
export const login = async (req, res) => {
  try {
    const { email, password, role} = req.body;
    const trimmedEmail = email.toLowerCase().trim();
    const trimmedPassword = password.trim();

    const user = await User.findOne({ email: trimmedEmail});
      //  console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }


    const isMatch = await bcrypt.compare(trimmedPassword, user.password);
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
        // name: user.name,
        email: user.email,
        role: user.role,
      },
      
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// loggedin count
export const getLoggedInUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ lastLogin: { $ne: null } });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: "Failed to get user count", error: err.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const total = await User.countDocuments();
    const loggedIn = await User.countDocuments({ lastLogin: { $ne: null } });

    return res.json({
      total,
      loggedIn,
    });
  } catch (err) {
    return res.status(500).json({ msg: "Failed to get user stats", error: err.message });
  }
};






// Get total user count
export const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch user count' });
  }
};



