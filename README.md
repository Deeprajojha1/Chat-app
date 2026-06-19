# ChatFlow - Real-Time Chat Application

A modern, full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) featuring Socket.IO for live messaging, group chats, and a polished user interface.

## 🚀 Features

### Core Functionality
- **Real-time Messaging**: Instant message delivery using Socket.IO
- **Private Chats**: One-to-one conversations with other users
- **Group Chats**: Create and manage group conversations with multiple participants
- **User Authentication**: Secure JWT-based authentication with HTTP-only cookies
- **Online Status**: Real-time online/offline status indicators
- **Typing Indicators**: See when other users are typing
- **Message Read Status**: Track when messages are read
- **Profile Management**: User profile with avatar upload
- **Search Users**: Find and connect with other users
- **Auto-Login**: Persistent sessions using HTTP-only cookies
- **Group Administration**: Group admins can delete groups
- **Sender Names**: Display sender names in group chats (WhatsApp-style)

### UI/UX Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern Interface**: Clean, contemporary design with gradients and shadows
- **Smooth Scrolling**: Independent scrolling for sidebar and chat areas
- **Custom Scrollbars**: Styled scrollbars for better aesthetics
- **Visual Feedback**: Hover effects, active states, and transitions
- **Loading States**: Proper loading indicators throughout the app

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Socket.IO Client**: Real-time bidirectional communication
- **Axios**: HTTP client for API requests
- **Lucide React**: Beautiful icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **Socket.IO**: Real-time event-driven communication
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Cookie Parser**: Cookie handling
- **Cloudinary**: Cloud image storage for avatars

## 📁 Project Structure

```
chatApplication/
├── client/                          # Frontend React application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── api/                     # API configuration
│   │   │   └── axios.js            # Axios instance with credentials
│   │   ├── components/             # Reusable React components
│   │   │   ├── ChatBox.jsx         # Chat display and message composer
│   │   │   ├── MessageBubble.jsx   # Individual message component
│   │   │   ├── Navbar.jsx          # Navigation bar with user info
│   │   │   ├── ProtectedRoute.jsx  # Route protection wrapper
│   │   │   └── Sidebar.jsx         # Users, groups, and chats list
│   │   ├── context/                # React Context providers
│   │   │   ├── AuthContext.jsx     # Authentication state management
│   │   │   └── SocketContext.jsx   # Socket.IO connection management
│   │   ├── layouts/                # Layout components
│   │   │   └── MainLayout.jsx      # Main app layout with navbar
│   │   ├── pages/                  # Page components
│   │   │   ├── Chat.jsx            # Main chat interface
│   │   │   ├── Home.jsx            # Landing page with auth redirect
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Profile.jsx         # User profile management
│   │   │   ├── Register.jsx        # Registration page
│   │   │   └── SocketPlayground.jsx # Socket testing interface
│   │   ├── services/               # API service layers
│   │   │   ├── authService.js      # Authentication API calls
│   │   │   ├── chatService.js      # Chat and message API calls
│   │   │   └── userService.js      # User API calls
│   │   ├── App.jsx                 # Main app component with routes
│   │   ├── index.css               # Global styles
│   │   └── main.jsx                # Application entry point
│   ├── index.html                  # HTML template
│   ├── package.json                # Dependencies
│   └── vite.config.js             # Vite configuration
│
├── server/                         # Backend Express application
│   ├── src/
│   │   ├── app.js                  # Express app configuration
│   │   ├── server.js               # Server entry point
│   │   ├── config/                 # Configuration files
│   │   │   ├── cloudinary.js       # Cloudinary configuration
│   │   │   ├── db.js               # MongoDB connection
│   │   │   └── env.js              # Environment variables
│   │   ├── controllers/            # Route controllers
│   │   │   ├── auth.controller.js  # Auth endpoints
│   │   │   ├── chat.controller.js  # Chat and message endpoints
│   │   │   └── user.controller.js  # User profile endpoints
│   │   ├── events/                 # Socket event constants
│   │   │   └── socket.events.js    # Socket event names
│   │   ├── middlewares/            # Express middleware
│   │   │   ├── auth.middleware.js  # JWT authentication
│   │   │   ├── error.middleware.js # Global error handling
│   │   │   ├── upload.middleware.js # File upload handling
│   │   │   └── validate.middleware.js # Request validation
│   │   ├── models/                 # Mongoose models
│   │   │   ├── Chat.js             # Chat schema
│   │   │   ├── Message.js          # Message schema
│   │   │   └── User.js             # User schema
│   │   ├── repositories/           # Database access layer
│   │   │   ├── chat.repository.js  # Chat queries
│   │   │   └── user.repository.js  # User queries
│   │   ├── routes/                 # Express routes
│   │   │   ├── auth.routes.js      # Auth routes
│   │   │   ├── chat.routes.js      # Chat routes
│   │   │   └── user.routes.js      # User routes
│   │   ├── services/               # Business logic layer
│   │   │   ├── auth.service.js     # Auth operations
│   │   │   ├── chat.service.js     # Chat operations
│   │   │   └── user.service.js     # User operations
│   │   ├── sockets/                # Socket.IO handlers
│   │   │   ├── socket.js           # Main socket event handlers
│   │   │   └── playground.handlers.js # Socket testing handlers
│   │   ├── utils/                  # Utility functions
│   │   │   ├── ApiError.js         # Custom error class
│   │   │   ├── ApiResponse.js      # API response formatter
│   │   │   ├── asyncHandler.js     # Async error wrapper
│   │   │   ├── generateToken.js    # JWT token generation
│   │   │   └── uploadToCloudinary.js # Image upload helper
│   │   └── validators/             # Request validators
│   │       ├── auth.validator.js   # Auth input validation
│   │       └── chat.validator.js   # Chat input validation
│   ├── .env                        # Environment variables (not in git)
│   ├── .env.example                # Environment variables template
│   ├── package.json                # Dependencies
│   └── README.md                   # Server documentation
│
└── README.md                       # This file
```

## 🔌 WebSocket Implementation

### Socket.IO Architecture

The application uses Socket.IO for real-time bidirectional communication between the client and server. WebSocket connections enable instant message delivery without the need for continuous HTTP polling.

### Socket Events

#### Client-Side Events (Emitted by Client)
- **`SETUP`**: Sent when user connects to establish their identity
- **`JOIN_CHAT`**: Sent when user opens a chat to join the chat room
- **`GROUP_CREATED`**: Sent when a new group is created to notify participants
- **`PRIVATE_MESSAGE`**: Sent when a user sends a message (used for both private and group chats)
- **`GROUP_DELETED`**: Sent when a group admin deletes a group
- **`TYPING`**: Sent when user starts typing
- **`STOP_TYPING`**: Sent when user stops typing
- **`SEEN`**: Sent when user marks messages as read

#### Server-Side Events (Emitted by Server)
- **`ONLINE_USERS`**: Broadcasts list of online user IDs
- **`GROUP_CREATED`**: Notifies participants when a new group is created
- **`MESSAGE_RECEIVED`**: Delivers new messages to recipients
- **`GROUP_DELETED`**: Notifies participants when a group is deleted
- **`TYPING`**: Notifies when someone is typing
- **`STOP_TYPING`**: Notifies when someone stops typing
- **`SEEN`**: Notifies when messages are marked as read

### Socket Rooms

Socket.IO rooms are used to efficiently target messages to specific groups of users:

- **User Rooms**: Each user joins their own room (their user ID) for direct messaging
- **Chat Rooms**: Each chat has a room (chat ID) that participants join
  - Private chats: Both participants join the chat room
  - Group chats: All group members join the group chat room

### Message Flow

#### Private Chat Message Flow
1. User A sends message via HTTP API
2. Message is saved to database
3. User A emits `PRIVATE_MESSAGE` event via Socket.IO
4. Server broadcasts to User B's room and the chat room
5. User B receives `MESSAGE_RECEIVED` event
6. User B's UI updates with new message

#### Group Chat Message Flow
1. User A sends message via HTTP API
2. Message is saved to database
3. User A emits `PRIVATE_MESSAGE` event via Socket.IO
4. Server identifies it's a group chat (by checking `isGroupChat` or participant count)
5. Server broadcasts to the group chat room and all participant rooms
6. All group members receive `MESSAGE_RECEIVED` event
7. All members' UI updates with new message

### Socket Connection Lifecycle

#### Client Connection
```javascript
// SocketContext.jsx
useEffect(() => {
  if (!user?._id) return undefined;
  
  const nextSocket = io(SOCKET_URL, { withCredentials: true });
  nextSocket.emit(SETUP, user._id);
  nextSocket.on(ONLINE_USERS, setOnlineUsers);
  
  return () => {
    nextSocket.disconnect();
  };
}, [user?._id]);
```

#### Server Connection
```javascript
// socket.js
socket.on(SETUP, async (userId) => {
  socket.userId = userId;
  socket.join(userId); // Join personal room
  onlineUsers.set(String(userId), socket.id);
  await User.findByIdAndUpdate(userId, { isOnline: true });
  io.emit(ONLINE_USERS, Array.from(onlineUsers.keys()));
});
```

#### Disconnection
```javascript
socket.on("disconnect", async () => {
  onlineUsers.delete(String(socket.userId));
  await User.findByIdAndUpdate(socket.userId, { isOnline: false, lastSeen: new Date() });
  io.emit(ONLINE_USERS, Array.from(onlineUsers.keys()));
});
```

## 📄 Pages and Methods

### 1. Home Page (`/`)
**File**: `client/src/pages/Home.jsx`

**Purpose**: Landing page with automatic authentication redirect

**Methods Used**:
- `useAuth()`: Access authentication state
- `Navigate`: React Router component for redirection

**Logic**:
- Checks if user is authenticated
- If authenticated, redirects to `/chat`
- If not authenticated, shows landing page with login/register options
- Shows loading state while checking authentication

**Socket Events**: None

### 2. Login Page (`/login`)
**File**: `client/src/pages/Login.jsx`

**Purpose**: User authentication

**Methods Used**:
- `authService.login()`: POST request to `/api/auth/login`
- `useAuth()`: Access login function and error state

**API Endpoint**: `POST /api/auth/login`

**Logic**:
- Validates email and password
- Calls login API
- On success, updates user state in AuthContext
- Redirects to chat page
- Displays error messages on failure

**Socket Events**: None

### 3. Register Page (`/register`)
**File**: `client/src/pages/Register.jsx`

**Purpose**: New user registration

**Methods Used**:
- `authService.register()`: POST request to `/api/auth/register`
- `useAuth()`: Access register function and error state

**API Endpoint**: `POST /api/auth/register`

**Logic**:
- Validates name, email, password
- Calls register API
- On success, updates user state
- Redirects to chat page
- Displays error messages on failure

**Socket Events**: None

### 4. Chat Page (`/chat`)
**File**: `client/src/pages/Chat.jsx`

**Purpose**: Main chat interface with real-time messaging

**Methods Used**:
- `userService.list()`: GET request to `/api/users`
- `chatService.list()`: GET request to `/api/chats`
- `chatService.access()`: POST request to `/api/chats` (create/access private chat)
- `chatService.createGroup()`: POST request to `/api/chats/groups`
- `chatService.messages()`: GET request to `/api/chats/:chatId/messages`
- `chatService.send()`: POST request to `/api/chats/messages`
- `chatService.markSeen()`: PATCH request to `/api/chats/:chatId/seen`
- `chatService.deleteGroup()`: DELETE request to `/api/chats/groups/:chatId`

**API Endpoints**:
- `GET /api/users` - List all users
- `GET /api/chats` - List user's chats
- `POST /api/chats` - Create/access private chat
- `POST /api/chats/groups` - Create group chat
- `GET /api/chats/:chatId/messages` - Get chat messages
- `POST /api/chats/messages` - Send message
- `PATCH /api/chats/:chatId/seen` - Mark messages as read
- `DELETE /api/chats/groups/:chatId` - Delete group

**Socket Events**:
- **Emits**:
  - `SETUP`: On component mount (via SocketContext)
  - `JOIN_CHAT`: When opening a chat
  - `GROUP_CREATED`: When creating a group
  - `PRIVATE_MESSAGE`: When sending a message
  - `GROUP_DELETED`: When deleting a group
  - `TYPING`: When starting to type
  - `STOP_TYPING`: When stopping typing
  - `SEEN`: When marking messages as read

- **Listens**:
  - `MESSAGE_RECEIVED`: When new message arrives
  - `GROUP_CREATED`: When new group is created
  - `GROUP_DELETED`: When group is deleted
  - `TYPING`: When someone is typing
  - `STOP_TYPING`: When someone stops typing

**Logic**:
- Loads users and chats on mount
- Joins all group chat rooms when socket connects
- Handles message sending via HTTP + Socket.IO
- Manages real-time message updates
- Handles typing indicators
- Manages group creation and deletion
- Auto-scrolls to latest messages

### 5. Profile Page (`/profile`)
**File**: `client/src/pages/Profile.jsx`

**Purpose**: User profile management

**Methods Used**:
- `userService.updateProfile()`: PATCH request to `/api/users/profile`
- `userService.uploadAvatar()`: POST request to `/api/users/avatar`

**API Endpoints**:
- `PATCH /api/users/profile` - Update user profile
- `POST /api/users/avatar` - Upload profile picture

**Logic**:
- Displays current user information
- Allows profile updates
- Handles avatar upload to Cloudinary
- Validates inputs
- Shows success/error messages

**Socket Events**: None

### 6. Socket Playground (`/socket-playground`)
**File**: `client/src/pages/SocketPlayground.jsx`

**Purpose**: Testing interface for Socket.IO events

**Methods Used**:
- Various socket emit methods for testing

**Socket Events**:
- Custom test events for debugging socket communication

**Logic**:
- Provides UI for testing socket events
- Useful for development and debugging
- Not used in production

## 🔐 Authentication Flow

### JWT Cookie-Based Authentication

1. **Registration**:
   - User submits registration form
   - Server creates user with hashed password
   - Server generates JWT token
   - Token set in HTTP-only cookie
   - User automatically logged in

2. **Login**:
   - User submits credentials
   - Server validates credentials
   - Server generates JWT token
   - Token set in HTTP-only cookie
   - User redirected to chat

3. **Session Persistence**:
   - Token stored in HTTP-only cookie (secure, not accessible via JavaScript)
   - Cookie sent automatically with each request
   - Server validates token on protected routes
   - Token expires after configured time

4. **Auto-Login**:
   - On app load, AuthContext calls `/api/auth/me`
   - Server validates token from cookie
   - If valid, returns user data
   - User automatically logged in
   - Redirected to chat page

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String (Cloudinary URL),
  isOnline: Boolean,
  lastSeen: Date
}
```

### Chat Model
```javascript
{
  chatName: String,
  isGroupChat: Boolean,
  participants: [ObjectId] (ref: User),
  groupAdmin: ObjectId (ref: User),
  lastMessage: ObjectId (ref: Message),
  timestamps: true
}
```

### Message Model
```javascript
{
  chat: ObjectId (ref: Chat),
  sender: ObjectId (ref: User),
  receiver: ObjectId (ref: User, optional),
  content: String,
  seen: Boolean,
  timestamps: true
}
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/Deeprajojha1/Chat-app.git
cd chatApplication
```

2. **Install server dependencies**:
```bash
cd server
npm install
```

3. **Install client dependencies**:
```bash
cd ../client
npm install
```

4. **Environment Setup**:
   - Copy `server/.env.example` to `server/.env`
   - Fill in the required environment variables:
     ```
     MONGODB_URI=mongodb://localhost:27017/chatflow
     JWT_SECRET=your-secret-key
     JWT_EXPIRE=7d
     CLOUDINARY_CLOUD_NAME=your-cloud-name
     CLOUDINARY_API_KEY=your-api-key
     CLOUDINARY_API_SECRET=your-api-secret
     PORT=5000
     ```

5. **Start MongoDB**:
   - Local: `mongod`
   - Or use MongoDB Atlas connection string

6. **Start the server**:
```bash
cd server
npm run dev
```

7. **Start the client** (in new terminal):
```bash
cd client
npm run dev
```

8. **Access the application**:
   - Open `http://localhost:5173` in your browser

## 📖 Usage Guide

### Creating an Account
1. Click "Create account" on the home page
2. Fill in name, email, and password
3. Click "Create account"
4. You'll be automatically logged in and redirected to chat

### Starting a Private Chat
1. In the sidebar, find the user you want to chat with
2. Click on the user in the "Users" section
3. A private chat will be created automatically
4. Start typing and press Enter or click Send

### Creating a Group Chat
1. Click the "+" button next to "Groups" in the sidebar
2. Enter a group name
3. Select at least 2 users from the list
4. Click "Create group"
5. The group will appear in the Groups section
6. Click on the group to start chatting

### Managing Groups
- Only group admins can delete groups
- Click the trash icon in the chat header to delete a group
- Confirmation dialog prevents accidental deletion

### Profile Management
- Click your avatar/name in the navbar to go to profile
- Update your name or upload a new avatar
- Changes are saved automatically

## 🔧 Development

### Running in Development Mode
- Server: `npm run dev` (with auto-reload via nodemon)
- Client: `npm run dev` (with HMR via Vite)

### Building for Production
```bash
# Client
cd client
npm run build

# Server
cd server
npm start
```

### Code Structure Best Practices
- **Separation of Concerns**: Controllers handle HTTP, Services handle business logic, Repositories handle database
- **Context API**: Used for global state (Auth, Socket)
- **Custom Hooks**: Reusable logic extracted into hooks
- **Component Composition**: Small, focused components
- **Error Handling**: Centralized error handling middleware
- **Validation**: Input validation on both client and server

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**:
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify network connectivity

**Socket Connection Issues**:
- Check server is running on correct port
- Verify CORS configuration
- Check firewall settings

**Image Upload Not Working**:
- Verify Cloudinary credentials
- Check file size limits
- Ensure upload middleware is configured

**Messages Not Real-Time**:
- Verify Socket.IO server is running
- Check client socket connection
- Ensure users are in correct rooms

## 📝 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
- Body: `{ name, email, password }`
- Response: `{ user, token }`

#### POST /api/auth/login
Login existing user
- Body: `{ email, password }`
- Response: `{ user, token }`

#### GET /api/auth/me
Get current user (validates token)
- Headers: Cookie with JWT
- Response: `{ user }`

#### POST /api/auth/logout
Logout user
- Headers: Cookie with JWT
- Response: Success message

### Chat Endpoints

#### POST /api/chats
Create or access private chat
- Body: `{ participantId }`
- Response: `{ chat }`

#### GET /api/chats
Get user's chats
- Response: `{ chats }`

#### POST /api/chats/groups
Create group chat
- Body: `{ name, participantIds }`
- Response: `{ chat }`

#### DELETE /api/chats/groups/:chatId
Delete group chat
- Params: `chatId`
- Response: Success message

#### GET /api/chats/:chatId/messages
Get chat messages
- Params: `chatId`
- Response: `{ messages }`

#### POST /api/chats/messages
Send message
- Body: `{ chatId, receiverId, content }`
- Response: `{ message }`

#### PATCH /api/chats/:chatId/seen
Mark messages as read
- Params: `chatId`
- Response: Success message

### User Endpoints

#### GET /api/users
Get all users
- Response: `{ users }`

#### PATCH /api/users/profile
Update user profile
- Body: `{ name, email }`
- Response: `{ user }`

#### POST /api/users/avatar
Upload avatar
- Body: FormData with file
- Response: `{ user }`

## 🎨 UI Components

### Sidebar
- **Search**: Fixed search bar with sticky positioning
- **Groups**: Lists group chats with purple avatars
- **Users**: Lists all users with online status
- **Chats**: Lists direct conversations with blue avatars

### ChatBox
- **Header**: Shows chat name, member count, delete button (for admins)
- **Messages**: Scrollable message area with sender names
- **Composer**: Message input with send button

### MessageBubble
- **Sender Name**: Displayed in group chats
- **Content**: Message text
- **Timestamp**: Message time
- **Styling**: Different styles for sent/received messages

### Navbar
- **Brand**: App logo and name
- **User Info**: Avatar and name display
- **Actions**: Chats link, logout button

## 🔒 Security Features

- **HTTP-Only Cookies**: JWT tokens stored in secure, HTTP-only cookies
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Server-side validation on all inputs
- **CORS Configuration**: Proper CORS setup for cross-origin requests
- **Authentication Middleware**: Protected routes require valid JWT
- **File Upload Validation**: File type and size validation
- **SQL Injection Prevention**: Using Mongoose (NoSQL ORM)
- **XSS Prevention**: React's built-in XSS protection

## 🚀 Deployment

### Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRE`: Token expiration time
- `CLOUDINARY_*`: Cloudinary credentials
- `PORT`: Server port

### Deployment Platforms
- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Heroku, Railway, Render, or any Node.js hosting
- **Database**: MongoDB Atlas (recommended for production)

### Build Commands
```bash
# Client production build
cd client
npm run build

# Server production start
cd server
NODE_ENV=production npm start
```

## 📄 License

This project is for educational purposes.

## 👥 Contributing

This is a personal project. Feel free to fork and modify for your own use.

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- MERN stack community
- React Router for navigation
- Cloudinary for image hosting
- Lucide for beautiful icons

---

**Built with ❤️ using MERN Stack and Socket.IO**
