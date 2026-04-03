const state = {
  students: [],
  courses: [],
  enrollments: [],
};

document.addEventListener("DOMContentLoaded", () => {
  bindForms();
  bindUtilityButtons();
  loadAll();
});

function bindForms() {
  const studentForm = document.getElementById("studentForm");
  const courseForm = document.getElementById("courseForm");
  const enrollmentForm = document.getElementById("enrollmentForm");

  if (studentForm) {
    studentForm.addEventListener("submit", submitStudent);
  }
  if (courseForm) {
    courseForm.addEventListener("submit", submitCourse);
  }
  if (enrollmentForm) {
    enrollmentForm.addEventListener("submit", submitEnrollment);
  }
}

function bindUtilityButtons() {
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }
  document.querySelectorAll("[data-reset-form]").forEach((button) => {
    button.addEventListener("click", () => resetForm(button.dataset.resetForm));
  });
}

async function loadAll() {
  await Promise.all([loadSessionInfo(), loadSummary(), loadStudents(), loadCourses(), loadEnrollments()]);
}

async function loadSessionInfo() {
  const sessionInfo = await api("/api/session");
  const sessionUser = document.getElementById("sessionUser");
  if (sessionUser) {
    sessionUser.textContent = sessionInfo.username;
  }
}

async function loadSummary() {
  const summary = await api("/api/summary");
  setText("studentCount", summary.students);
  setText("courseCount", summary.courses);
  setText("enrollmentCount", summary.enrollments);
}

async function loadStudents() {
  state.students = await api("/api/students");
  renderStudents();
  renderStudentSelect();
}

async function loadCourses() {
  state.courses = await api("/api/courses");
  renderCourses();
  renderCourseSelect();
}

async function loadEnrollments() {
  state.enrollments = await api("/api/enrollments");
  renderEnrollments();
}

async function submitStudent(event) {
  event.preventDefault();
  const id = document.getElementById("studentId").value;
  const payload = {
    student_number: document.getElementById("studentNumber").value,
    first_name: document.getElementById("studentFirstName").value,
    last_name: document.getElementById("studentLastName").value,
    email: document.getElementById("studentEmail").value,
    program: document.getElementById("studentProgram").value,
  };
  const path = id ? `/api/students/${id}` : "/api/students";
  const method = id ? "PUT" : "POST";
  await api(path, method, payload);
  resetForm("studentForm");
  notify(`Student ${id ? "updated" : "created"} successfully.`, "success");
  await Promise.all([loadStudents(), loadSummary()]);
}

async function submitCourse(event) {
  event.preventDefault();
  const id = document.getElementById("courseId").value;
  const payload = {
    code: document.getElementById("courseCode").value,
    title: document.getElementById("courseTitle").value,
    instructor: document.getElementById("courseInstructor").value,
    credit_hours: document.getElementById("courseCredits").value,
  };
  const path = id ? `/api/courses/${id}` : "/api/courses";
  const method = id ? "PUT" : "POST";
  await api(path, method, payload);
  resetForm("courseForm");
  notify(`Course ${id ? "updated" : "created"} successfully.`, "success");
  await Promise.all([loadCourses(), loadSummary()]);
}

async function submitEnrollment(event) {
  event.preventDefault();
  const id = document.getElementById("enrollmentId").value;
  const payload = {
    student_id: document.getElementById("enrollmentStudent").value,
    course_id: document.getElementById("enrollmentCourse").value,
    semester: document.getElementById("enrollmentSemester").value,
    status: document.getElementById("enrollmentStatus").value,
  };
  const path = id ? `/api/enrollments/${id}` : "/api/enrollments";
  const method = id ? "PUT" : "POST";
  await api(path, method, payload);
  resetForm("enrollmentForm");
  notify(`Enrollment ${id ? "updated" : "created"} successfully.`, "success");
  await Promise.all([loadEnrollments(), loadSummary()]);
}

function renderStudents() {
  const host = document.getElementById("studentsList");
  if (!host) {
    return;
  }
  const canEdit = Boolean(document.getElementById("studentForm"));
  if (state.students.length === 0) {
    host.innerHTML = '<p class="empty-state">No students added yet.</p>';
    return;
  }
  host.innerHTML = state.students
    .map(
      (student) => `
        <article class="list-card">
          <h3>${escapeHtml(student.first_name)} ${escapeHtml(student.last_name)}</h3>
          <p>${escapeHtml(student.student_number)} | ${escapeHtml(student.program)}</p>
          <p>${escapeHtml(student.email)}</p>
          <div class="actions">
            ${canEdit ? `<button class="btn btn-sm btn-outline-dark" onclick="prefillStudent(${student.id})">Edit</button>` : ""}
            <button class="btn btn-sm btn-outline-danger" onclick="removeStudent(${student.id})">Delete</button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderCourses() {
  const host = document.getElementById("coursesList");
  if (!host) {
    return;
  }
  const canEdit = Boolean(document.getElementById("courseForm"));
  if (state.courses.length === 0) {
    host.innerHTML = '<p class="empty-state">No courses added yet.</p>';
    return;
  }
  host.innerHTML = state.courses
    .map(
      (course) => `
        <article class="list-card">
          <h3>${escapeHtml(course.code)}: ${escapeHtml(course.title)}</h3>
          <p>${escapeHtml(course.instructor)} | ${course.credit_hours} credit hours</p>
          <div class="actions">
            ${canEdit ? `<button class="btn btn-sm btn-outline-dark" onclick="prefillCourse(${course.id})">Edit</button>` : ""}
            <button class="btn btn-sm btn-outline-danger" onclick="removeCourse(${course.id})">Delete</button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderEnrollments() {
  const host = document.getElementById("enrollmentsList");
  if (!host) {
    return;
  }
  const canEdit = Boolean(document.getElementById("enrollmentForm"));
  if (state.enrollments.length === 0) {
    host.innerHTML = '<p class="empty-state">No enrollments added yet.</p>';
    return;
  }
  host.innerHTML = state.enrollments
    .map(
      (enrollment) => `
        <article class="list-card">
          <h3>${escapeHtml(enrollment.student_name)}</h3>
          <p>${escapeHtml(enrollment.course_code)} | ${escapeHtml(enrollment.course_title)}</p>
          <p>${escapeHtml(enrollment.semester)} | <span class="${enrollment.status === "dropped" ? "danger-text" : ""}">${escapeHtml(enrollment.status)}</span></p>
          <div class="actions">
            ${canEdit ? `<button class="btn btn-sm btn-outline-dark" onclick="prefillEnrollment(${enrollment.id})">Edit</button>` : ""}
            <button class="btn btn-sm btn-outline-danger" onclick="removeEnrollment(${enrollment.id})">Delete</button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderStudentSelect() {
  const select = document.getElementById("enrollmentStudent");
  if (!select) {
    return;
  }
  select.innerHTML = '<option value="">Choose a student</option>' +
    state.students
      .map(
        (student) => `<option value="${student.id}">${escapeHtml(student.student_number)} - ${escapeHtml(student.first_name)} ${escapeHtml(student.last_name)}</option>`
      )
      .join("");
}

function renderCourseSelect() {
  const select = document.getElementById("enrollmentCourse");
  if (!select) {
    return;
  }
  select.innerHTML = '<option value="">Choose a course</option>' +
    state.courses
      .map(
        (course) => `<option value="${course.id}">${escapeHtml(course.code)} - ${escapeHtml(course.title)}</option>`
      )
      .join("");
}

function prefillStudent(id) {
  const student = state.students.find((item) => item.id === id);
  document.getElementById("studentId").value = student.id;
  document.getElementById("studentNumber").value = student.student_number;
  document.getElementById("studentFirstName").value = student.first_name;
  document.getElementById("studentLastName").value = student.last_name;
  document.getElementById("studentEmail").value = student.email;
  document.getElementById("studentProgram").value = student.program;
}

function prefillCourse(id) {
  const course = state.courses.find((item) => item.id === id);
  document.getElementById("courseId").value = course.id;
  document.getElementById("courseCode").value = course.code;
  document.getElementById("courseTitle").value = course.title;
  document.getElementById("courseInstructor").value = course.instructor;
  document.getElementById("courseCredits").value = course.credit_hours;
}

function prefillEnrollment(id) {
  const enrollment = state.enrollments.find((item) => item.id === id);
  document.getElementById("enrollmentId").value = enrollment.id;
  document.getElementById("enrollmentStudent").value = enrollment.student_id;
  document.getElementById("enrollmentCourse").value = enrollment.course_id;
  document.getElementById("enrollmentSemester").value = enrollment.semester;
  document.getElementById("enrollmentStatus").value = enrollment.status;
}

async function removeStudent(id) {
  if (!window.confirm("Delete this student and related enrollments?")) {
    return;
  }
  await api(`/api/students/${id}`, "DELETE");
  notify("Student deleted.", "success");
  await Promise.all([loadStudents(), loadEnrollments(), loadSummary()]);
}

async function removeCourse(id) {
  if (!window.confirm("Delete this course and related enrollments?")) {
    return;
  }
  await api(`/api/courses/${id}`, "DELETE");
  notify("Course deleted.", "success");
  await Promise.all([loadCourses(), loadEnrollments(), loadSummary()]);
}

async function removeEnrollment(id) {
  if (!window.confirm("Delete this enrollment?")) {
    return;
  }
  await api(`/api/enrollments/${id}`, "DELETE");
  notify("Enrollment deleted.", "success");
  await Promise.all([loadEnrollments(), loadSummary()]);
}

async function logout() {
  await api("/logout", "POST");
  window.location.href = "/";
}

function resetForm(formId) {
  document.getElementById(formId).reset();
  const hiddenInput = document.querySelector(`#${formId} input[type="hidden"]`);
  if (hiddenInput) {
    hiddenInput.value = "";
  }
}

function notify(message, type) {
  const host = document.getElementById("alertHost");
  if (!host) {
    return;
  }
  host.innerHTML = `
    <div class="alert alert-${type === "success" ? "success" : "danger"} mb-0" role="alert">
      ${escapeHtml(message)}
    </div>
  `;
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

async function api(url, method = "GET", data) {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  const payload = await response.json();
  if (response.status === 401) {
    window.location.href = "/login";
    throw new Error("Authentication required.");
  }
  if (!response.ok) {
    notify(payload.error || payload.message || "Request failed.", "danger");
    throw new Error(payload.error || payload.message || "Request failed.");
  }
  return payload;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
