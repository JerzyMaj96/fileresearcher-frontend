# File Researcher Frontend

Frontend of the File Researcher application, which allows users to manage ZIP archives, browse file sending history, and track recipients.
The project is built with React and works with a Spring Boot backend.

---

## Technologies

- [React](https://reactjs.org/) + Hooks
- [Vite](https://vitejs.dev/) 
- [Material UI Icons](https://mui.com/material-ui/material-icons/)
- CSS 
- Fetch API

---

## Project Structure

Important components:

- `Header` – user navigation, menu 
- `Login` – user logging
- `Register` – new account registration
- `History` – browsing sending history (table + statuses)
- `HistoryInput` – search history by ZIP archive ID
- `ProtectedRoute` – zabezpieczenie tras wymagających logowania

---

## Requirements

- Node.js (>= 18)
- npm lub yarn
- Backend of the project **File Researcher** running locally (`http://localhost:8080`)

---

## Instalation and running

1. Clone repository:

   ```bash
   git clone https://github.com/JerzyMaj96/fileresearcher-frontend.git
   cd fileresearcher-frontend
2. Install dependencies:
   ```bash
   npm install
4. Run application in dev mode:
   ```bash
   npm run dev

By default the application will run at:
    ```bash
    http://localhost:5173
    ```

## Features
- User registration and login
- Browsing ZIP archive sending history
- Displaying the last recipient of a selected archive
- Deleting user accounts directly from the frontend menu
- Simple and intuitive UI with responsive design

## Screenshots


## Licence
This project is licensed under the MIT License.
You are free to use, modify, and distribute it.
