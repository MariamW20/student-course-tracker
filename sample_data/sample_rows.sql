INSERT INTO students (student_number, first_name, last_name, email, program)
VALUES
    ('SCT-001', 'Amina', 'Nalule', 'amina@example.com', 'Computer Science'),
    ('SCT-002', 'David', 'Okello', 'david@example.com', 'Information Technology');

INSERT INTO courses (code, title, instructor, credit_hours)
VALUES
    ('CSC101', 'Introduction to Programming', 'Dr. Kato', 3),
    ('DBS220', 'Database Systems', 'Ms. Namusoke', 4);

INSERT INTO enrollments (student_id, course_id, semester, status)
VALUES
    (1, 1, '2026 Semester 1', 'active'),
    (2, 2, '2026 Semester 1', 'active');
