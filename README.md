# Student Course Tracker

A Flask API and frontend for managing students, courses, and enrollments. The project is configured to run locally with MySQL through XAMPP.

## Features

- Session-based admin login for screenshots and protected CRUD access
- CRUD for students, courses, and enrollments
- Environment variable configuration
- MySQL support through SQLAlchemy and PyMySQL
- Sample data endpoint for demonstration
- Basic logging and a `/health` endpoint
- CI import check through GitHub Actions

## Project structure

```text
.
|-- app/
|   |-- static/
|   |-- templates/
|   |-- __init__.py
|   |-- models.py
|   `-- routes.py
|-- docs/
|-- sample_data/
|-- .github/workflows/ci.yml
|-- .env.example
|-- Procfile
|-- railway.json
|-- requirements.txt
`-- wsgi.py
```

## Requirements

- Python 3.11
- `pip`
- XAMPP with MySQL enabled

## How to run locally

1. Create the virtual environment:

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

5. Start MySQL from the XAMPP Control Panel.

6. Create the database in phpMyAdmin or the MySQL shell:

   ```sql
   CREATE DATABASE student_course_tracker;
   ```

7. Open `.env` and set the values you want. For a typical XAMPP setup you can use:

   ```env
   SECRET_KEY=dev-secret-key
   DATABASE_URL=mysql+pymysql://root:@localhost/student_course_tracker
   LOG_LEVEL=INFO
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

   If your MySQL user has a password, use:

   ```env
   DATABASE_URL=mysql+pymysql://root:yourpassword@localhost/student_course_tracker
   ```

8. Start the Flask development server:

   ```powershell
   flask --app wsgi run --debug
   ```

9. Open the app in your browser:

   ```text
   http://127.0.0.1:5000
   ```

10. Log in with the credentials from your `.env` file.

11. Click `Load sample data` to insert demo students, courses, and enrollments for screenshots.

## Local behavior notes

- If `DATABASE_URL` is not set, the app defaults to `mysql+pymysql://root:@localhost/student_course_tracker`.
- The database must already exist in MySQL before the app starts.
- All dashboard API routes require login.
- `/health` stays public.

## Default demo credentials

These are only for local convenience and should be changed before deployment:

- Username: `admin`
- Password: `admin123`

## XAMPP MySQL setup notes

If you are using the default XAMPP MySQL installation:

1. Open XAMPP and start `Apache` and `MySQL`.
2. Open `http://localhost/phpmyadmin`.
3. Create a database named `student_course_tracker`.
4. Keep the `.env` value as:

   ```env
   DATABASE_URL=mysql+pymysql://root:@localhost/student_course_tracker
   ```

5. Restart the Flask server. The app will create the tables automatically on startup.

## CI/CD workflow

- The repository includes a GitHub Actions workflow at [.github/workflows/ci.yml](/C:/Users/Admin/Desktop/CloudApp/.github/workflows/ci.yml).
- On pushes to `main`, GitHub Actions installs dependencies and verifies that the Flask app imports successfully.
- If the GitHub repository is connected to Railway, pushing code to `main` should trigger Railway redeployment automatically.

## API overview

- `GET /health`
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

## Database schema and sample data

- Schema SQL: [sample_data/schema.sql](/C:/Users/Admin/Desktop/CloudApp/sample_data/schema.sql)
- Sample rows: [sample_data/sample_rows.sql](/C:/Users/Admin/Desktop/CloudApp/sample_data/sample_rows.sql)

## Documentation for submission

- Report draft: [docs/report.md](/C:/Users/Admin/Desktop/CloudApp/docs/report.md)
- Deployment guide: [docs/deployment-steps.md](/C:/Users/Admin/Desktop/CloudApp/docs/deployment-steps.md)
- Deliverables checklist: [docs/deliverables.md](/C:/Users/Admin/Desktop/CloudApp/docs/deliverables.md)

## Troubleshooting

- `401 Authentication required`
  Use the login page first, then retry the dashboard actions.

- `Duplicate or invalid relational data detected`
  This usually means a duplicate student email, student number, course code, or repeated student-course enrollment.

- Database connectivity failure in logs
  Check that XAMPP MySQL is running and verify `DATABASE_URL` in `.env`.

- Blank tables after deployment
  Log in and click `Load sample data`, or insert data through the API.

## Monitoring and logging note

If startup fails because `DATABASE_URL` is missing or invalid, the app logs will show the database connectivity failure emitted during application startup.
