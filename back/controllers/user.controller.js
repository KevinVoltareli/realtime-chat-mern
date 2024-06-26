import User from "../models/user.model.js";

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (e) {
    console.log("Error in getUsersForSideBar", e.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default getUsersForSideBar;
