# Student Course Tracker

Student Course Tracker is a Flask web application for managing students, courses, and enrollments. It includes a public landing page, an admin login, dashboard views, and protected CRUD API endpoints backed by MySQL.

## Features

- Session-based admin authentication
- Student, course, and enrollment management
- Sample data seeding for demos and screenshots
- Health check endpoint for deployment verification
- Environment-variable based configuration
- Railway-ready deployment files and GitHub Actions import check

## Tech Stack

- Python 3.11
- Flask
- Flask-SQLAlchemy
- MySQL with PyMySQL
- Gunicorn for production serving

## Project Structure

```text
.
|-- app/
|   |-- static/
|   |   |-- css/style.css
|   |   `-- js/app.js
|   |-- templates/
|   |   |-- index.html
|   |   |-- landing.html
|   |   |-- login.html
|   |   `-- records.html
|   |-- __init__.py
|   |-- models.py
|   `-- routes.py
|-- sample_data/
|   |-- schema.sql
|   `-- sample_rows.sql
|-- .github/workflows/ci.yml
|-- .env.example
|-- config.py
|-- Procfile
|-- railway.json
|-- requirements.txt
`-- wsgi.py
```

## Requirements

- Python 3.11
- `pip`
- MySQL server running locally, such as XAMPP MySQL

## Local Setup

1. Create a virtual environment:

   ```powershell
   py -m venv .venv
   ```

2. Activate it:

   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```

3. Install dependencies:

   ```powershell
   pip install -r requirements.txt
   ```

4. Create your environment file:

   ```powershell
   Copy-Item .env.example .env
   ```

5. Create the MySQL database:

   ```sql
   CREATE DATABASE student_course_tracker;
   ```

6. Update `.env` with your local values and choose your own admin credentials:

   ```env
   SECRET_KEY=dev-secret-key
   DATABASE_URL=mysql+pymysql://root:@localhost/student_course_tracker
   LOG_LEVEL=INFO
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_strong_password
   ```

7. Run the app:

   ```powershell
   flask --app wsgi run --debug
   ```

8. Open the application:

   ```text
   http://127.0.0.1:5000
   ```

The app creates its tables automatically on startup.

## Default Local Behavior

- If `DATABASE_URL` is not set, the app uses `mysql+pymysql://root:@localhost/student_course_tracker`.
- Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env` or your deployment environment before sharing or deploying the app.
- `/health` is public.
- Dashboard and API routes require login.

## Main Routes

### Pages

- `GET /` landing page
- `GET /login` login page
- `GET /dashboard` main dashboard
- `GET /records` records view

### Utility

- `GET /health` application health check
- `POST /logout` clear the session

### Protected API

- `GET /api/session`
- `GET /api/summary`
- `GET /api/students`
- `POST /api/students`
- `PUT /api/students/<id>`
- `DELETE /api/students/<id>`
- `GET /api/courses`
- `POST /api/courses`
- `PUT /api/courses/<id>`
- `DELETE /api/courses/<id>`
- `GET /api/enrollments`
- `POST /api/enrollments`
- `PUT /api/enrollments/<id>`
- `DELETE /api/enrollments/<id>`
- `POST /api/seed`

## Sample Data and Schema

- Schema: [sample_data/schema.sql](/C:/Users/Admin/Desktop/CloudApp/sample_data/schema.sql)
- Sample rows: [sample_data/sample_rows.sql](/C:/Users/Admin/Desktop/CloudApp/sample_data/sample_rows.sql)

You can also load demo records from the UI after logging in by using the sample data action.

## Deployment Notes

- Production start command is `gunicorn wsgi:app`
- Railway configuration is included in [railway.json](/C:/Users/Admin/Desktop/CloudApp/railway.json)
- The Procfile is included in [Procfile](/C:/Users/Admin/Desktop/CloudApp/Procfile)
- A GitHub Actions import check is included in [.github/workflows/ci.yml](/C:/Users/Admin/Desktop/CloudApp/.github/workflows/ci.yml)

## Troubleshooting

- `401 Authentication required`
  Log in first, then retry the dashboard or API action.

- `Duplicate or invalid relational data detected`
  Check for duplicate student numbers, emails, course codes, or repeated enrollments.

- Database connection errors during startup
  Confirm MySQL is running and verify `DATABASE_URL` in `.env`.

- Deployment login issues
  Check that `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set correctly in your environment variables.
