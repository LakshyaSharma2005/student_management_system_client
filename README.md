# 🎓 Student Management System (MERN Stack)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

A comprehensive, responsive web application for managing university operations. This system features Role-Based Access Control (RBAC) for Admins, Teachers, and Students, allowing for efficient management of attendance, marks, fees, and student data.

---

## 🚀 Live Demo

**🔗 Client URL:** [https://student-management-system-client.onrender.com](https://student-management-system-client.onrender.com)  
*(Note: The server is hosted on Render's free tier. Please allow 30-60 seconds for the backend to spin up on the first request.)*

---

## ✨ Key Features

### 🔐 Authentication & Security
* **Role-Based Access Control (RBAC):** Distinct dashboards for Admin, Teacher, and Student.
* **Secure Login:** JWT Authentication & Bcrypt password hashing.
* **Captcha Protection:** Custom-built random captcha verification on login to prevent spam.

### 👨‍🏫 Faculty Portal (Teacher Dashboard)
* **Mark Attendance:** Interactive grid to mark students Present/Absent with bulk actions.
* **Gradebook:** Upload and manage marks for Minors, Majors, Assignments, and Practical exams.
* **Analytics:** Visual charts (Bar Charts) for attendance trends and pass/fail statistics.
* **Responsive UI:** Fully responsive sidebar and layout that works on mobile and desktop.

### 🎒 Student Portal
* **Performance Tracking:** View CGPA, attendance percentages, and detailed result sheets.
* **Fee Management:** View pending dues and simulate payments via a mock payment gateway.
* **Attendance History:** Detailed logs of daily attendance status.

### ⚙️ Admin Panel
* **User Management:** Add/Edit/Delete Students and Teachers.
* **System Stats:** Overview of total revenue, enrollment, and active faculty.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, React Router DOM, Axios, Custom CSS (Flexbox/Grid).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB Atlas (Cloud).
* **Deployment:** Render (Both Client and Server).

---

## 📸 Screenshots

| Login Page | Teacher Dashboard |
|:---:|:---:|
| <img src="https://via.placeholder.com/400x200?text=Login+Page" alt="Login Page" width="400"> | <img src="https://via.placeholder.com/400x200?text=Teacher+Dash" alt="Teacher Dashboard" width="400"> |

| Student Dashboard | Responsive Mobile View |
|:---:|:---:|
| <img src="https://via.placeholder.com/400x200?text=Student+Dash" alt="Student Dashboard" width="400"> | <img src="https://via.placeholder.com/400x200?text=Mobile+View" alt="Mobile View" width="400"> |

*(Tip: Replace these placeholder links with actual screenshots from your project for a better portfolio look)*

---

## 🧪 Demo Credentials

You can use these credentials to test the live application:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin1@gmail.com` | *(Your Password)* |
| **Teacher** | `teacher@cpu.edu` | `teacher123` |
| **Student** | `student@cpu.edu` | `student123` |

---

## 💻 Run Locally

Follow these steps to run the project on your local machine:

**1. Clone the Repository**
```bash
git clone [https://github.com/your-username/student-management-system.git](https://github.com/your-username/student-management-system.git)
cd student-management-system
