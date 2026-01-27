# Campus Security System - Frontend

A production-grade React frontend application for managing campus security and access control, built with modern best practices and enterprise-ready architecture.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Default Login
- **Email**: `admin@example.com`
- **Password**: `password123`

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎯 Features

### Core Functionality
- **Authentication & Authorization**: JWT-based secure login with protected routes
- **Student Management**: Entry/Exit tracking with validation
- **Visitor Management**: Registration, approval workflows, time-based access
- **Access Logs**: Real-time monitoring with search and export capabilities
- **Campus State Control**: Dynamic state management (Open/Closed/Restricted/Emergency)
- **Analytics Dashboard**: Visual insights with real-time statistics
- **Real-time Updates**: TanStack Query for efficient data fetching and caching

### UI/UX Excellence
- **Modern Design**: Custom components following shadcn/ui patterns
- **Dark Mode**: Full dark mode with system preference detection
- **Responsive**: Mobile-first design with Tailwind CSS
- **Animations**: Smooth transitions for better UX
- **Notifications**: Toast notifications with Sonner
- **Loading States**: Comprehensive loading and error handling
- **Accessible**: WCAG 2.1 compliant with keyboard navigation

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI (Button, Card, Input, Modal, Table, etc.)
│   ├── layout/         # Layout components (Sidebar, Navbar, DashboardLayout)
│   ├── ProtectedRoute.jsx
│   └── ErrorBoundary.jsx
├── pages/              # Page components
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── StudentEntryPage.jsx
│   ├── StudentExitPage.jsx
│   ├── VisitorEntryPage.jsx
│   ├── VisitorExitPage.jsx
│   ├── AccessLogsPage.jsx
│   └── CampusStatePage.jsx
├── services/           # API service layer
│   ├── api.js          # Axios configuration
│   └── index.js        # API endpoints
├── store/              # Zustand state management
│   ├── authStore.js
│   ├── uiStore.js
│   └── campusStore.js
├── hooks/              # Custom React hooks
│   ├── useApi.js
│   └── useUtils.js
├── utils/              # Utility functions
│   ├── cn.js           # Class name merger
│   ├── formatters.js   # Data formatting
│   └── validators.js   # Zod validation schemas
├── constants/          # Application constants
│   └── index.js
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🛠️ Technology Stack

### Core
- **React 19**: Latest with concurrent features
- **Vite 7**: Ultra-fast build tool
- **React Router v6**: Client-side routing

### State & Data
- **Zustand**: Lightweight state management
- **TanStack Query**: Server state with caching
- **Axios**: HTTP client with interceptors

### Forms & Validation
- **React Hook Form**: Performant forms
- **Zod**: Schema validation
- **@hookform/resolvers**: Integration layer

### UI & Styling
- **Tailwind CSS 3**: Utility-first CSS
- **Lucide React**: Icon library
- **Sonner**: Toast notifications
- **date-fns**: Date utilities

### Charts
- **Recharts**: Composable charts

## 🔐 Authentication

JWT-based authentication with:
- Token stored in localStorage
- Automatic token injection in requests
- Auto-redirect on 401 responses
- Protected route guards

## 📊 Backend Integration

### API Endpoints

**State Routes** (`/state`)
- `GET /state/visitors/inside` - Visitors currently inside
- `GET /state/students/outside` - Students currently outside
- `GET /state/logs/students` - Student access logs
- `GET /state/logs/visitors` - Visitor access logs

**Student Routes** (`/student`)
- `POST /student/entry` - Record student entry
- `POST /student/exit` - Record student exit

**Visitor Routes** (`/visitor`)
- `POST /visitor/entry` - Record visitor entry
- `POST /visitor/exit/{visitor_id}` - Record visitor exit

**Auth Routes**
- `POST /auth/login` - User authentication

### Data Models

**Student Entry**
```javascript
{
  roll_number: "21BCS123",  // Pattern: 21BCS123
  name: "string",
  phone_number: "9876543210",  // 10 digits, starts with 6-9
  gate_number: 1  // 1-10
}
```

**Student Exit**
```javascript
{
  roll_number: "21BCS123",
  name: "string",
  phone_number: "9876543210",
  purpose: "MEDICAL" | "PERSONAL" | "OFFICIAL" | "OTHER",
  return_by: "2024-01-01T10:00:00",  // Optional
  gate_number: 1
}
```

**Visitor Entry**
```javascript
{
  name: "string",
  phone_number: "9876543210",
  number_of_visitors: 2,  // 1-20
  vehicle_number: "HP12AB1234",  // Optional, pattern: HP12AB1234
  gate_number: 1
}
```

**Campus State**
```javascript
{
  user_type: "student" | "visitor",
  identifier: "string",  // Roll number or visitor_id
  user_name: "string",
  phone_number: "string",
  number_of_visitors: 2,
  is_inside: true,
  last_entry_time: "2024-01-01T10:00:00",
  last_exit_time: "2024-01-01T18:00:00"
}
```

**Access Log**
```javascript
{
  person_type: "student" | "visitor",
  person_id: "string",  // Roll number or visitor_id
  direction: "IN" | "OUT",
  purpose: "MEDICAL" | "PERSONAL" | "OFFICIAL" | "OTHER",
  timestamp: "2024-01-01T10:00:00"
}
```

## 🎨 Component Usage

### Button
```jsx
import { Button } from './components/ui';

<Button variant="default" size="lg" isLoading={loading}>
  Click me
</Button>
```

Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`

### Card
```jsx
import { Card, CardHeader, CardTitle, CardContent } from './components/ui';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

### Form with Validation
```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentEntrySchema } from './utils/validators';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(studentEntrySchema)
});
```

## ⚙️ Configuration

### Environment Variables
Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Campus Security System
VITE_ENABLE_DEVTOOLS=true
```

### Theme Customization
Edit `tailwind.config.js` and `src/index.css`:
```js
theme: {
  extend: {
    colors: {
      primary: "hsl(221.2 83.2% 53.3%)",
    }
  }
}
```

### Dark Mode
```jsx
import { useUIStore } from './store';

const { theme, toggleTheme } = useUIStore();
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

## 🔒 Security Features

- JWT token authentication
- XSS prevention
- CSRF protection
- Input sanitization
- Secure token storage
- Protected routes
- Role-based access (ready)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

Output in `dist/` folder

### Deploy to
- **Vercel**: Zero-config deployment
- **Netlify**: Drag-and-drop or Git integration
- **Azure Static Web Apps**: Integrated with backend
- **AWS Amplify**: Full-stack deployment
- **GitHub Pages**: Free static hosting

### Production Environment
Set these variables in your hosting platform:
```env
VITE_API_BASE_URL=https://your-api.com](https://securitysystem-9b2y.onrender.com
VITE_APP_NAME=Campus Security System
VITE_ENABLE_DEVTOOLS=false
```

## 🐛 Troubleshooting

### Port Already in Use
```js
// vite.config.js
export default defineConfig({
  server: { port: 3000 }
})
```

### API Connection Issues
1. Check `.env` has correct API URL
2. Ensure backend is running
3. Verify CORS settings
4. Check network connectivity

### Installation Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📈 Performance

- Initial load: ~200KB (gzipped)
- Code splitting by route
- React Query caching (5-min stale time)
- Optimized re-renders
- Lazy loading components
- Tree shaking enabled

## 🧪 Testing (Ready)

Structure supports:
- **Unit tests**: Component rendering, hooks, utilities
- **Integration tests**: API integration, forms, auth flow
- **E2E tests**: User workflows, critical paths

## 📚 Documentation

- Component patterns in `src/components/ui/`
- State management in `src/store/`
- API integration in `src/services/`
- Form validation in `src/utils/validators.js`
- Custom hooks in `src/hooks/`

## 🤝 Contributing

1. Follow existing code structure
2. Use ESLint and Prettier
3. Write meaningful commits
4. Add JSDoc comments
5. Test responsive design
6. Ensure accessibility

## 📝 License

MIT License

## 👥 Support

For issues and questions, create an issue in the repository.

---

**Built with ❤️ using modern React best practices**
