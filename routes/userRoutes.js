const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { jwtAuthMiddleware, generateToken } = require("../jwt");
router.post("/signup", async (req, res) => {
  try {
    const userData = req.body;
    const newUser = new User(userData);
    if (newUser.role === "admin") {
      const user = await User.find();
      if (user.length > 0) {
        for(let i=0;i<user.length;i++){
          if(user[i].role==='admin'){
            return res.status(401).json({ err: "Admin already exists" });
          }
        }
      }
    }
    const response = await newUser.save();
    const payload = {
      id: response.id,
    };
    const token = generateToken(payload);
    return res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: "Internal server error" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { aadharNumber, password } = req.body;
    const user = await User.findOne({ aadharNumber: aadharNumber });
    if (!user) {
      res.status(404).json({ err: "User not found" });
    }
    const isMatchPassword = await user.toCompare(password);
    if (isMatchPassword) {
      const payload = {
        id: user.id,
      };
      const token = generateToken(payload);
      res.status(200).json({ token: token });
    } else {
      res.status(401).json({ err: "Invalid password" });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: "Internal server error" });
  }
});
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.userPayload;
    const userId = userData.id;
    const user = await User.findById(userId);
    res.status(200).json({ user: user });
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: "Internal server error" });
  }
});
router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.userPayload.id;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    const isMatch = await user.toCompare(oldPassword);
    if (!isMatch) {
      res.status(401).json({ err: "Invalid password" });
    } else {
      user.password = newPassword;
      const response = await user.save();
      res.status(200).json({ response: response });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: "Internal server error" });
  }
});

module.exports = router;
