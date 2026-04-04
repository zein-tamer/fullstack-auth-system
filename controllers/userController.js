const User = require('../model/User');
const bcrypt = require('bcrypt');


// create user

const createNewUser = async (req, res) => {
    try {
        const { name,email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password required' });
        }

        const duplicate = await User.findOne({ email });
        if (duplicate) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const hashedPwd = await bcrypt.hash(password, 10);

        const userObject = {
            name,
            email,
            password: hashedPwd
        };

        const user = await User.create(userObject);

        res.status(201).json({ message: `User ${user.name} created` });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




// ================= GET ALL USERS =================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .lean();

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET USER =================
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE USER =================
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name.trim();

    if (email) {
      const normalizedEmail = email.toLowerCase().trim();

      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(409).json({ message: "Email already in use" });
      }

      user.email = normalizedEmail;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Password too short" });
      }

      user.password = await bcrypt.hash(password, 12);
    }

    await user.save();

    res.json({ message: "User updated successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE USER =================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  createNewUser
};