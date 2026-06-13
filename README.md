# CareFlow Hospital Management System

CareFlow is a modern, full-stack Hospital Management System designed to orchestrate patient booking, medical record entry, billing, payments, and system auditing. It is composed of a Spring Boot REST API backend and three React.js dashboards running in an NPM workspaces monorepo.

---

## Folder Structure

```
hospital_management/
│
├── DoctorAppointment/                 # Spring Boot 4.x backend
│   ├── pom.xml                        # Maven dependencies config
│   ├── mvnw                           # Maven Wrapper script (macOS/Linux)
│   ├── src/main/java/com/hcl/DoctorAppointment/
│   │   ├── config/                    # Security configurations, CORS, Swagger
│   │   ├── controller/                # REST Controllers
│   │   ├── dto/                       # Request/Response payloads
│   │   ├── exception/                 # Centralized Exception Handlers
│   │   ├── model/                     # JPA Hibernate Entity models
│   │   ├── repository/                # Spring Data JPA Repository layer
│   │   ├── scheduler/                 # Payment timeout check schedulers
│   │   ├── security/                  # Custom Authentication provider utilities
│   │   └── util/                      # QRCode and Audit logging helpers
│   └── src/main/resources/            # application.properties (in-memory H2 config)
│
├── frontend/                           # React.js Monorepo (NPM Workspaces)
│   ├── package.json                    # Monorepo workspaces config
│   ├── common/                         # Shared Auth interceptors & UI layouts
│   ├── patient-portal/                 # Patient appointment bookings & bills (Port 3000)
│   ├── doctor-portal/                  # Clinical records & schedules workspace (Port 3001)
│   └── admin-panel/                    # Bed occupancy analytics & audit trails (Port 3002)
│
├── docs/                              # API Postman collections documentation
└── README.md                          # Configuration & running guide
```

---

## Requirements

To run this application, make sure you have:
- **Java Development Kit (JDK) 17 or higher**
- **Node.js 18.x or higher & npm**

---

## Running the Backend

The backend utilizes an in-memory **H2 Database** for testing by default, with MySQL database properties configured and available.

1. Navigate to the backend directory:
   ```bash
   cd DoctorAppointment
   ```

2. Build and run using the Maven Wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The server will boot on `http://localhost:8080`.*

3. Access the APIs directly via Swagger UI console:
   `http://localhost:8080/swagger-ui.html`

4. Inspect database tables inside H2 Web Console:
   - URL: `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:hospitaldb`
   - Username: `sa`
   - Password: `password`

---

## Running the Frontend

The frontend is structured as a monorepo workspace.

1. Install all monorepo dependencies from the root directory:
   ```bash
   cd frontend
   npm install
   ```

2. Start any or all dashboards from the `frontend` directory:
   - To run the **Patient Portal** (Port 3000):
     ```bash
     npm run dev:patient
     ```
   - To run the **Doctor Workspace** (Port 3001):
     ```bash
     npm run dev:doctor
     ```
   - To run the **Admin Panel** (Port 3002):
     ```bash
     npm run dev:admin
     ```

---

## Simulated Authentication Logins

Each frontend portal features a simulated authentication login for quick exploration:
- **Patient Portal:** Sign in with any username (e.g. `johndoe`) and password.
- **Doctor Portal:** Sign in with any clinician username (e.g. `drjenkins`) and password.
- **Admin Panel:** Sign in with any admin credentials (e.g. `systemadmin`) and security key.