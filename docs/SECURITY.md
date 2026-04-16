# CuraMind AI Security Strategy

## Authentication
- Django Authentication System will be used.
- Passwords will be securely hashed using Django default hashing.

## Authorization
- Role Based Access Control (RBAC):
  - Patient: Can upload/view own records
  - Doctor: Can view assigned patient records
  - Admin: Can manage system/users

## File Upload Security
- Allowed file types: JPG, PNG, PDF, DICOM
- Max file size: 10MB
- Reject executable/malicious files

## Audit Logging
- Log user actions
- Log record modifications
- Store timestamp of every action

## Data Protection
- Sensitive medical data encrypted in database
- HTTPS required during deployment
