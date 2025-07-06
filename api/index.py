import os
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
from pathlib import Path
import httpx  # Para hacer requests HTTP
import asyncio
from datetime import datetime

# --- Importaciones de la Base de Datos ---
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from typing import List

load_dotenv()

# --- Configuración de la Base de Datos ---
DATABASE_URL = os.getenv("POSTGRES_URL")
if not DATABASE_URL:
    raise RuntimeError("La variable de entorno POSTGRES_URL no está configurada.")

# --- Configuración de Email ---
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL")  # El email desde el cual se envían las notificaciones
TO_EMAIL = os.getenv("TO_EMAIL")      # Tu email personal donde recibes las notificaciones

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# --- Modelo de Tabla SQLAlchemy MEJORADO ---
class Contact(Base):
    __tablename__ = "contacts"
    id = Column(Integer, primary_key=True)
    nombre = Column(String)
    email = Column(String)
    asunto = Column(String)
    mensaje = Column(Text)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)  # Agregamos timestamp


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
    fecha_creacion: datetime

    class Config:
        from_attributes = True


# --- Función para Enviar Email con SendGrid ---
async def send_email_notification(contact_data: ContactForm):
    """
    Envía una notificación por email cuando se recibe un nuevo contacto.
    
    Esta función es como tu asistente personal que te avisa inmediatamente
    cuando alguien importante te quiere contactar.
    """
    if not SENDGRID_API_KEY or not FROM_EMAIL or not TO_EMAIL:
        print("⚠️ Configuración de email no completa. Saltando notificación por email.")
        return
    
    # Construir el contenido del email de notificación
    email_subject = f"🚀 Nuevo Contacto de tu Portafolio: {contact_data.asunto}"
    
    # Crear un email HTML bonito y profesional
    email_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4a4a4a; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
                📩 Nuevo Mensaje de Contacto
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>👤 Nombre:</strong> {contact_data.nombre}</p>
                <p><strong>📧 Email:</strong> {contact_data.email}</p>
                <p><strong>📝 Asunto:</strong> {contact_data.asunto}</p>
            </div>
            
            <div style="background-color: #fff; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
                <h3 style="color: #007bff; margin-top: 0;">💬 Mensaje:</h3>
                <p style="font-style: italic;">{contact_data.mensaje}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #e9ecef; border-radius: 8px;">
                <p style="margin: 0; font-size: 14px; color: #6c757d;">
                    Este email fue generado automáticamente por tu sistema de portafolio.<br>
                    Responde directamente al email: <strong>{contact_data.email}</strong>
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Estructura del email para SendGrid API
    email_data = {
        "personalizations": [
            {
                "to": [{"email": TO_EMAIL}],
                "subject": email_subject
            }
        ],
        "from": {"email": FROM_EMAIL},
        "content": [
            {
                "type": "text/html",
                "value": email_content
            }
        ]
    }
    
    # Enviar el email usando SendGrid API
    headers = {
        "Authorization": f"Bearer {SENDGRID_API_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.sendgrid.com/v3/mail/send",
                headers=headers,
                json=email_data
            )
            
        if response.status_code == 202:
            print(f"✅ Email de notificación enviado exitosamente para: {contact_data.nombre}")
        else:
            print(f"❌ Error enviando email: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Excepción enviando email: {str(e)}")


# --- Inicialización de la Aplicación FastAPI ---
app = FastAPI(title="Portfolio API con Notificaciones")

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# --- Endpoint MEJORADO para Manejar Contactos ---
@app.post("/contact")
async def handle_contact_form(form: ContactForm):
    """
    Recibe datos del formulario, los guarda en la base de datos,
    y envía una notificación por email instantáneamente.
    
    Es como tener un recepcionista que no solo anota los mensajes,
    sino que inmediatamente te llama para avisarte que llegó algo importante.
    """
    db = SessionLocal()
    try:
        # Guardar en la base de datos
        db_contact = Contact(**form.model_dump())
        db.add(db_contact)
        db.commit()
        db.refresh(db_contact)
        
        # Enviar notificación por email de forma asíncrona
        # Esto no bloquea la respuesta al usuario
        asyncio.create_task(send_email_notification(form))
        
        print(f"📝 Nuevo contacto guardado: {form.nombre} - {form.email}")
        
        return {
            "message": "Mensaje recibido y guardado exitosamente!",
            "timestamp": datetime.utcnow().isoformat(),
            "contact_id": db_contact.id
        }
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error guardando contacto: {str(e)}")
        raise HTTPException(status_code=500, detail=f"No se pudo guardar el mensaje: {e}")
    finally:
        db.close()


@app.get("/contacts", response_model=List[ContactResponse])
def get_contacts():
    """
    Obtiene todos los mensajes de contacto guardados en la base de datos,
    ordenados por fecha de creación (más recientes primero).
    """
    db = SessionLocal()
    try:
        contacts = db.query(Contact).order_by(Contact.fecha_creacion.desc()).all()
        return contacts
    finally:
        db.close()


# --- Endpoint de Salud para Testing ---
@app.get("/health")
def health_check():
    """
    Endpoint simple para verificar que la API está funcionando.
    Es como un botón de 'test' que te dice si todo está bien.
    """
    return {
        "status": "healthy",
        "message": "API funcionando correctamente",
        "timestamp": datetime.utcnow().isoformat(),
        "database": "connected" if DATABASE_URL else "not configured",
        "email": "configured" if SENDGRID_API_KEY else "not configured"
    }


# --- Montaje de Archivos Estáticos (solo para desarrollo local) ---
root_directory = Path(__file__).resolve().parent.parent
app.mount("/", StaticFiles(directory=root_directory, html=True), name="static")