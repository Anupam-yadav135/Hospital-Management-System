# 🏥 MediFlow: Hospital Management System

**MediFlow** is a modern, full-stack hospital management platform designed with the **"Calm Precision"** UI aesthetic. It unifies clinical, administrative, and patient workflows into a single, high-performance ecosystem.

---

## 🚀 Key Project Features

Everything in MediFlow is built for role-based efficiency across three specialized portals:

### **1. Healthcare Portals & Security**
- **Three-Tier Access**: Distinct interfaces for **Admin**, **Doctor**, and **Patient** roles.
- **Smart Role Validation**: Automated system checks prevent unauthorized logins (e.g., stopping a patient from entering the doctor portal).
- **Secure Authentication**: Industrial-grade JWT session management and Bcrypt password hashing.

### **2. Clinical & Patient Management**
- **Patient Dashboard**: Real-time access to health trends, upcoming appointments, and clinical history.
- **Electronic Health Records (EHR)**: Doctors can create and manage detailed digital prescriptions and medical diagnoses.
- **Appointment Lifecycle**: Seamless scheduling, status tracking (Scheduled/Completed), and historical logs.

### **3. Hospital Logistics & Finance**
- **Ward Management**: Visual monitoring of hospital capacity (General, Private, ICU) with real-time status updates.
- **Financial Center**: Global billing overview with the ability to generate, void, and track invoices.
- **Indian Localization**: Full support for common Indian names, regional addresses, and **Rupee (₹)** currency integration.

---

## 🛠️ Performance Tech Stack

### **Frontend**
- **Framework**: React.js 18 + Vite
- **Styling**: Vanilla CSS Design System (Custom Tokens & Glassmorphism)
- **Icons**: Lucide React
- **Integration**: Axios for secure API communication

### **Backend**
- **Engine**: Node.js + Express
- **Database**: MySQL (Relational Schema)
- **Encryption**: Bcrypt + JWT
- **Logic**: Custom RBAC (Role-Based Access Control) middleware

---

## ⚙️ Quick Start

### **1. Backend Setup**
```bash
cd backend
npm install
# Set up your .env
npm start
```

### **2. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

---

**Built with Precision for Modern Healthcare.**
