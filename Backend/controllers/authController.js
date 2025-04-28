import User from '../models/User.js';
import { generateToken } from '../config/jwt.js';
import bcrypt from 'bcryptjs'; // Ensure bcrypt is imported
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for token generation

// Register function
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const user = new User({
      name, // Using name as the field
      email,
      password: hashedPassword // Store the hashed password
    });

    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration Error:", err.message);
    return res.status(500).send('Server error');
  }
};

// Login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, name: user.name, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, fullName: user.name, email: user.email } // Use 'name' here or change to 'fullName' consistently
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get user info function
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
