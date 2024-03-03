const express = require("express");
const { Board } = require("../models/board");
const { User } = require("../models/user");
const { Task } = require("../models/task");
const { recentBoardManager } = require("../utils/recentBoardManager");

const boardRouter = express.Router();

// Get a single board
boardRouter.get("/getSingleBoard", async(req, res)=>{
  try {
      let {userId } = req.user
      let {boardId} = req.query
      let board = await Board.findById(boardId)

      if(!board){
          return res.status(404).send({ isOk : false, message : "Board Not Found with given Id"})
      }

      let task = await Task.find({board : boardId}).populate({
        path : "assignedTo",
        select : "name email avatar"
      })

      let obj = {
        unassinged : [],
        development : [],
        review : [],
        done : []
      }
     
      task.forEach(el => {
        if(el.category == "Unassigned"){
          obj.unassinged.push(el)
        }
        if(el.category == "In Development"){
          obj.development.push(el)
        }
        if(el.category == "Pending Review"){
          obj.review.push(el)
        }
        if(el.done == "Done"){
          obj.done.push(el)
        }
      })

      let updateRecent = await recentBoardManager(userId, board._id)

      if(!updateRecent) return res.status(400).send({isOk : false, message: "Something went Wrong while updating recent boards"})
      
      return res.status(200).send({isOk : true, message : "Here are your all boards.", board : {board, tasks : obj}})
  } catch (error) {
      return res.status(500).send({ isOk : false, message : "Internal Serval Error!", error : error.message})
  }
})
// Get all boards
boardRouter.get("/allBoards", async (req, res) => {
  try {
    let { userId } = req.user;

    let boards = await Board.find({
      $or: [
        { createdBy: userId },
        { members: { $in: userId } }
      ],
    });

    if (boards.length == 0) {
      return res.status(404).send({ isOk: false, message: "Create or join a new board" });
    }

    return res.status(200).send({
      isOk: true,
      message: "Here are your all boards.",
      boards: boards,
    });
  } catch (error) {
    return res.status(500).send({
      isOk: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
});

// Add a new board
boardRouter.post("/addBoard", async (req, res) => {
  try {
    const { boardName } = req.body;
    const { userId } = req.user;

    if (!boardName || !boardName.trim() || !boardName.length > 5) {
      return res.status(404).send({ isOk: false, message: "Please provide a valid name for board!" });
    }

    let newBoard = await Board.create({
      name: boardName,
      createdBy: userId,
    });

    if (!newBoard) {
      return res.status(404).send({ isOk: false, message: "Error while creating board!" });
    }

    let updateRecent = await recentBoardManager(userId, newBoard._id);

    if (!updateRecent) return res.status(400).send({ isOk: false, message: "Something went Wrong while updating recent boards" });

    return res.status(200).send({
      isOk: true,
      message: "New Board Created Successfully",
      board: newBoard,
    });
  } catch (error) {
    return res.status(500).send({
      isOk: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
});

// Get recently visited boards
boardRouter.get("/recentBoards", async (req, res) => {
  try {
    let { userId } = req.user;
    let user = await User.findById(userId).select('recentlyVisitedBoards');
    let recentBoards = await Board.find({
      _id: { $in: user.recentlyVisitedBoards },
    }).populate({
      path: "createdBy",
      select: "name email",
    });

    return res.status(200).send({
      isOk: true,
      message: "Here are your recently visited boards.",
      boards: recentBoards,
    });
  } catch (error) {
    return res.status(500).send({
      isOk: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
});

// Edit board name
boardRouter.put('/editBoard', async (req, res) => {
  try {
    let { userId } = req.user;
    let { boardId } = req.query;
    let { boardName } = req.body;

    if (!boardId) {
      return res.status(404).send({ isOk: false, message: "Please Provide Board Id" });
    }

    let board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).send({ isOk: false, message: "Board with given Id not found" });
    }

    if (board.createdBy != userId) {
      return res.status(400).send({ isOk: false, message: "You Don't Have access to edit other's board" });
    }

    board.name = boardName;
    await board.save();

    return res.status(200).send({
      isOk: true,
      message: "Board name edited successfully.",
      board: board,
    });

  } catch (error) {
    return res.status(500).send({
      isOk: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
});

// Delete a board
boardRouter.delete("/deleteBoard", async (req, res) => {
  try {
    let { userId } = req.user;
    let { boardId } = req.query;

    if (!boardId) {
      return res.status(404).send({ isOk: false, message: "Please provide boardId" });
    }

    let board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).send({ isOk: false, message: "Board with given Id not found" });
    }

    if (board.createdBy != userId) {
      return res.status(400).send({ isOk: false, message: "You Don't Have access to delete other's board" });
    }

    let user = await User.findById(userId);

    user.recentlyVisitedBoards = user.recentlyVisitedBoards.filter(el => el.toString() != boardId.toString());

    await Task.deleteMany({ board: boardId });
    await Board.findByIdAndDelete(boardId);
    await user.save();

    return res.status(200).send({
      isOk: true,
      message: "Board Deleted successfully.",
      board: board,
    });

  } catch (error) {
    return res.status(500).send({
      isOk: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
});

// Get users for inviting to a board
boardRouter.get("/getUser", async (req, res) => {
  try {
    let { boardId } = req.query;
    let board = await Board.findById(boardId).select("members");

    if (!board) return res.status(400).send({ isOk: false, message: "board not found!" });

    let allUsers = await User.find({
      $and: [
        { _id: { $ne: req.user.userId } },
        { _id: { $nin: board.members } }
      ]
    }).select("name avatar email");

    return res.status(200).send({ isOk: true, message: "Here are all the user for inviting.", users: allUsers });
  } catch (error) {
    
    return res.status(500).send({
      isOk: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
});

// Add a member to a board
boardRouter.post("/addMember", async (req, res) => {
  try {
    let { boardId } = req.query;
    let { memberId } = req.body;

    if (!boardId || !memberId) {
      return res.status(400).send({ isOk: false, message: "Please provide both memberId and BoardId" });
    }

    let board = await Board.findById(boardId);
    let user = await User.findById(memberId);

    if (!board) return res.status(404).send({ isOk: false, message: "board with given id is not found!" });
    if (!user) return res.status(404).send({ isOk: false, message: `${User} with given id is not found!` });

    if (!board.members.includes(memberId.toString())) board.members.push(memberId.toString());
    else return res.status(400).send({ isOk: false, message: `${user.name} is already in board` });

    await board.save();

    return res.status(200).send({ isOk: true, message: `${user.name} has been added to board` });

  } catch (error) {
    return res.status(500).send({
      isOk: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
});

module.exports = { boardRouter };
