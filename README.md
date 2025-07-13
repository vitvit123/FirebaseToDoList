# FirebaseToDoList

This is a Todo List web application built with Next.js, React, and Firebase Firestore for realtime sync. It fully implements CRUD functionality, live updates, and advanced features like editing, filtering, and marking as complete.

## ✨ Features
- Add, edit, delete todos
- Mark as complete/incomplete
- Realtime sync via Firebase Firestore
- Filtering with live search
- Duplicate/empty prevention
- Built with TypeScript

## 🔧 Tech Stack
- Next.js 14+
- React
- Firebase (Firestore)
- TypeScript

## ⚡ How It Works
- Uses Firebase Firestore's realtime capabilities to keep todos in sync across clients.
- All CRUD operations are directly integrated with Firestore.
- Clean, accessible UI with keyboard support.

## 🚀 Getting Started
1. Clone the repo
2. Install dependencies (npm install)
3. Rename .env.example to .env and paste your Firebase credentials there
4. Run the dev server (npm run dev)

## 🔧 Firebase Setup
If you don’t have a Firebase project yet, follow these steps:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click “Add project” and follow the prompts to create a new project
3. In your project dashboard, navigate to **Project Settings** (gear icon)
4. Under **Your apps**, add a new web app
5. Copy the Firebase config keys (`apiKey`, `authDomain`, `projectId`, etc.)
6. Paste these values into your `.env` file with the corresponding environment variables


## ⏱️ Estimated Time Spent
Total time spent on this project around: ~3 hours




