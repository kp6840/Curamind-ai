# CuraMind AI - Security Strategy

## 1. Authentication

- JWT (JSON Web Token) based authentication is used.
- Users must login using username and password.
- Passwords are securely hashed using Django's default hashing system.

### Token Policy:
- Access Token Expiry: 60 minutes
- Refresh Token Expiry: 7 days
- Tokens must be sent in headers:
  Authorization: Bearer <access_token>

---

## 2. Authorization (RBAC - Role Based Access Control)

The system enforces strict role-based access:

### Roles:
- Patient:
  - Upload medical records
  - View own reports
  - Book appointments

- Doctor:
  - View assigned patient records
  - Add diagnosis

- Admin:
  - Manage users
  - Monitor system logs
  - Full system control

---

## 3. API Security

All APIs are protected and require authentication.

### Access Rules:

- POST /api/auth/register → Public
- POST /api/auth/login → Public

- POST /api/records/upload → Patient only
- GET /api/records/{id} → Owner or Doctor
- PUT /api/records/{id}/diagnosis → Doctor only

- POST /api/appointments/book → Patient only
- GET /api/appointments → Authenticated users

### Error Handling:
- 401 Unauthorized → Invalid or missing token
- 403 Forbidden → Access denied due to role restrictions

---

## 4. File Upload Security

To ensure safe medical data handling:

- Allowed file types: JPG, PNG, PDF, DICOM
- Maximum file size: 10MB
- Reject executable or malicious files
- Files are stored securely (not publicly accessible)

---

## 5. Data Protection

- All sensitive medical data is encrypted (in transit using HTTPS)
- Database credentials must not be hardcoded
- Use environment variables for secrets
- Patient data must not be exposed in logs

---

## 6. Threat Protection

- Rate limiting applied to login APIs
- Account lock after multiple failed login attempts
- Input validation to prevent:
  - SQL Injection
  - Cross-Site Scripting (XSS)

---

## 7. Audit Logging

System logs important actions for security monitoring:

- User login attempts
- File uploads
- Record access & modification
- Diagnosis updates

Each log includes:
- User ID
- Action performed
- Timestamp

---

## 8. Security Workflow

1. User sends login request
2. Credentials are verified
3. JWT token is generated
4. User accesses API with token
5. System validates:
   - Token authenticity
   - User role
6. Sensitive action is checked
7. Action is logged
8. Data is securely stored

---

## 9. Compliance (Basic)

- System follows basic principles of:
  - HIPAA (Healthcare data protection)
  - GDPR (User data privacy)

- Ensures:
  - Data confidentiality
  - Access control
  - Secure communication (HTTPS)

---

## Conclusion

CuraMind AI ensures secure handling of sensitive healthcare data by implementing authentication, authorization, secure APIs, and continuous monitoring.
