const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.jwt || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const user = await User.findOne({
      refreshTokens: { $elemMatch: { token: refreshToken } }
    }).select('+refreshTokens');

    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err || decoded.id !== user._id.toString()) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      // 1) حذف التوكن القديم
      user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);

      // 2) إنشاء refresh token جديد
      const newRefreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      // 3) حفظ التوكن الجديد
      user.refreshTokens.push({
        token: newRefreshToken,
        device: req.headers["user-agent"] || "unknown"
      });

      await user.save();

      // 4) إرسال refresh token الجديد في cookie
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      // 5) إنشاء access token جديد
      const newAccessToken = jwt.sign(
        {
          UserInfo: {
            id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
      );

      res.json({ accessToken: newAccessToken });
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleRefreshToken };
