// Get elements
const studentForm = document.getElementById("studentForm");
const rollNoInput = document.getElementById("rollNo");
const studentNameInput = document.getElementById("studentName");
const courseInput = document.getElementById("course");
const yearInput = document.getElementById("year");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

const tableBody = document.getElementById("studentTableBody");
const noRecords = document.getElementById("noRecords");

const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");

let students = JSON.parse(localStorage.getItem("students")) || [];

let editIndex = -1;


// Display students when page loads
displayStudents();


// Add / Update student
studentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const rollNo = rollNoInput.value.trim();
    const name = studentNameInput.value.trim();
    const course = courseInput.value.trim();
    const year = yearInput.value;
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    // Validate duplicate roll number when adding
    if (editIndex === -1) {

        const duplicate = students.some(
            student => student.rollNo.toLowerCase() === rollNo.toLowerCase()
        );

        if (duplicate) {
            alert("A student with this roll number already exists.");
            return;
        }
    }

    const student = {
        rollNo: rollNo,
        name: name,
        course: course,
        year: year,
        email: email,
        phone: phone
    };


    // Update existing student
    if (editIndex !== -1) {

        students[editIndex] = student;

        alert("Student details updated successfully.");

        editIndex = -1;

        submitBtn.textContent = "Add Student";
        formTitle.textContent = "Add Student";
        cancelBtn.style.display = "none";

    } else {

        // Add new student
        students.push(student);

        alert("Student added successfully.");
    }


    saveStudents();
    displayStudents();

    studentForm.reset();
});


// Save data to localStorage
function saveStudents() {

    localStorage.setItem("students", JSON.stringify(students));
}


// Display all students
function displayStudents(data = students) {

    tableBody.innerHTML = "";

    if (data.length === 0) {

        noRecords.style.display = "block";
        return;

    } else {

        noRecords.style.display = "none";
    }


    data.forEach((student, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.year}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>

            <td>
                <button class="edit-btn" onclick="editStudent(${index})">
                    Edit
                </button>

                <button class="delete-btn" onclick="deleteStudent(${index})">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}


// Search student by roll number
function searchStudent() {

    const searchValue = document
        .getElementById("searchRoll")
        .value
        .trim()
        .toLowerCase();


    if (searchValue === "") {

        displayStudents();
        return;
    }


    const result = students.filter(student =>
        student.rollNo.toLowerCase().includes(searchValue)
    );


    displayStudents(result);

    if (result.length === 0) {
        alert("No student found with this roll number.");
    }
}


// Delete student
function deleteStudent(index) {

    const studentName = students[index].name;

    const confirmation = confirm(
        `Are you sure you want to delete ${studentName}?`
    );


    if (!confirmation) {
        return;
    }


    students.splice(index, 1);

    saveStudents();
    displayStudents();

    alert("Student deleted successfully.");
}


// Edit student
function editStudent(index) {

    const student = students[index];

    rollNoInput.value = student.rollNo;
    studentNameInput.value = student.name;
    courseInput.value = student.course;
    yearInput.value = student.year;
    emailInput.value = student.email;
    phoneInput.value = student.phone;


    editIndex = index;

    submitBtn.textContent = "Update Student";
    formTitle.textContent = "Update Student";
    cancelBtn.style.display = "inline-block";


    // Scroll to form
    document.querySelector(".form-section").scrollIntoView({
        behavior: "smooth"
    });
}


// Cancel editing
function cancelEdit() {

    editIndex = -1;

    studentForm.reset();

    submitBtn.textContent = "Add Student";
    formTitle.textContent = "Add Student";

    cancelBtn.style.display = "none";
}


// Allow Enter key to search
document.getElementById("searchRoll").addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        searchStudent();
    }

});
