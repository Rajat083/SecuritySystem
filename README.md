# Campus Security System

A FastAPI-based security management system for campus gate entry and exit tracking. The system manages student and visitor access control with policy enforcement, late entry violations, and comprehensive logging.

## Features

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
│   │   ├── student_routes.py      # Student entry/exit endpoints
│   │   ├── visitor_routes.py      # Visitor entry/exit endpoints
│   │   └── state_routes.py        # Campus state & logs endpoints
│   ├── core/                      # Core configurations
│   │   ├── enums.py               # Enum definitions
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
│   │   ├── access_log.py          # Access log model
│   │   ├── campus_state.py        # Campus state model
│   │   └── exit_permission.py     # Exit permission model
│   ├── schemas/                   # Request/Response schemas
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
└── README.md
```

## Database Collections

### MongoDB Collections
- **student_logs**: All student entry/exit records
- **visitor_logs**: All visitor entry/exit records
- **access_logs**: Combined log of all access events
- **campus_state**: Current inside/outside status of all users
- **exit_permissions**: Active exit permissions with return times
- **visitors**: Visitor registration details

## API Endpoints

### Student Endpoints

#### Student Entry
```http
POST /student/entry
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
```http
POST /student/exit
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

#### Visitor Entry
```http
POST /visitor/entry
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
```http
POST /visitor/exit/{visitor_id}?gate_number=2
```

**Response:**
```json
{
  "status": "exited"
}
```

### State & Logs Endpoints

#### Get Visitors Inside Campus
```http
GET /state/visitors/inside
```

#### Get Students Outside Campus
```http
GET /state/students/outside
```

#### Get All Student Logs
```http
GET /state/logs/students
```

Returns all student entry/exit records ordered by timestamp (newest first).

#### Get All Visitor Logs
```http
GET /state/logs/visitors
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
- MongoDB
- FastAPI
- Motor (async MongoDB driver)

### Installation
```bash
# Clone the repository
cd SecuritySystem

# Activate virtual environment
conda activate your_env_name

# Install dependencies
pip install fastapi motor pydantic uvicorn

# Configure MongoDB connection
# Update connection string in app/core/database/client.py
```

### Running the Application
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://127.0.0.1:8000`

### API Documentation
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Configuration

### MongoDB Configuration
Update the MongoDB connection string in `app/core/database/client.py`:
```python
client = AsyncIOMotorClient("mongodb://localhost:27017")
```

### Gate Configuration
Gates are numbered 1-10. Modify the range in schemas if you need different gate numbers.

## Testing

### Example Test Flow

1. **Student exits campus:**
```bash
POST /student/exit
{
  "roll_number": "23BCS083",
  "purpose": "MARKET",
  "return_by": "2025-12-18T14:00:00",
  "gate_number": 1
}
```

2. **Student returns on time:**
```bash
POST /student/entry
{
  "roll_number": "23BCS083",
  "gate_number": 1
}
# Response: entered_successfully
```

3. **Check student logs:**
```bash
GET /state/logs/students
```

## Error Handling

The system provides clear error messages:
- **422 Unprocessable Entity**: Validation errors (invalid format)
- **400 Bad Request**: Business rule violations (e.g., return time > 12 hours)
- **Entry Denied**: Custom response when student already inside

## Future Enhancements

- [ ] Staff member access management
- [ ] Real-time dashboard for security personnel
- [ ] QR code-based entry/exit
- [ ] SMS notifications for late entries
- [ ] Analytics and reporting dashboard
- [ ] Face recognition integration
- [ ] Multiple campus support
- [ ] Emergency evacuation tracking

## License

This project is part of a campus security management system.

## Contact

For questions or support, contact the development team.
