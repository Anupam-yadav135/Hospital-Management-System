"use strict";

const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "../.env" });

const seed = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log("Connected to database. Starting Indian Localization Reset...");

  try {
    // 1. Disable FK checks and truncate
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");
    const tables = ["bill", "medicalrecord", "appointment", "doctor", "patient", "user", "room"];
    for (const table of tables) {
      await connection.query(`TRUNCATE TABLE ${table}`);
      console.log(`Truncated ${table}`);
    }
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");

    const hashedPassword = await bcrypt.hash("pass123", 10);

    // 2. Create Admin
    await connection.query(
      "INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)",
      ["Chief Administrator", "admin@mediflow.com", hashedPassword, "admin"]
    );
    console.log("Admin created.");

    // 3. Create Doctors (Indian Names)
    const doctorsData = [
      { name: "Dr. Ananya Sharma", email: "ananya.s@mediflow.com", spec: "Cardiology", phone: "+91 98765-01001" },
      { name: "Dr. Rajesh Iyer", email: "rajesh.i@mediflow.com", spec: "Neurology", phone: "+91 98765-01002" },
      { name: "Dr. Vikram Malhotra", email: "v.malhotra@mediflow.com", spec: "Orthopedics", phone: "+91 98765-01003" },
      { name: "Dr. Sneha Patel", email: "sneha.p@mediflow.com", spec: "Pediatrics", phone: "+91 98765-01004" },
      { name: "Dr. Aditya Rao", email: "aditya.r@mediflow.com", spec: "Dermatology", phone: "+91 98765-01005" },
      { name: "Dr. Neha Gupta", email: "neha.g@mediflow.com", spec: "Gastroenterology", phone: "+91 98765-01006" },
      { name: "Dr. Sanjay Verma", email: "sanjay.v@mediflow.com", spec: "Oncology", phone: "+91 98765-01007" },
      { name: "Dr. Meera Deshmukh", email: "meera.d@mediflow.com", spec: "Psychiatry", phone: "+91 98765-01008" },
      { name: "Dr. Arjun Nair", email: "arjun.n@mediflow.com", spec: "Internal Medicine", phone: "+91 98765-01009" },
      { name: "Dr. Kavita Reddy", email: "kavita.r@mediflow.com", spec: "Radiology", phone: "+91 98765-01010" },
    ];

    const doctorIds = [];
    for (const d of doctorsData) {
      const [uRes] = await connection.query(
        "INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)",
        [d.name, d.email, hashedPassword, "doctor"]
      );
      const [dRes] = await connection.query(
        "INSERT INTO doctor (user_id, name, specialization, phone) VALUES (?, ?, ?, ?)",
        [uRes.insertId, d.name, d.spec, d.phone]
      );
      doctorIds.push(dRes.insertId);
    }
    console.log("10 Doctors created with Indian names.");

    // 4. Create Patients (Indian Names)
    const patientsData = [
      { name: "Anupam Yadav", email: "anupam.y@gmail.com", age: 32, gender: "Male", phone: "+91 91234-56789", addr: "G-Block, Palam Vihar, Gurgaon" },
      { name: "Priya Singh", email: "priya.s@outlook.com", age: 27, gender: "Female", phone: "+91 91234-56790", addr: "Flat 402, Skyline Apts, Powai, Mumbai" },
      { name: "Rohan Kapoor", email: "rohan.k@gmail.com", age: 45, gender: "Male", phone: "+91 91234-56791", addr: "Sector 15, Chandigarh" },
      { name: "Sunita Reddy", email: "sunita.r@gmail.com", age: 58, gender: "Female", phone: "+91 91234-56792", addr: "Banjara Hills, Hyderabad" },
      { name: "Amitabh Banerjee", email: "amit.b@proton.me", age: 65, gender: "Male", phone: "+91 91234-56793", addr: "Salt Lake City, Kolkata" },
    ];

    const patientIds = [];
    for (const p of patientsData) {
      const [uRes] = await connection.query(
        "INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)",
        [p.name, p.email, hashedPassword, "patient"]
      );
      const [pRes] = await connection.query(
        "INSERT INTO patient (user_id, name, age, gender, phone, address) VALUES (?, ?, ?, ?, ?, ?)",
        [uRes.insertId, p.name, p.age, p.gender, p.phone, p.addr]
      );
      patientIds.push(pRes.insertId);
    }
    console.log("5 Patients created with Indian names.");

    // 5. Create Rooms
    const roomsData = [
      { num: "G-101", type: "General Ward", status: "Available" },
      { num: "G-102", type: "General Ward", status: "Occupied" },
      { num: "P-201", type: "Private Suite", status: "Occupied" },
      { num: "ICU-01", type: "Intensive Care Unit (ICU)", status: "Occupied" },
      { num: "OT-01", type: "Operating Theater", status: "Available" },
      { num: "P-202", type: "Private Suite", status: "Available" },
    ];

    const roomIds = [];
    for (const r of roomsData) {
      const [rRes] = await connection.query(
        "INSERT INTO room (room_number, room_type, status) VALUES (?, ?, ?)",
        [r.num, r.type, r.status]
      );
      roomIds.push(rRes.insertId);
    }
    console.log("6 Rooms created.");

    // 6. Create Multiple Records for Patients
    for(let i=0; i<patientIds.length; i++) {
        const pid = patientIds[i];
        const docId1 = doctorIds[i % 10];
        const docId2 = doctorIds[(i + 1) % 10];

        // 2 Appointments
        const [a1] = await connection.query(
            "INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)",
            [pid, docId1, "2026-04-25", "10:00:00", "Scheduled"]
        );
        const [a2] = await connection.query(
            "INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)",
            [pid, docId2, "2026-03-20", "14:30:00", "Completed"]
        );

        // 2 Medical Records
        await connection.query(
            "INSERT INTO medicalrecord (patient_id, doctor_id, appointment_id, diagnosis, prescription, notes) VALUES (?, ?, ?, ?, ?, ?)",
            [pid, docId2, a2.insertId, "Common Flu and seasonal allergies", "Paracetamol 500mg, Cetirizine", "Patient advised for 2 days rest and plenty of fluids."]
        );
        await connection.query(
            "INSERT INTO medicalrecord (patient_id, doctor_id, appointment_id, diagnosis, prescription, notes) VALUES (?, ?, ?, ?, ?, ?)",
            [pid, docId1, a1.insertId, "Routine Cardiac Screening", "Healthy lifestyle changes", "Blood pressure stable. ECG normal."]
        );

        // 2 Bills
        await connection.query(
            "INSERT INTO bill (patient_id, appointment_id, total_amount, payment_status) VALUES (?, ?, ?, ?)",
            [pid, a2.insertId, 1200.00, "Paid"]
        );
        await connection.query(
            "INSERT INTO bill (patient_id, appointment_id, total_amount, payment_status) VALUES (?, ?, ?, ?)",
            [pid, a1.insertId, 3500.00, "Pending"]
        );
    }

    console.log("Complex records generated for all patients.");
    console.log("Seeding complete successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await connection.end();
  }
};

seed();
