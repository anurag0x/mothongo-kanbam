# Mathongo Kanban Board

# Node.js and Express.js Backend Application

## Description
This is a backend application built with Node.js and Express.js. It provides the server-side logic for a Kanban board application, including user authentication, board management, and task management.

## Technologies Used
- Node.js
- Express.js
- MongoDB (with Mongoose)
- Redis (Caching)
- Google OAuth for Authentication
- AWS EC2 (for Deployment)
- GitHub Actions (CI/CD)
- Rate Limiting

## Features
- User Authentication using JWTs
- Rate Limiting for API requests
- Google OAuth for user authentication
- MongoDB for persistent storage
- Redis for caching
- AWS EC2 for deployment
- Continuous Integration and Deployment using GitHub Actions
- User Profile with randomly assigned avatar
- Board Management (Create, Edit, Delete)
- Task Management (Create, Edit, Delete, Drag-and-drop between categories)

## Getting Started
1. Clone the repository: `https://github.com/anurag0x/mothongo-kanban`
2. Install dependencies: `npm install`
3. Set up environment variables (See .env.example)
4. Start the server: `npm run server`
5. or You can directly vist to deployed server here---> "https://mothongo-kanban.onrender.com"
6. To check out google authentication in frontend visit "https://mathongo-5s17lsusd-anurag0x.vercel.app/"

## API Endpoints
- **Authentication**
  - `POST /auth/google` - Google OAuth authentication
  - `GET /auth/google/callback` - Callback for Google OAuth
  
- **User**
  - `GET /user/:userId` - Get user details and token
  
- **Board**
  - `GET /board/allBoards` - Get all boards for the user
  - `GET /board/getSingleBoard?boardId=<boardId>` - Get details of a single board
  - `POST /board/addBoard` - Create a new board
  - `PUT /board/editBoard?boardId=<boardId>` - Edit board details
  - `DELETE /board/deleteBoard?boardId=<boardId>` - Delete a board
  - `GET /board/recentBoards` - Get last three visited boards
  
- **Task**
  - `GET /task/singleTask?taskId=<taskId>` - Get details of a single task
  - `POST /task/addTask?boardId=<boardId>` - Add a new task
  - `PUT /task/editTask?taskId=<taskId>` - Edit task details
  - `DELETE /task/deleteTask?taskId=<taskId>` - Delete a task

## Error Handling
Proper error handling is implemented for all API endpoints to ensure a graceful response in case of errors.

## Rate Limiting
API endpoints are rate-limited to 500 requests per minute to prevent abuse.

## Deployment
The application is deployed on Render Continuous Integration and Deployment are set up using GitHub Actions.

## Postman Documentation
APIs are documented using Postman. You can find the public documentation 
"https://www.postman.com/lunar-module-cosmologist-68497801/workspace/kanban-board/collection/29228169-ec0fbd4f-b015-4115-9220-12683a75329a?action=share&creator=29228169"
## Contributing
Feel free to contribute to the development of this project by opening issues or pull requests.



