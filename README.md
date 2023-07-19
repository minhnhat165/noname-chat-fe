# Noname chat

## Overview

The Chat App is a simple and intuitive messaging application built with Next.js, TypeScript, Ant Design, and Tailwind CSS on the front-end. The back-end of the application is implemented in a separate project, which can be found on GitHub at [https://github.com/ntrungduc228/noname-chat-be](https://github.com/ntrungduc228/noname-chat-be). This README file provides an overview of the front-end project and instructions on how to set it up and run it on your local machine.

## Features
* Real-time messaging: Users can send and receive messages in real-time.
* User authentication: Users can create an account and log in securely.
* User profiles: Users can update their profile information and upload a profile picture.
* Online presence: Users can see the online status of other users.
* Notifications: Users receive notifications for new messages and when they are mentioned in a conversation.
* Group chats: Users can create and participate in group conversations.
* Voice calls: Users can make voice and video calls with other users.

## Technologies Used

* Frontend: Next.js, TypeScript, Ant Design, Tailwind CSS
* Backend: Nest.js, TypeScript
* Database: MongoDB
* Real-time communication: Socket.io
* Voice calls: WebRTC, Socket.io
* Authentication: JSON Web Tokens (JWT)
* Image upload: Cloudinary

## Prerequisites
Make sure you have the following software installed on your machine:

* Node.js 16.8 or later.



## Installation
1. Clone the repository:

```bash
git clone https://github.com/MinhNhat165/noname-chat-fe.git
```

2. Navigate to the project directory:

```bash
cd noname-chat-fe
```

3. Install the dependencies:
```bash
yarn
```

4. Set up environment variables:

* Create a .env file in the root of the project.
* Define the following variables in the .env file:
  * CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name.
  * CLOUDINARY_API_KEY: Your Cloudinary API key.
  * CLOUDINARY_API_SECRET: Your Cloudinary API secret.
  * SERVER_API_URL=http://localhost:5000
  * API_BASE_URL=http://localhost:5000/api
  * NEXT_PUBLIC_CLIENT_API_URL=http://localhost:3000/api
  * NEXT_PUBLIC_SERVER_API_URL=http://localhost:5000
  * APP_NAME=Telebite

5. Run in development mode

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



## Usage
* Create a new account or log in using your existing credentials.
* Once logged in, you will be taken to the chat interface.
* On the left sidebar, you can see a list of your conversations.
* To start a new conversation, click on the "+" button and enter the username of the person you want to chat with.
* To join a group conversation, click on the "Join Group" button and enter the group name.
* Click on a conversation to open it and start messaging.
* You can also update your profile information and profile picture by clicking on the "Profile" button.

## Contributing

* [Nguyễn Minh Nhật](https://github.com/minhnhat165)
* [Nguyễn Trung Đức](https://github.com/ntrungduc228)
* [Nguyễn Thị Khánh Vi](https://github.com/khanhvi294)
* [Trần Thị Kim Oanh](https://github.com/kimoanhxinh)


## License

[MIT](https://choosealicense.com/licenses/mit/)
