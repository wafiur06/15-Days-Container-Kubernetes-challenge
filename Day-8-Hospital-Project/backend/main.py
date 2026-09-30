from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import Optional
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:admin123@db:5432/hospital_db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    department = Column(String)

class Doctor(Base):
    __tablename__ = "doctors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    specialty = Column(String)
    phone = Column(String)
    status = Column(String, default="Active")
    available_days = Column(String, default="Mon-Fri")
    available_time = Column(String, default="10:00 AM - 05:00 PM")
    leave_date = Column(String, default="")
    return_date = Column(String, default="")

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String)
    doctor_name = Column(String)
    date_time = Column(String)
    status = Column(String, default="Pending")

Base.metadata.create_all(bind=engine)
app = FastAPI(title="Hospital Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class PatientCreate(BaseModel):
    name: str; age: int; department: str

class DoctorCreate(BaseModel):
    name: str; specialty: str; phone: str; status: str
    available_days: str; available_time: str
    leave_date: Optional[str] = ""
    return_date: Optional[str] = ""

class AppointmentCreate(BaseModel):
    patient_name: str; doctor_name: str; date_time: str; status: str

@app.post("/patients/")
def add_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    db_patient = Patient(**patient.dict()); db.add(db_patient); db.commit(); db.refresh(db_patient); return db_patient

@app.get("/patients/")
def get_patients(db: Session = Depends(get_db)):
    return db.query(Patient).all()

@app.post("/doctors/")
def add_doctor(doctor: DoctorCreate, db: Session = Depends(get_db)):
    db_doc = Doctor(**doctor.dict()); db.add(db_doc); db.commit(); db.refresh(db_doc); return db_doc

@app.get("/doctors/")
def get_doctors(db: Session = Depends(get_db)):
    return db.query(Doctor).all()

@app.put("/doctors/{doc_id}")
def update_doctor(doc_id: int, doctor_update: DoctorCreate, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == doc_id).first()
    if doctor:
        doctor.name = doctor_update.name
        doctor.specialty = doctor_update.specialty
        doctor.phone = doctor_update.phone
        doctor.status = doctor_update.status
        doctor.available_days = doctor_update.available_days
        doctor.available_time = doctor_update.available_time
        doctor.leave_date = doctor_update.leave_date
        doctor.return_date = doctor_update.return_date
        db.commit()
        db.refresh(doctor)
    return doctor

@app.put("/doctors/{doc_id}/status")
def update_doctor_status(doc_id: int, status: str, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == doc_id).first()
    if doctor:
        doctor.status = status
        # Reset leave dates if toggled back to Active
        if status == 'Active':
            doctor.leave_date = ""
            doctor.return_date = ""
        db.commit()
        db.refresh(doctor)
    return doctor

@app.post("/appointments/")
def add_appointment(appt: AppointmentCreate, db: Session = Depends(get_db)):
    db_appt = Appointment(**appt.dict()); db.add(db_appt); db.commit(); db.refresh(db_appt); return db_appt

@app.get("/appointments/")
def get_appointments(db: Session = Depends(get_db)):
    return db.query(Appointment).all()

@app.put("/appointments/{appt_id}/status")
def update_appt_status(appt_id: int, status: str, db: Session = Depends(get_db)):
    appt = db.query(Appointment).filter(Appointment.id == appt_id).first()
    if appt:
        appt.status = status; db.commit(); db.refresh(appt)
    return appt