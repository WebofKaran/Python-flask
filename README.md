# Flask + React + PostgreSQL + Jenkins Demo

A simple full-stack deployment lab that explains how Flask, React, PostgreSQL, Nginx, systemd, and Jenkins work together.

## Architecture

```text
Browser
   |
 Nginx :80
   |----------------------|
   |                      |
React static files     /api/*
                          |
                    Gunicorn :5001
                          |
                       Flask
                          |
                    PostgreSQL :5432

GitHub -> Jenkins -> test -> build React -> deploy -> restart Flask -> health check
```

## Project structure

```text
client/
  src/
    App.jsx
    main.jsx
    style.css
  package.json
  index.html

server/
  app.py
  requirements.txt
  wsgi.py

Jenkinsfile
.env.example
.gitignore
README.md
```

## Local development

### Backend

```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL="postgresql://postgres:password@localhost:5432/flask_lab"
python app.py
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## API

- `GET /api/health` — Flask/database health check
- `GET /api/tasks` — list tasks
- `POST /api/tasks` — create a task
- `PUT /api/tasks/<id>` — update task completion
- `DELETE /api/tasks/<id>` — delete task

## Deployment

The Jenkinsfile is designed for the Fedora server used by this deployment lab. It:

1. Checks out the latest GitHub commit.
2. Creates/updates a Python virtual environment and installs backend dependencies.
3. Validates the Flask application and WSGI entry point.
4. Installs React dependencies and creates a production build.
5. Deploys the React build to `/var/www/flask-react`.
6. Deploys the Flask backend to `/opt/flask-react/server`.
7. Restarts the `flask-react` systemd service.
8. Verifies the backend health endpoint.

The MERN application can continue running on Node.js port `5000`; this Flask application uses Gunicorn on port `5001`.
