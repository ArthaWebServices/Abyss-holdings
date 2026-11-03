# Abyss Holdings — Full-Stack Website

A complete corporate website for **Abyss Holdings Group of Companies** built with:
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Backend**: Express.js REST API
- **Database**: JSON file-based (zero setup required)
- **Admin Panel**: Full CRUD management dashboard

---

## 🚀 Quick Start

### Option 1 — One-Click (Windows)
Double-click `start.bat`

### Option 2 — Manual

**Backend:**
```bash
cd backend
npm install
npm run dev      # runs on http://localhost:5000
```

**Frontend (new terminal):**
```bash
cd frontend
npm install
npm run dev      # runs on http://localhost:3000
```

---

## 🔐 Admin Panel

| URL | http://localhost:3000/admin |
|-----|-----------------------------|
| Username | `admin` |
| Password | `admin123` |

Change credentials in `backend/.env`:
```
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_password
```

---

## 📋 Admin Features

| Page | What you can do |
|------|----------------|
| **Dashboard** | Overview stats, quick actions |
| **Services** | Add / Edit / Delete / Toggle visibility of services |
| **Locations** | Manage global office locations, set headquarters |
| **Projects** | Portfolio management with categories & status |
| **Messages** | View contact form submissions, mark read, reply |
| **Settings** | Company name, tagline, colors, contact info, social links |

---

## 🌐 Public Pages

| Route | Page |
|-------|------|
| `/` | Home — Hero + services preview + stats |
| `/about` | About Us — Story, values, stats |
| `/services` | All services with scrollable cards |
| `/projects` | Project portfolio grid |
| `/contact` | Contact form + office info |
| `/locations` | All global office locations |

---

## 🏗 Project Structure

```
abyss-holdings/
├── backend/
│   ├── src/
│   │   ├── index.js          # Express server
│   │   ├── data/db.json      # JSON database
│   │   ├── routes/           # API routes
│   │   ├── middleware/auth.js # JWT auth
│   │   └── utils/db.js       # DB read/write helpers
│   └── .env                  # Config
│
├── frontend/
│   ├── app/                  # Next.js App Router pages
│   │   ├── page.tsx          # Home
│   │   ├── about/            # About Us
│   │   ├── services/         # Services
│   │   ├── projects/         # Projects
│   │   ├── contact/          # Contact
│   │   ├── locations/        # Locations
│   │   └── admin/            # Admin panel
│   ├── components/           # Reusable UI components
│   ├── lib/api.ts            # API client
│   └── types/index.ts        # TypeScript types
│
└── start.bat                 # Windows one-click starter
```

---

## 🎨 Design

- **Primary Color**: `#E84545` (red — customizable from admin)
- **Dark Color**: `#1a1a2e`
- **Font**: Inter (sans) + Georgia (serif for italic headings)
- **Layout**: Right-side fixed navigation (matching original design)
- **Cards**: Rounded corners, hover animations, image + text layout

---

## 🔧 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/company` | Company info |
| GET | `/api/services` | Active services |
| GET | `/api/locations` | All locations |
| GET | `/api/projects` | All projects |
| POST | `/api/contact` | Submit contact form |

### Admin (requires Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Get JWT token |
| GET | `/api/services/all` | All services incl. hidden |
| POST/PUT/DELETE | `/api/services/:id` | Manage services |
| POST/PUT/DELETE | `/api/locations/:id` | Manage locations |
| POST/PUT/DELETE | `/api/projects/:id` | Manage projects |
| PUT | `/api/company` | Update company settings |
| GET | `/api/contact/messages` | View messages |
| DELETE | `/api/contact/messages/:id` | Delete message |

