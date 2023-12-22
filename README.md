# Discord chat app

## Overview

A full-stack web application with similar functionalities and UI to Discord

## Features

- **User**
  - Secure login, sign up for an account
  - Upload account avatar, change personal information
  - Mute/unmute microphone
  - Find and message privately with other users
- **Server**
  - Create, edit, delete, change server avatar
  - Server admin can assign roles (Admin, Moderator or Member) or kick members
  - Invite others with a unique invite code
  - Show member list
- **Channel**
  - Create, edit, and delete channel
  - Group channels into a category
  - Create a video channel for live video/voice chat
- **Message**
  - Create, edit, delete message
  - Upload attachment (image/file) with message
  - Reply to another message
  - Search with filters and jump to a specific message
  - Bi-directional infinite scrolling to load older/newer messages

## Technologies Used

- Frontend: NextJS
- Backend: Spring Boot
- Database: MySQL
- Deployment: Vercel, Render, Supabase

## Installation

To set up the project locally, follow these steps:

### 1. Clone this repository

```
git clone https://github.com/M1ke002/discord-app.git
```

#### 2.1. Frontend

Navigate to the `frontend` directory and install the dependencies

```
npm install
```

Create a .env file in the frontend directory and configure it as follows:

```
// SAMPLE CONFIG .env

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Run the app

```
npm run dev
```

#### 2.2. Backend

You will need to have Maven and Java Development Kit (JDK) installed to run this project. Navigate to the `backend` directory and build the project:

```
mvn clean install
```

Configure the database and JWT secret in the `src/main/resources/application.properties` file:

```
#database config
spring.datasource.url=jdbc:mysql://localhost:3306/your_database
spring.datasource.username=your_username
spring.datasource.password=your_password

#jwt secret
jwt.JWT_SECRET=YOUR_JWT_SECRET
```

Run the application

```
mvn spring-boot:run
```
