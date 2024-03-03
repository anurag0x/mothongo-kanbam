const { User } = require("../models/user");

// Function to manage recently visited boards for a user
const recentBoardManager = async (userId, boardId) => {
    try {
        // Find the user by ID
        let user = await User.findById(userId);

        // Check if the user has less than 3 recently visited boards
        if (user.recentlyVisitedBoards.length < 3) {
            // If the board is not already in the recently visited list, add it to the beginning
            if (!user.recentlyVisitedBoards.includes(boardId)) {
                user.recentlyVisitedBoards.unshift(boardId);
            }
        } else {
            // If the user has 3 recently visited boards, remove the oldest one and add the new board to the beginning
            user.recentlyVisitedBoards.pop();
            user.recentlyVisitedBoards.unshift(boardId);
        }

        // Save the updated user data
        await user.save();

        // Return true to indicate successful update
        return true;
    } catch (error) {
        // Log the error and return false to indicate failure
        console.log(error);
        return false;
    }
};

// Export the recentBoardManager function
module.exports = { recentBoardManager };
