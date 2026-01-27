# Campus Security System

A comprehensive campus access control system designed to manage student and visitor entry/exit tracking with role-based access control, policy enforcement, and real-time monitoring. The system provides administrators, security guards, and viewers with tools to maintain campus security while tracking access violations.

## Project Overview

The Campus Security System is a full-stack application comprising a Python FastAPI backend and a React frontend. It implements a campus gate management solution that enforces entry/exit policies, tracks access logs, and maintains real-time campus occupancy state.

## Technology Stack

### Backend
- **Framework**: FastAPI 0.124.4
- **Database**: MongoDB (via Motor async driver)
- **Authentication**: JWT (JSON Web Tokens) with OAuth2 password flow
- **Password Security**: bcrypt hashing
- **Async Runtime**: Python async/await with uvicorn

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.0.5
- **Styling**: Tailwind CSS 3.4.0
- **State Management**: Zustand 4.4.7
- **Data Fetching**: TanStack React Query 5.15.0
- **Form Management**: React Hook Form 7.49.2
- **Form Validation**: Zod 3.22.4
- **Routing**: React Router DOM 6.21.0
- **Charts**: Recharts 2.10.3
- **Icons**: Lucide React 0.303.0

## Key Features

### Authentication & Authorization
- **JWT-Based Authentication**: Secure token-based user authentication with 60-minute token lifetime
- **Role-Based Access Control**: Three-tier permission system
  - ADMIN: Full system access including user management
  - GUARD: Entry/exit recording capabilities
  - VIEWER: Read-only access to logs and campus state
- **Secure Password Management**: Bcrypt hashing with salt
- **OAuth2 Compliance**: Standard password bearer token flow

### Access Management

#### Student Management
- Entry and exit tracking with timestamp recording
- Gate location recording (gates 1-10)
- Late entry violation detection and logging
- Purpose-based exit classification:
  - MARKET: Time-limited exit (e.g., 2-4 hours)
  - HOME: Unrestricted exit
- Duplicate entry prevention (prevents re-entry if already inside)
- Real-time campus state tracking

#### Visitor Management
- Visitor registration with personal and vehicle information
- Entry and exit recording
- Visitor-specific access policies
- Comprehensive visitor database

### Campus State Control
- Dynamic campus state management with four operational modes:
  - OPEN: Normal operations
  - CLOSED: No entries/exits allowed
  - RESTRICTED: Limited access only
  - EMERGENCY: Security lockdown mode
- Real-time state synchronization across the system
- State-based policy enforcement

### Monitoring & Logging
- Real-time access log monitoring dashboard
- Comprehensive log search and filtering capabilities
- Analytics dashboard with statistical insights
- Violation tracking and reporting
- Separate logging systems for students and visitors
- Exportable access records

## Architecture Principles

### SOLID Design Patterns
- **Single Responsibility**: Each service handles one business concern
- **Open/Closed Principle**: Abstract base classes for extensibility
- **Liskov Substitution**: Polymorphic user and policy implementations
- **Interface Segregation**: Minimal, focused dependencies between components
- **Dependency Inversion**: Services depend on abstractions, not concrete implementations

### Pattern Implementation
- **Policy Pattern**: Separate entry/exit validation logic from core business logic
- **Strategy Pattern**: Different policies for students vs. visitors
- **Service Layer**: Isolated services for entry, exit, logging, and state management
- **Repository Pattern**: Database abstraction through MongoDB collections
- **Middleware Pattern**: CORS and request/response processing

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18.0.0+
- MongoDB instance (local or cloud)
- npm, yarn, or pnpm

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure MongoDB connection in your environment or database client

5. Run the development server:
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Default Credentials

For testing purposes:
- Email: `admin@example.com`
- Password: `password123`

## API Endpoints

### Authentication
- `POST /login` - User login, returns JWT token
- `POST /logout` - User logout

### Admin Routes
- `POST /admin/users` - Create new user (admin only)
- `GET /admin/users` - List all users (admin only)
- `PUT /admin/users/{user_id}` - Update user (admin only)

### Student Routes
- `POST /student/entry` - Record student entry
- `POST /student/exit` - Record student exit
- `GET /student/logs` - Get student access logs
- `GET /student/state` - Get current campus state

### Visitor Routes
- `POST /visitor/entry` - Record visitor entry
- `POST /visitor/exit` - Record visitor exit
- `GET /visitor/logs` - Get visitor access logs

### Campus State Routes
- `GET /state/current` - Get current campus state
- `PUT /state/update` - Update campus state (admin only)
- `GET /state/history` - Get state change history

## Database Schema

### Collections

#### users
- User accounts with authentication credentials
- Fields: email, password_hash, role, created_at, updated_at

#### student_access_logs
- Student entry/exit records
- Fields: student_id, entry_time, exit_time, gate, purpose, timestamp

#### visitor_access_logs
- Visitor entry/exit records
- Fields: visitor_id, entry_time, exit_time, vehicle_info, timestamp

#### campus_state
- Current and historical campus operational state
- Fields: state (OPEN, CLOSED, RESTRICTED, EMERGENCY), changed_at, changed_by

#### exit_permissions
- Time-bound exit permissions for students
- Fields: student_id, permission_type, valid_until, created_at

## Environment Configuration

Backend environment variables required:
```
MONGODB_URL=mongodb://...
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
TOKEN_EXPIRE_MINUTES=60
```

## Development Guidelines

### Code Style
- Follow PEP 8 for Python code
- Use type hints in Python functions
- Follow ESLint configuration for JavaScript/React
- Maintain consistent naming conventions

### Testing
- Unit tests for service layer logic
- Integration tests for API endpoints
- Frontend component testing recommendations

### Git Workflow
- Create feature branches for new functionality
- Commit messages should be descriptive
- Maintain clean commit history

## Deployment

### Backend
- Containerized deployment ready (Docker configuration available)
- Compatible with cloud platforms (AWS, Azure, Google Cloud)
- Environment-based configuration

### Frontend
- Deployed on Vercel (current production)
- Automatic deployments from main branch
- Static site generation for optimal performance

## Security Considerations

- JWT tokens with 60-minute expiration
- Bcrypt password hashing with salt
- CORS configuration for cross-origin requests
- Role-based access control on all protected endpoints
- Database indexes for query optimization
- Input validation via Zod schemas

## Monitoring & Logging

- Comprehensive access logging for audit trails
- Real-time dashboard for campus monitoring
- Violation tracking and alerting
- Analytics for access patterns

## Future Enhancements

- Mobile application for guard operations
- Biometric integration for enhanced security
- Advanced analytics and reporting
- Automated notification system for violations
- Time-based access restrictions
- Vehicle tracking integration
- Multi-campus support

## Support & Documentation

For detailed backend documentation, see [backend/README.md](backend/README.md)
For detailed frontend documentation, see [frontend/README.md](frontend/README.md)

## License

This project is proprietary and confidential.

## Contact

For inquiries or support, contact the development team.
