# Project Setup Steps

## 1. Local MySQL Setup with XAMPP

1. Open the XAMPP Control Panel.
2. Start `Apache` and `MySQL`.
3. Open `http://localhost/phpmyadmin`.
4. Create a database named `student_course_tracker`.

## 2. Configure the Project

1. Copy `.env.example` to `.env`.
2. Set:

   ```env
   SECRET_KEY=replace-with-a-random-secret
   DATABASE_URL=mysql+pymysql://root:@localhost/student_course_tracker
   LOG_LEVEL=INFO
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=replace-with-a-strong-password
   ```

3. If your MySQL user has a password, update the connection string:

   ```env
   DATABASE_URL=mysql+pymysql://root:yourpassword@localhost/student_course_tracker
   ```

## 3. Install and Run

1. Create and activate a virtual environment.
2. Install dependencies with `pip install -r requirements.txt`.
3. Start the app with `flask --app wsgi run --debug`.

## 4. Verify

1. Open `http://127.0.0.1:5000/health`.
2. Open the main app.
3. Log in with your configured admin credentials.
4. Click `Load sample data`.

## 5. Optional GitHub and Railway Flow

1. Create a new GitHub repository.
2. Push this project to the repository.
3. Ensure the default branch is `main`.
4. If you still want cloud deployment later, create a Railway project from the GitHub repo.

## 6. Capture Screenshots

Take screenshots of the following as needed:

- XAMPP Control Panel with MySQL running
- phpMyAdmin showing the `student_course_tracker` database
- Login page
- Dashboard after loading sample data
- `/health` endpoint in the browser

## 7. Demonstrate CI/CD

1. Make a small commit locally.
2. Push to `main`.
3. Show GitHub Actions running.
4. If you use Railway later, show the redeploy after the push.
