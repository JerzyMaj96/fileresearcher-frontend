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
- `ProtectedRoute` – protects routes that require authentication

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
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Run application in dev mode:
   ```bash
   npm run dev
   ```

By default the application will run at:
`bash
    http://localhost:5173
    `

## Features

- User registration and login
- Browsing ZIP archive sending history
- Displaying the last recipient of a selected archive
- Deleting user accounts directly from the frontend menu
- Simple and intuitive UI with responsive design

## Screenshots

<img width="1728" height="1117" alt="Zrzut ekranu 2025-10-8 o 15 12 18" src="https://github.com/user-attachments/assets/826824e2-f832-4eba-836c-69b66f6bf3d8" />


<img width="1728" height="1117" alt="Zrzut ekranu 2025-10-8 o 15 15 08" src="https://github.com/user-attachments/assets/ffa35e5d-5829-485f-8670-b04877280b54" />

<img width="1728" height="1117" alt="Zrzut ekranu 2025-10-8 o 15 15 58" src="https://github.com/user-attachments/assets/b4fc61f2-0613-4a3e-8f24-6f22f6320ecf" />

<img width="1728" height="1117" alt="Zrzut ekranu 2025-10-8 o 15 16 16" src="https://github.com/user-attachments/assets/38e86c76-1c5f-44b4-aeb0-2474001bd079" />

<img width="1728" height="1117" alt="Zrzut ekranu 2025-10-8 o 15 16 29" src="https://github.com/user-attachments/assets/64216130-1b72-497e-93ad-7e3cb94b4975" />

<img width="1728" height="1117" alt="Zrzut ekranu 2025-10-8 o 15 17 23" src="https://github.com/user-attachments/assets/90b2848d-4e7b-4c54-8157-a7f37d56ecba" />

## AI Assistance Note
During the development of this project, I used AI tools (such as ChatGPT) to assist in writing and refining some parts of the code.
Some methods and implementations were generated with AI support and later reviewed, understood, and integrated by me.
This project represents my learning process in backend development and demonstrates my ability to effectively use modern tools in software creation.

## Licence

This project is licensed under the MIT License.
You are free to use, modify, and distribute it.


