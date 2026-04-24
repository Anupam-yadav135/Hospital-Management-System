# 📊 MediFlow Database Schema (ER Diagram)

This diagram represents the logical structure of the **MediFlow** Hospital Management System, illustrating how users, clinical staff, and administrative records are interconnected.

```mermaid
erDiagram
    USER ||--|| PATIENT : "identifies as"
    USER ||--|| DOCTOR : "identifies as"
    
    PATIENT ||--o{ APPOINTMENT : "books"
    DOCTOR ||--o{ APPOINTMENT : "attends"
    
    PATIENT ||--o{ BILL : "receives"
    APPOINTMENT ||--|| BILL : "generates"
    
    PATIENT ||--o{ MEDICAL_RECORD : "has history of"
    DOCTOR ||--o{ MEDICAL_RECORD : "authors"
    APPOINTMENT ||--|| MEDICAL_RECORD : "results in"

    USER {
        int user_id PK
        string name
        string email
        string password
        enum role
    }

    PATIENT {
        int patient_id PK
        int user_id FK
        string name
        int age
        string gender
        string phone
        text address
    }

    DOCTOR {
        int doctor_id PK
        int user_id FK
        string name
        string specialization
        string phone
    }

    APPOINTMENT {
        int appointment_id PK
        int patient_id FK
        int doctor_id FK
        date appointment_date
        time appointment_time
        string status
    }

    ROOM {
        int room_id PK
        string room_number
        string room_type
        string status
    }

    BILL {
        int bill_id PK
        int patient_id FK
        int appointment_id FK
        decimal total_amount
        string payment_status
        timestamp created_at
    }

    MEDICAL_RECORD {
        int record_id PK
        int patient_id FK the 
        int doctor_id FK
        int appointment_id FK
        text diagnosis
        text prescription
        text notes
        timestamp created_at
    }
```

---

### **Relationship Highlights**
1.  **Core Identity**: Every **Patient** and **Doctor** is linked to a unique **User** account, which handles authentication and role management.
2.  **The Clinical Loop**: An **Appointment** acts as the central event. Once completed, it triggers the creation of both a **Medical Record** (for health tracking) and a **Bill** (for financial tracking).
3.  **Resource Management**: **Rooms** are independent entities used by the Admin to track hospital capacity and occupancy status.
