# Practical Application of PaaS with Railway

## 1. Introduction

This project is a Student Course Tracker built with Flask and deployed on Railway. The application demonstrates how a Platform-as-a-Service environment can host a web application, manage environment variables securely, provide a managed PostgreSQL database, and automate deployment through GitHub integration.

## 2. Deployment Process

The application was built as a Flask web service with a frontend served by the same application. The backend exposes REST API endpoints for creating, reading, updating, and deleting students, courses, and enrollments. For deployment, the source code was pushed to GitHub and connected to Railway. Railway detected the Python application and used the configured start command `gunicorn app:app` to launch the service.

After deployment, Railway generated a public URL that exposed the application to the internet. The `/health` endpoint was used to confirm that the deployment was healthy.

## 3. Environment Configuration and Security

Sensitive configuration values were not hardcoded into the source code. Instead, they were managed through Railway environment variables. The most important variables were:

- `DATABASE_URL` for the PostgreSQL database connection
- `SECRET_KEY` for Flask session security
- `LOG_LEVEL` for application logging
- `ADMIN_USERNAME` and `ADMIN_PASSWORD` for the protected admin login

Using Railway variables improved security by keeping credentials out of the repository. This also made the application easier to move between local development and production.

## 4. Database Integration

Railway PostgreSQL was provisioned as the managed database service. The Flask application connected to PostgreSQL using SQLAlchemy and the `psycopg` driver. The database schema included three main tables:

- `students`
- `courses`
- `enrollments`

The application supports CRUD operations for all core entities. For example, users can add a student, create a course, enroll a student in a course, edit records, and delete them.

To make the deployed system suitable for screenshots and controlled access, the application also includes a simple login page backed by session authentication. The credentials are stored in environment variables rather than in source code.

## 5. CI/CD Workflow

The repository was connected to Railway through GitHub. This enabled automatic redeployment each time new code was pushed to the main branch. This workflow reflects a simple CI/CD process because deployment became continuous and repeatable without manual server configuration.

An optional GitHub Actions workflow can also be added to run linting or tests before deployment in future iterations.

## 6. Monitoring and Logging

Railway logs were used to monitor the application. During debugging, an example issue occurred when the database connection string was missing or incorrect. The application logs reported a database connectivity failure during startup, which made the problem visible quickly. After updating the `DATABASE_URL` variable in Railway, the service redeployed successfully.

This demonstrated the usefulness of managed logs in diagnosing deployment and configuration problems.

## 7. Scalability Awareness

Railway uses usage-based pricing, so higher traffic would increase resource consumption and cost. If application traffic grew significantly, the first impacts would likely be:

- more database queries
- higher memory usage
- more concurrent requests

A practical scaling plan for this application would include:

1. Upgrading the Railway service resources.
2. Optimizing database queries and adding indexes if necessary.
3. Introducing pagination for large student or course lists.
4. Caching frequently accessed data.
5. Separating the frontend and backend if the system grows further.

## 8. Comparison with Another PaaS

Compared with Heroku, Railway provides a modern and visually simple developer experience. Railway makes it easy to provision services such as PostgreSQL directly inside the same project. The user interface is more intuitive for linking services and inspecting logs.

However, Heroku has a longer track record, a broader ecosystem, and more extensive documentation for enterprise workflows. Railway feels faster for student projects and prototypes, while Heroku may be stronger for teams that need mature operational conventions.

## 9. Challenges and Resolutions

One challenge was making the application portable between local development and Railway production. This was solved by using environment variables and allowing a local SQLite fallback when `DATABASE_URL` is not available.

Another challenge was ensuring that the PostgreSQL connection string worked correctly with the Python stack. This was addressed by normalizing legacy `postgres://` URLs into SQLAlchemy-compatible `postgresql://` format.

## 10. Conclusion

This assignment demonstrated the practical strengths of PaaS using Railway. The platform simplified deployment, configuration management, database provisioning, and monitoring. The project also showed how CI/CD and managed services reduce infrastructure overhead and allow developers to focus on application logic.
