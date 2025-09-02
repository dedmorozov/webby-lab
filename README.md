## 📌 Project Overview

This application allows you to:

- Add a movie
- Delete a movie
- View movie details
- View an alphabetically sorted list of movies
- Search for a movie by title
- Import movies from a `.txt` file via a web interface

### Tech stack:

- **React + TS**
- **Redux Toolkit**
- **Vite**
- **Docker + NGINX**
- **Environment variables for configuration**

## 🚀 Quick Start

Run the Dockerized App

```bash
docker run --name movies -p 3000:3000 -e API_URL=http://localhost:8000/api/v1 dedmorozov/movies
```

```bash
http://localhost:3000
```

### 💻 How to start local

If you'd like to run the project locally for development:

1. Clone the repository

```bash
git clone https://github.com/dedmorozov/webby-lab.git
cd webby-lab
```

2. Install dependencies

```bash
npm install
```

3. Set .env

Create a .env file in the root directory with the following content:

```bash
VITE_API_URL=http://localhost:8000/api/v1
VITE_AUTH_TOKEN=yor_token

```

4. Run the development server

```bash
npm run dev
```

```bash
http://localhost:5173
```
