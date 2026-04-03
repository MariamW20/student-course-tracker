from functools import wraps

from flask import (
    Blueprint,
    current_app,
    jsonify,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from sqlalchemy.exc import IntegrityError

from .models import Course, Enrollment, Student, db


main_bp = Blueprint("main", __name__)


def is_authenticated():
    return bool(session.get("authenticated"))


def login_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if not is_authenticated():
            return jsonify({"error": "Authentication required."}), 401
        return view(*args, **kwargs)

    return wrapped_view


@main_bp.get("/")
def landing():
    return render_template("landing.html", authenticated=is_authenticated())


@main_bp.get("/dashboard")
def index():
    if not is_authenticated():
        return redirect(url_for("main.login"))
    return render_template("index.html")


@main_bp.get("/records")
def records():
    if not is_authenticated():
        return redirect(url_for("main.login"))
    return render_template("records.html")


@main_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        if is_authenticated():
            return redirect(url_for("main.index"))
        return render_template("login.html")

    payload = request.get_json(silent=True) or request.form
    username = str(payload.get("username", "")).strip()
    password = str(payload.get("password", "")).strip()

    if (
        username == current_app.config["ADMIN_USERNAME"]
        and password == current_app.config["ADMIN_PASSWORD"]
    ):
        session["authenticated"] = True
        session["username"] = username
        if request.is_json:
            return jsonify({"message": "Login successful."})
        return redirect(url_for("main.index"))

    if request.is_json:
        return jsonify({"error": "Invalid username or password."}), 401
    return render_template(
        "login.html", error="Invalid username or password."
    ), 401


@main_bp.post("/logout")
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully."})


@main_bp.get("/health")
def health():
    return jsonify({"status": "ok"})


@main_bp.get("/api/session")
@login_required
def session_info():
    return jsonify({"authenticated": True, "username": session.get("username", "admin")})


@main_bp.get("/api/summary")
@login_required
def summary():
    return jsonify(
        {
            "students": Student.query.count(),
            "courses": Course.query.count(),
            "enrollments": Enrollment.query.count(),
        }
    )


@main_bp.get("/api/students")
@login_required
def list_students():
    students = Student.query.order_by(Student.id.desc()).all()
    return jsonify([student.to_dict() for student in students])


@main_bp.post("/api/students")
@login_required
def create_student():
    payload = request.get_json(force=True)
    student = Student(
        student_number=payload["student_number"].strip(),
        first_name=payload["first_name"].strip(),
        last_name=payload["last_name"].strip(),
        email=payload["email"].strip().lower(),
        program=payload["program"].strip(),
    )
    db.session.add(student)
    return commit_response(student, 201)


@main_bp.put("/api/students/<int:student_id>")
@login_required
def update_student(student_id):
    payload = request.get_json(force=True)
    student = Student.query.get_or_404(student_id)
    student.student_number = payload["student_number"].strip()
    student.first_name = payload["first_name"].strip()
    student.last_name = payload["last_name"].strip()
    student.email = payload["email"].strip().lower()
    student.program = payload["program"].strip()
    return commit_response(student)


@main_bp.delete("/api/students/<int:student_id>")
@login_required
def delete_student(student_id):
    student = Student.query.get_or_404(student_id)
    db.session.delete(student)
    return commit_response(message="Student deleted.")


@main_bp.get("/api/courses")
@login_required
def list_courses():
    courses = Course.query.order_by(Course.id.desc()).all()
    return jsonify([course.to_dict() for course in courses])


@main_bp.post("/api/courses")
@login_required
def create_course():
    payload = request.get_json(force=True)
    course = Course(
        code=payload["code"].strip().upper(),
        title=payload["title"].strip(),
        instructor=payload["instructor"].strip(),
        credit_hours=int(payload["credit_hours"]),
    )
    db.session.add(course)
    return commit_response(course, 201)


@main_bp.put("/api/courses/<int:course_id>")
@login_required
def update_course(course_id):
    payload = request.get_json(force=True)
    course = Course.query.get_or_404(course_id)
    course.code = payload["code"].strip().upper()
    course.title = payload["title"].strip()
    course.instructor = payload["instructor"].strip()
    course.credit_hours = int(payload["credit_hours"])
    return commit_response(course)


@main_bp.delete("/api/courses/<int:course_id>")
@login_required
def delete_course(course_id):
    course = Course.query.get_or_404(course_id)
    db.session.delete(course)
    return commit_response(message="Course deleted.")


@main_bp.get("/api/enrollments")
@login_required
def list_enrollments():
    enrollments = Enrollment.query.order_by(Enrollment.id.desc()).all()
    return jsonify([enrollment.to_dict() for enrollment in enrollments])


@main_bp.post("/api/enrollments")
@login_required
def create_enrollment():
    payload = request.get_json(force=True)
    student = Student.query.get_or_404(int(payload["student_id"]))
    course = Course.query.get_or_404(int(payload["course_id"]))
    enrollment = Enrollment(
        student=student,
        course=course,
        semester=payload["semester"].strip(),
        status=payload["status"].strip().lower(),
    )
    db.session.add(enrollment)
    return commit_response(enrollment, 201)


@main_bp.put("/api/enrollments/<int:enrollment_id>")
@login_required
def update_enrollment(enrollment_id):
    payload = request.get_json(force=True)
    enrollment = Enrollment.query.get_or_404(enrollment_id)
    enrollment.student = Student.query.get_or_404(int(payload["student_id"]))
    enrollment.course = Course.query.get_or_404(int(payload["course_id"]))
    enrollment.semester = payload["semester"].strip()
    enrollment.status = payload["status"].strip().lower()
    return commit_response(enrollment)


@main_bp.delete("/api/enrollments/<int:enrollment_id>")
@login_required
def delete_enrollment(enrollment_id):
    enrollment = Enrollment.query.get_or_404(enrollment_id)
    db.session.delete(enrollment)
    return commit_response(message="Enrollment deleted.")


@main_bp.post("/api/seed")
@login_required
def seed_data():
    if Student.query.first() or Course.query.first():
        return jsonify({"message": "Seed data already exists."}), 409

    students = [
        Student(
            student_number="SCT-001",
            first_name="Amina",
            last_name="Nalule",
            email="amina@example.com",
            program="Computer Science",
        ),
        Student(
            student_number="SCT-002",
            first_name="David",
            last_name="Okello",
            email="david@example.com",
            program="Information Technology",
        ),
    ]
    courses = [
        Course(
            code="CSC101",
            title="Introduction to Programming",
            instructor="Dr. Kato",
            credit_hours=3,
        ),
        Course(
            code="DBS220",
            title="Database Systems",
            instructor="Ms. Namusoke",
            credit_hours=4,
        ),
    ]

    db.session.add_all(students + courses)
    db.session.flush()
    db.session.add_all(
        [
            Enrollment(
                student_id=students[0].id,
                course_id=courses[0].id,
                semester="2026 Semester 1",
                status="active",
            ),
            Enrollment(
                student_id=students[1].id,
                course_id=courses[1].id,
                semester="2026 Semester 1",
                status="active",
            ),
        ]
    )
    return commit_response(message="Sample data loaded.", status_code=201)


@main_bp.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found."}), 404


@main_bp.app_errorhandler(400)
def bad_request(error):
    return jsonify({"error": "Bad request."}), 400


@main_bp.app_errorhandler(Exception)
def handle_exception(error):
    current_app.logger.exception("Unhandled application error: %s", error)
    return jsonify({"error": "An unexpected server error occurred."}), 500


def commit_response(resource=None, status_code=200, message=None):
    try:
        db.session.commit()
    except KeyError as error:
        db.session.rollback()
        return jsonify({"error": f"Missing required field: {error.args[0]}"}), 400
    except ValueError as error:
        db.session.rollback()
        return jsonify({"error": str(error)}), 400
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Duplicate or invalid relational data detected."}), 409

    if message:
        return jsonify({"message": message}), status_code
    return jsonify(resource.to_dict()), status_code
