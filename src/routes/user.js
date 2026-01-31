const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");
//Get all pending connection request for all user

const USER_SAFE_DATA = "firstName lastName photoURL age gender about skills";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId",USER_SAFE_DATA);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});


userRouter.get("/user/requests/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: "accepted",
    }).populate("fromUserId toUserId",USER_SAFE_DATA);

    const data = connections.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
  });

    res.json({
      message: "Data fetched successfully",
      data: data,
    });
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  } 
});


userRouter.get("/feed", userAuth, async (req, res) => {
  try {

    const loggedInUser = req.user; 
    const page = req.params.page ? parseInt(req.params.page) : 1;
    const limit = req.params.limit ? parseInt(req.params.limit) : 10;
    const skip = (page - 1) * limit;        


    //Find all connection req whom i sent or received
    const connectionRequests = await ConnectionRequest.find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
        status: { $in: ["accepted", "interested"] },
      }).select("fromUserId toUserId");

    //Extract userIds from connection requests
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((request) => {
        hideUsersFromFeed.add(request.fromUserId.toString());
        hideUsersFromFeed.add(request.toUserId.toString());
    });

    //Find users who are not in hideUsersFromFeed
    const feedUsers = await User.find({
    $and:[{_id: { $nin: Array.from(hideUsersFromFeed) }},
          { _id: { $ne: loggedInUser._id }}
         ]
      }).select("-password -email -createdAt -updatedAt -__v").skip(skip).limit(limit);

    res.json({
      message: "Feed users fetched successfully",
      data: feedUsers,
    });


  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});




module.exports = { userRouter };
