# Patient Vitals Dashboard

A full-stack medical dashboard for tracking patient vital signs (Heart Rate, SpO₂, Temperature) with real-time monitoring and historical tracking.

## Features

- ✅ **Patient Management**: Add, view, and delete patients
- ✅ **Vitals Tracking**: Record and monitor vital signs with color-coded indicators
- ✅ **Visual Alerts**: Green (Safe), Orange (Warning), Red (Danger) status indicators
- ✅ **Historical Data**: View complete vitals history for each patient
- ✅ **Modern UI**: Professional medical dashboard with sidebar navigation
- ✅ **Real-time Updates**: Instant UI updates without page refresh

## Tech Stack

**Frontend:**
- React 18
- Vite
- Vanilla CSS

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB Atlas Account** (Free tier) - [Sign up here](https://www.mongodb.com/cloud/atlas/register)
   - OR local MongoDB installation

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd patient-vitals-dashboard
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Copy the following content to backend/.env
```

**Create `backend/.env` file:**
```env
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/patient-vitals?retryWrites=true&w=majority
```

> **Important:** Replace `your-username` and `your-password` with your MongoDB Atlas credentials

**How to get MongoDB URI:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (free tier M0)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

## Running the Application

You need **two terminal windows** - one for backend, one for frontend.

### Terminal 1: Start Backend Server

```bash
cd backend
node server.js
```

You should see:
```
Server running on port 5000
MongoDB connected
```

### Terminal 2: Start Frontend Dev Server

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### 4. Open the Application

Open your browser and navigate to: **http://localhost:5173**

## Project Structure

```
patient-vitals-dashboard/
├── backend/
│   ├── models/
│   │   ├── Patient.js       # Patient schema
│   │   └── vitals.js        # Vitals schema
│   ├── routes/
│   │   ├── patientRoutes.js # Patient CRUD operations
│   │   └── vitalRoutes.js   # Vitals CRUD operations
│   ├── .env                 # Environment variables (create this)
│   ├── server.js            # Express server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AddPatientModal.jsx
    │   │   ├── AddVitalsModal.jsx
    │   │   ├── PatientAccordion.jsx
    │   │   ├── PatientHistoryModal.jsx
    │   │   ├── SearchBar.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── Layout.jsx
    │   │   └── VitalCard.jsx
    │   ├── App.jsx           # Main app component
    │   ├── index.css         # Global styles
    │   └── main.jsx
    └── package.json
```

## Usage Guide

### Adding a Patient
1. Click **"+ Add New"** button
2. Enter patient name and initial vitals
3. Click **"Add Patient & Vitals"**

### Updating Vitals
1. Find the patient card
2. Click **"+ Update"** button
3. Enter new vital signs
4. Click **"Save Vitals"**

### Viewing History
1. Click **"History"** button on patient card
2. View all recorded vitals with timestamps
3. Color-coded abnormal values (red) for easy identification

### Deleting a Patient
1. Click **"Delete"** button on patient card
2. Confirm deletion (⚠️ This also deletes all vitals history)

## API Endpoints

### Patients
- `GET /api/patients` - Get all patients with latest vitals
- `POST /api/patients` - Add new patient
- `DELETE /api/patients/:patientId` - Delete patient and all vitals

### Vitals
- `POST /api/vitals` - Add vital signs
- `GET /api/vitals/latest/:patientId` - Get latest vital for patient
- `GET /api/vitals/history/:patientId` - Get all vitals for patient

## Vital Signs Reference Ranges

| Vital | Safe (Green) | Warning (Orange) | Danger (Red) |
|-------|--------------|------------------|--------------|
| Heart Rate | 60-100 bpm | 50-59 or 101-110 bpm | <50 or >110 bpm |
| SpO₂ | ≥95% | 90-94% | <90% |
| Temperature | 36.1-37.2°C | 35.5-36.0 or 37.3-38.0°C | <35.5 or >38.0°C |

## Troubleshooting

### Backend won't start
- **Error: "MongoDB connection error"**
  - Check your `MONGO_URI` in `.env`
  - Verify MongoDB Atlas IP whitelist (add `0.0.0.0/0` for allowing all IPs during development)
  - Ensure database user credentials are correct

### Frontend won't start
- **Port already in use**
  - Kill the process using port 5173: `npx kill-port 5173`
  - Or change port in `vite.config.js`

### No data showing
- Open browser console (F12) and check for errors
- Check backend terminal for error logs
- Verify backend is running on port 5000

### History not showing
- Open browser console and check for error messages
- Check backend terminal logs for "Fetching history for patientId"
- Ensure patient has multiple vitals entries

## Dependencies

### Backend
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
```

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "vite": "^5.0.0"
}
```

## License

MIT

## Support

For issues or questions, please check the console logs (browser F12 and backend terminal) for detailed error messages.