# 🚌 Bus Ticket Booking System

A full-stack Bus Ticket Booking web application built as an MCA Final Year Mini-Project. The system allows users to search for buses, book seats (with specific validations like women-only seats), and includes a secure Admin Dashboard to manage the fleet.

## 🚀 Technologies Used
- **Frontend:** Next.js (React), standard CSS (Dark Mode UI)
- **Backend:** Java 17, Spring Boot 3.2.4
- **Database:** PostgreSQL
- **Security:** JWT (JSON Web Tokens), Spring Security
- **Migrations:** Flyway

## ✨ Key Features
1. **Dynamic Route Search:** Search for any route and dynamically view available buses. Real-time departure logic prevents booking buses that have already left for the day.
2. **Interactive Seat Layout:** 
   - Visual mapping of available vs. booked seats.
   - Dedicated Pink seats reserved exclusively for female passengers.
3. **Role-Based Access Control (RBAC):**
   - **User Role:** Can search buses, book tickets, and view personal booking history.
   - **Admin Role:** Accesses a secure dashboard to add/delete buses, and view global system bookings and users.
4. **Automated Database Seeding:** Flyway migrations and a Spring Boot DataInitializer ensure the system is populated with default Admin credentials and dummy routes out-of-the-box.

## ⚙️ How to Run Locally

### 1. Backend Setup
1. Make sure you have **PostgreSQL** installed and running on port `5432`.
2. Create a database named `bus_booking` (credentials default to `postgres` / `postgres`).
3. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
4. Run the Spring Boot application:
   ```bash
   .\mvnw.cmd spring-boot:run
   ```
   *The backend will run on `http://localhost:8080` and automatically create all tables.*

### 2. Frontend Setup
1. Open a new terminal and navigate to the project root:
   ```bash
   cd "bus ticket booking"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:3000`.

## 🔐 Default Credentials
- **Admin Login:** `admin` / `admin`

---
*Developed as an MCA Final Year Mini-Project.*
