import os
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
from pathlib import Path

# --- Importaciones de la Base de Datos ---
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

load_dotenv()

# --- Configuración de la Base de Datos ---
DATABASE_URL = os.getenv("POSTGRES_URL")
if not DATABASE_URL:
    raise RuntimeError("La variable de entorno POSTGRES_URL no está configurada.")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# --- Modelo de Tabla SQLAlchemy ---
class Contact(Base):
    __tablename__ = "contacts"
    id = Column(Integer, primary_key=True)
    nombre = Column(String)
    email = Column(String)
    asunto = Column(String)
    mensaje = Column(Text)


# --- Modelos Pydantic ---
class ContactForm(BaseModel):
    nombre: str
    email: EmailStr
    asunto: str
    mensaje: str

class ContactResponse(BaseModel):
    id: int
    nombre: str
    email: str
    asunto: str
    mensaje: str

    class Config:
        from_attributes = True


# --- Inicialización de la Aplicación FastAPI ---
app = FastAPI(title="Portfolio API")

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# --- Endpoints de la API ---
@app.post("/api/contact")
async def handle_contact_form(form: ContactForm):
    """
    Recibe datos del formulario y los guarda en la base de datos de Supabase.
    """
    db = SessionLocal()
    try:
        db_contact = Contact(**form.dict())
        db.add(db_contact)
        db.commit()
        db.refresh(db_contact)
        return {"message": "Mensaje recibido y guardado exitosamente!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"No se pudo guardar el mensaje: {e}")
    finally:
        db.close()


@app.get("/api/contacts", response_model=list[ContactResponse])
def get_contacts():
    """
    Obtiene todos los mensajes de contacto guardados en la base de datos.
    """
    db = SessionLocal()
    try:
        contacts = db.query(Contact).order_by(Contact.id.desc()).all()
        return contacts
    finally:
        db.close()


# --- Montaje de Archivos Estáticos ---
root_directory = Path(__file__).resolve().parent.parent
app.mount("/", StaticFiles(directory=root_directory, html=True), name="static")