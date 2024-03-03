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
1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Set up environment variables (See .env.example)
4. Start the server: `npm run server`

## API Endpoints
- **Authentication**
  - `POST /auth/google` - Google OAuth authentication
  - `GET /auth/google/callback` - Callback for Google OAuth
  
- **User**
  - `GET /user/:userId` - Get user details
  
- **Board**
  - `GET /board/allBoards` - Get all boards for the user
  - `GET /board/getSingleBoard?boardId=<boardId>` - Get details of a single board
  - `POST /board/addBoard` - Create a new board
  - `PUT /board/editBoard?boardId=<boardId>` - Edit board details
  - `DELETE /board/deleteBoard?boardId=<boardId>` - Delete a board
  - `GET /board/recentBoards` - Get recently visited boards
  
- **Task**
  - `GET /task/singleTask?taskId=<taskId>` - Get details of a single task
  - `POST /task/addTask?boardId=<boardId>` - Add a new task
  - `POST /task/editTask?taskId=<taskId>` - Edit task details
  - `DELETE /task/deleteTask?taskId=<taskId>` - Delete a task

## Error Handling
Proper error handling is implemented for all API endpoints to ensure a graceful response in case of errors.

## Rate Limiting
API endpoints are rate-limited to 500 requests per minute to prevent abuse.

## Deployment
The application is deployed on AWS EC2. Continuous Integration and Deployment are set up using GitHub Actions.

## Postman Documentation
APIs are documented using Postman. You can find the public documentation [here](<link-to-postman-docs>).

## Contributing
Feel free to contribute to the development of this project by opening issues or pull requests.



