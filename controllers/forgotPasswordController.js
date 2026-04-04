const User = require('../model/User');
const crypto = require('crypto');

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    res.json({
      message: "Reset link generated",
      resetUrl: `http://localhost:4000/resetPassword/reset-password/${resetToken}`
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { forgotPassword };