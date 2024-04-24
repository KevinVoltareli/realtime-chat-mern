import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  console.log("Signup route reached");
  try {
    console.log("Signup request body:", req.body);
    const { fullname, username, password, confirmPassword, gender } = req.body;

    console.log({ fullname, username, password, confirmPassword, gender });
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords dont match" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "username already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //avatar
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username${username}`;

    const newUser = new User({
      fullname,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      //generate jwt token
      generateTokenAndSetCookie(newUser._id, res);

      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "invalid user data" });
    }
  } catch (e) {
    console.log("error in signup controller", e.message);
    res.status(500).json({ error: "internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      profilePic: user.profile,
    });
  } catch (e) {
    console.log("error in login controller", e.message);
    res.status(500).json({ error: "internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (e) {
    console.log("error in logout controller", e.message);
    res.status(500).json({ error: "internal server error" });
  }
};
