


const form = document.getElementById("registrationForm");
const message = document.getElementById("message");
const result = document.getElementById("result");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const html = Number(document.getElementById("htmlMarks").value);
    const css = Number(document.getElementById("cssMarks").value);
    const js = Number(document.getElementById("jsMarks").value);

    // Validate marks
    const marks = [html, css, js];

    if (marks.some(mark => !Number.isFinite(mark) || mark < 0 || mark > 100)) {
        message.textContent = "Each subject's marks must be between 0 and 100.";
        message.className = "error";
        result.hidden = true;
        return;
    }

    const student = {
        name: document.getElementById("name").value.trim(),
        rollNumber: document.getElementById("roll").value,
        email: document.getElementById("email").value.trim(),
        course: document.getElementById("course").value,
        marks: {
            html: html,
            css: css,
            javascript: js
        }
    };

    if (!Number.isSafeInteger(Number(student.rollNumber)) ||
        Number(student.rollNumber) < 1) {
        message.textContent = "Please enter a valid roll number.";
        message.className = "error";
        result.hidden = true;
        return;
    }

    const students = JSON.parse(
        localStorage.getItem("students") || "[]"
    );

    const duplicate = students.some(
        s => String(s.rollNumber) === student.rollNumber
    );

    if (duplicate) {
        message.textContent = "This roll number is already registered.";
        message.className = "error";
        result.hidden = true;
        return;
    }

    // Calculate total and percentage
    const total = html + css + js;
    const percentage = (total / 300) * 100;

    // Pass requires at least 35 marks in every subject
    const status = marks.every(mark => mark >= 35) ? "Pass" : "Fail";

    student.total = total;
    student.percentage = Number(percentage.toFixed(2));
    student.status = status;

    // Convert student object to JSON and save it
    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));

    // Display the result
    document.getElementById("resultName").textContent = student.name;
    document.getElementById("resultRoll").textContent = student.rollNumber;
    document.getElementById("resultTotal").textContent = total;
    document.getElementById("resultPercentage").textContent =
        percentage.toFixed(2);

    const statusElement = document.getElementById("resultStatus");
    statusElement.textContent = status;
    statusElement.style.color = status === "Pass" ? "#15803d" : "#dc2626";

    result.hidden = false;

    message.textContent = "Student registered successfully!";
    message.className = "success";

    console.log("Student JSON:", JSON.stringify(student, null, 2));

    form.reset();
});