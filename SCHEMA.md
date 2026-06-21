# Curamind-AI Database Schema (Week 2)

### Models & Enhancements
- **Patient & Doctor**: Added created_at and updated_at timestamps.
- **Appointment**: 
  - Added db_index to appointment_date for faster searching.
  - Added clean() method to prevent booking in the past.
  - Changed doctor relation to SET_NULL to prevent data loss.
- **MedicalRecord**: Dynamic storage pathing by Patient ID and Year.
- **AuditLog**: Fully automated via Django Signals.

### Sample Data
- Fixture located at diagnostics/fixtures/sample_data.json.
