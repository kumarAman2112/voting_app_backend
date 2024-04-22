const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  aadharNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
});
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const salt=await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(user.password, salt);
    user.password=hashedPassword;
  }
  next();
});
userSchema.methods.toCompare=function(password){
    const isMatch=bcrypt.compare(password,this.password);
    return isMatch;
}
const User = mongoose.model("User", userSchema);
module.exports = User;
