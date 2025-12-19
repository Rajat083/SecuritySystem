# Campus Security System

A FastAPI-based security management system for campus gate entry and exit tracking. The system manages student and visitor access control with JWT authentication, role-based access control (RBAC), policy enforcement, late entry violations, and comprehensive logging.

## Features

### Authentication & Authorization
- **JWT Authentication**: Secure token-based authentication using JSON Web Tokens
- **Role-Based Access Control (RBAC)**: 
  - **ADMIN**: Full system access, can create and manage users
  - **GUARD**: Can record student/visitor entries and exits at gates
  - **VIEWER**: Read-only access to logs and campus state
- **OAuth2 Password Flow**: Standard OAuth2 password bearer authentication
- **Token Expiration**: 60-minute token lifetime for security
- **Password Hashing**: Secure bcrypt password hashing

### Core Functionality
- **Student Access Management**: Track student entries and exits with purpose-based permissions
- **Visitor Access Management**: Register and track visitor entries and exits
- **Gate Tracking**: Record which gate (1-10) was used for each entry/exit
- **Late Entry Detection**: Automatically flag students who return after their permitted time
- **Dual Exit Purposes**: Support for "MARKET" (time-limited) and "HOME" (flexible) exits
- **Duplicate Prevention**: Prevent students from entering if already inside campus

### Data Management
- **Separate Logging**: Dedicated collections for student and visitor logs
- **Campus State Tracking**: Real-time tracking of who's inside/outside campus
- **Exit Permissions**: Time-bound exit permissions with validation
- **Visitor Records**: Comprehensive visitor information including vehicle details
- **User Management**: Secure user account creation and management

## Architecture

### SOLID Principles Implementation
- **Abstract Base Classes**: `User`, `EntryPolicy`, `ExitPolicy` for extensibility
- **Policy Pattern**: Separate entry/exit validation logic from business logic
- **Service Layer**: Isolated services for entry, exit, logging, and state management
- **Domain Models**: Clean separation of domain logic and data models

### Project Structure
```
SecuritySystem/
├── app/
│   ├── main.py                    # FastAPI application entry point
│   ├── api/                       # API route handlers
│   │   ├── auth_routes.py         # Authentication endpoints (login)
│   │   ├── admin_routes.py        # Admin endpoints (user management)
│   │   ├── dependencies.py        # JWT token validation & user extraction
│   │   ├── permissions.py         # Role-based authorization decorators
│   │   ├── student_routes.py      # Student entry/exit endpoints
│   │   ├── visitor_routes.py      # Visitor entry/exit endpoints
│   │   └── state_routes.py        # Campus state & logs endpoints
│   ├── core/                      # Core configurations
│   │   ├── enums.py               # Enum definitions (Role, Direction, etc.)
│   │   ├── security.py            # JWT token creation and configuration
│   │   ├── passwords.py           # Password hashing utilities
│   │   └── database/              # Database setup
│   │       ├── client.py          # MongoDB client
│   │       ├── collections.py     # Collection definitions
│   │       └── indexes.py         # Database indexes
│   ├── domain/                    # Domain logic
│   │   ├── Users/                 # User models
│   │   │   ├── user.py            # Abstract User base class
│   │   │   ├── student.py         # Student model
│   │   │   └── visitor.py         # Visitor model
│   │   ├── EntryPolicy/           # Entry validation policies
│   │   │   ├── entry_policy.py    # Abstract policy
│   │   │   ├── student_entry.py   # Student entry validation
│   │   │   ├── visitor_entry.py   # Visitor entry validation
│   │   │   └── violations.py      # Entry violation types
│   │   └── ExitPolicy/            # Exit validation policies
│   │       ├── exit_policy.py     # Abstract policy
│   │       ├── student_exit_policy.py
│   │       └── visitor_exit_policy.py
│   ├── models/                    # Data models
│   │   ├── auth_user.py           # Authentication user model
│   │   ├── access_log.py          # Access log model
│   │   ├── campus_state.py        # Campus state model
│   │   └── exit_permission.py     # Exit permission model
│   ├── schemas/                   # Request/Response schemas
│   │   ├── admin_create_user.py   # Admin user creation schema
│   │   ├── student_entry.py       # Student entry request
│   │   ├── student_exit.py        # Student exit request
│   │   └── visitor_entry.py       # Visitor entry request
│   └── services/                  # Business logic services
│       ├── access_log_service.py  # Logging service
│       ├── campus_state_service.py # State management
│       └── access/                # Access control services
│           ├── student_entry_service.py
│           ├── student_exit_service.py
│           ├── visitor_entry_service.py
│           └── visitor_exit_service.py
├── requirements.txt               # Python dependencies
└── README.md
```

## Database Collections

### MongoDB Collections
- **auth_users**: User accounts with roles and password hashes
- **student_logs**: All student entry/exit records
- **visitor_logs**: All visitor entry/exit records
- **access_logs**: Combined log of all access events
- **campus_state**: Current inside/outside status of all users
- **exit_permissions**: Active exit permissions with return times
- **visitors**: Visitor registration details

## Technology Stack

### Core Dependencies
- **FastAPI** (0.124.4): Modern, fast web framework for building APIs
- **Motor** (3.7.1): Async MongoDB driver
- **PyMongo** (4.15.5): MongoDB Python driver
- **Pydantic** (2.12.5): Data validation using Python type annotations

### Authentication & Security
- **python-jose** (3.5.0): JWT token creation and validation
- **passlib** (1.7.4): Password hashing library
- **bcrypt** (4.0.1): Password hashing algorithm
- **cryptography** (46.0.3): Cryptographic recipes and primitives
- **python-multipart** (0.0.21): Form data parsing for OAuth2

### Configuration
- **python-dotenv** (1.2.1): Environment variable management

## API Endpoints

### Authentication Endpoints

#### Login
```http
POST /auth/login
Content-Type: application/x-www-form-urlencoded

username=guard01&password=securepassword
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Note:** All subsequent requests must include the token in the Authorization header:
```http
Authorization: Bearer <access_token>
```

### Admin Endpoints

#### Create User
**Requires:** ADMIN role

```http
POST /admin/users
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "username": "guard01",
  "password": "securepassword",
  "role": "GUARD"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "username": "guard01",
  "role": "GUARD"
}
```

**Available Roles:**
- `ADMIN`: Full system access
- `GUARD`: Can record entries/exits
- `VIEWER`: Read-only access

### Student Endpoints

**Note:** All student endpoints require GUARD role authentication.

#### Student Entry
**Requires:** GUARD role

```http
POST /student/entry
Authorization: Bearer <guard_token>
Content-Type: application/json

{
  "roll_number": "23BCS083",
  "gate_number": 1
}
```

**Response (Success):**
```json
{
  "status": "entered_successfully"
}
```

**Response (Late Entry):**
```json
{
  "status": "entered_with_violation",
  "violation": "LATE_ENTRY",
  "allowed_until": "2025-12-17T20:30:00",
  "entered_at": "2025-12-17T21:00:00"
}
```

**Response (Already Inside):**
```json
{
  "status": "entry_denied",
  "message": "Student 23BCS083 is already inside campus"
}
```

#### Student Exit
**Requires:** GUARD role

```http
POST /student/exit
Authorization: Bearer <guard_token>
Content-Type: application/json

{
  "roll_number": "23BCS083",
  "purpose": "MARKET",
  "return_by": "2025-12-17T20:30:00",
  "gate_number": 2
}
```

**Response:**
```json
{
  "status": "exit_recorded"
}
```

**Validation Rules:**
- `purpose`: Must be "MARKET" or "HOME"
- `return_by`: Must be in the future
- `return_by` for MARKET: Cannot exceed 12 hours from current time

### Visitor Endpoints

**Note:** All visitor endpoints require GUARD role authentication.

#### Visitor Entry
**Requires:** GUARD role

```http
POST /visitor/entry
Authorization: Bearer <guard_token>
Content-Type: application/json

{
  "name": "Rajat Sharma",
  "phone_number": "9317403670",
  "number_of_visitors": 2,
  "vehicle_number": "HP34C0272",
  "gate_number": 1
}
```

**Response:**
```json
{
  "status": "entered",
  "visitor_id": "67a1b2c3d4e5f6g7h8i9j0k1"
}
```

**Field Validations:**
- `phone_number`: Indian mobile number format (10 digits, starts with 6-9)
- `vehicle_number`: Format XX##XX####  (e.g., HP12AB1234) - Optional
- `number_of_visitors`: 1-20

#### Visitor Exit
**Requires:** GUARD role

```http
POST /visitor/exit/{visitor_id}?gate_number=2
Authorization: Bearer <guard_token>
```

**Response:**
```json
{
  "status": "exited"
}
```

### State & Logs Endpoints

**Note:** These endpoints may require appropriate role permissions (GUARD or VIEWER).

#### Get Visitors Inside Campus
```http
GET /state/visitors/inside
Authorization: Bearer <token>
```

#### Get Students Outside Campus
```http
GET /state/students/outside
Authorization: Bearer <token>
```

#### Get All Student Logs
```http
GET /state/logs/students
Authorization: Bearer <token>
```

Returns all student entry/exit records ordered by timestamp (newest first).

#### Get All Visitor Logs
```http
GET /state/logs/visitors
Authorization: Bearer <token>
```

Returns all visitor entry/exit records ordered by timestamp (newest first).

## Data Models

### Student Roll Number Format
- Pattern: `##XXX###` where # = digit, X = letter
- Example: `23BCS083`
- Length: Exactly 8 characters
- First 2 digits: 1-9 (year)
- Next 3 letters: Department code (case-insensitive)
- Next 2 digits: 0-9
- Last digit: 1-9

### Phone Number Format
- Indian mobile numbers only
- Must start with 6, 7, 8, or 9
- Exactly 10 digits
- Example: `9317403670`

### Vehicle Number Format
- Pattern: State(2 letters) + District(2 digits) + Code(1-2 letters) + Number(4 digits)
- Example: `HP12AB1234` or `DL8C1234`

## Business Rules

### Student Entry Rules
1. Cannot enter if already inside campus
2. If student has an exit permission:
   - Entry time is checked against `allowed_until`
   - Late entries are logged with violation code "LATE_ENTRY"
   - Exit permission is deleted after entry
3. If no exit permission exists, entry is allowed (first-time or new session)

### Student Exit Rules
1. Must specify purpose: "MARKET" or "HOME"
2. Must provide `return_by` datetime
3. MARKET exits:
   - Return time must be within 12 hours
   - Return time must be in the future
4. Exit creates an exit permission record
5. Student is marked as outside in campus state

### Visitor Rules
1. Can enter anytime with required information
2. Can exit anytime
3. Vehicle number is optional
4. Number of visitors must be specified (1-20)
5. On exit, visitor record is completely removed from campus state

## Installation & Setup

### Prerequisites
- Python 3.8+
- MongoDB (local or cloud instance)
- Conda or venv for virtual environment

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Rajat083/SecuritySystem
cd SecuritySystem
```

2. **Create and activate virtual environment:**
```bash
# Using Conda
conda create -n security_system python=3.11
conda activate security_system

# OR using venv
python -m venv venv
# Windows
venv\Scripts\activate
# Unix/macOS
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Environment Configuration:**

Create a `.env` file in the root directory:
```env
# JWT Configuration
JWT_SECRET=your-secret-key-change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=60

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=campus_security
```

5. **Initialize MongoDB:**

Make sure MongoDB is running on your system. The application will automatically create required collections and indexes on startup.

### Running the Application

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://127.0.0.1:8000`

### API Documentation
- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

### Initial Setup

1. **Create an admin user** (requires direct database access initially):
```python
# Run this script once to create the first admin user
from app.core.database.client import MongoClient
from app.core.database.collections import auth_users_collection
from app.core.passwords import hash_password
from datetime import datetime
import asyncio

async def create_admin():
    MongoClient.get_client()
    await auth_users_collection.insert_one({
        "username": "admin",
        "password_hash": hash_password("admin123"),
        "role": "ADMIN",
        "is_active": True,
        "created_at": datetime.utcnow(),
    })
    print("Admin user created successfully!")

asyncio.run(create_admin())
```

2. **Login as admin:**
```bash
curl -X POST "http://127.0.0.1:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123"
```

3. **Create guard users:**
```bash
curl -X POST "http://127.0.0.1:8000/admin/users" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "guard01",
    "password": "guard123",
    "role": "GUARD"
  }'
```

## Configuration

### Environment Variables

The application uses the following environment variables (defined in `.env`):

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT token signing | `dev-secret-change-later` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time in minutes | `60` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `DATABASE_NAME` | Database name | `campus_security` |

### MongoDB Configuration

Update the MongoDB connection in [app/core/database/client.py](app/core/database/client.py) if needed:
```python
client = AsyncIOMotorClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017"))
```

### Security Configuration

JWT settings are configured in [app/core/security.py](app/core/security.py):
- Algorithm: HS256
- Token expiration: 60 minutes (configurable)
- Secret key: Loaded from environment variable

**⚠️ IMPORTANT:** Change the `JWT_SECRET` in production to a strong, random secret key.

### Gate Configuration

Gates are numbered 1-10. Modify the validation in schemas if you need different gate numbers.

## Testing

### Example Test Flow

**Step 1: Login as guard**
```bash
curl -X POST "http://127.0.0.1:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=guard01&password=guard123"
```

**Step 2: Student exits campus**
```bash
curl -X POST "http://127.0.0.1:8000/student/exit" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "roll_number": "23BCS083",
    "purpose": "MARKET",
    "return_by": "2025-12-18T14:00:00",
    "gate_number": 1
  }'
```

**Step 3: Student returns on time**
```bash
curl -X POST "http://127.0.0.1:8000/student/entry" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "roll_number": "23BCS083",
    "gate_number": 1
  }'
# Response: entered_successfully
```

**Step 4: Check student logs**
```bash
curl -X GET "http://127.0.0.1:8000/state/logs/students" \
  -H "Authorization: Bearer <token>"
```

### Using Swagger UI

The easiest way to test the API is through the Swagger UI at `http://127.0.0.1:8000/docs`:

1. Click on the **Authorize** button (🔒 icon)
2. Login using the `/auth/login` endpoint to get your token
3. Enter your token in the format: `Bearer <your_token>`
4. Click **Authorize**
5. Now you can test all endpoints with authentication

## Error Handling

The system provides clear error messages for different scenarios:

### HTTP Status Codes
- **200 OK**: Successful operation
- **201 Created**: Resource created successfully (user creation)
- **400 Bad Request**: Business rule violations (e.g., return time > 12 hours, duplicate username)
- **401 Unauthorized**: Invalid or missing authentication token
- **403 Forbidden**: Insufficient permissions for the operation
- **422 Unprocessable Entity**: Validation errors (invalid data format)

### Common Error Responses

**Authentication Error:**
```json
{
  "detail": "Invalid or expired token"
}
```

**Authorization Error:**
```json
{
  "detail": "Operation not permitted"
}
```

**Validation Error:**
```json
{
  "detail": [
    {
      "loc": ["body", "roll_number"],
      "msg": "string does not match regex \"^[1-9][0-9][A-Za-z]{3}[0-9]{2}[1-9]$\"",
      "type": "value_error"
    }
  ]
}
```

**Business Logic Error:**
```json
{
  "status": "entry_denied",
  "message": "Student 23BCS083 is already inside campus"
}
```

## Security Features

### Authentication
- **JWT-based authentication** with secure token generation
- **OAuth2 Password Bearer** flow for industry-standard authentication
- **Token expiration** to limit session lifetime
- **Secure password hashing** using bcrypt algorithm

### Authorization
- **Role-Based Access Control (RBAC)** with three distinct roles
- **Endpoint-level protection** using dependency injection
- **Automatic token validation** on protected routes

### Data Protection
- **Password hashing** with bcrypt (never store plain text passwords)
- **Token signing** with HS256 algorithm
- **Environment-based secrets** for production security

### Best Practices
- Never commit `.env` file to version control
- Use strong, random `JWT_SECRET` in production
- Regularly rotate JWT secrets
- Implement HTTPS in production
- Use MongoDB authentication in production
- Set appropriate token expiration times

## Future Enhancements

- [ ] Staff member access management
- [ ] Real-time dashboard for security personnel
- [ ] QR code-based entry/exit
- [ ] SMS notifications for late entries
- [ ] Analytics and reporting dashboard
- [ ] Face recognition integration
- [ ] Multiple campus support
- [ ] Emergency evacuation tracking
- [ ] Refresh token implementation
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] Audit logging for all admin actions
- [ ] Rate limiting and API throttling
- [ ] WebSocket support for real-time updates

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is created for educational purposes.

## Contact

**Developer:** Rajat Sharma  
**Repository:** [Rajat083/SecuritySystem](https://github.com/Rajat083/SecuritySystem)

## Acknowledgments

- FastAPI for the excellent web framework
- MongoDB for the flexible database solution
- Pydantic for data validation
- python-jose for JWT implementation

---

**Note:** This is a campus security management system designed for tracking student and visitor access. Ensure proper testing and security measures before deploying to production.


