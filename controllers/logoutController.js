const User = require('../model/User');

const logoutAll = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.refreshTokens = [];
    await user.save();

    res.clearCookie("jwt");

    res.json({ message: "Logged out from all devices" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { logoutAll };