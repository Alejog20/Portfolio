# main.py

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv

# Cargar las variables de entorno (credenciales) desde el archivo .env
load_dotenv()

# --- Modelado de Datos ---
# Usamos Pydantic para definir la estructura de los datos que esperamos recibir.
# FastAPI lo usará para validar automáticamente la información del formulario.
class ContactForm(BaseModel):
    nombre: str
    email: EmailStr  # Valida que sea un formato de email válido
    asunto: str
    mensaje: str

# --- Inicialización de la Aplicación FastAPI ---
app = FastAPI()

# --- Configuración de CORS ---
# Esto es CRÍTICO. Permite que tu página web (front-end) se comunique
# con este backend, aunque estén en dominios diferentes (o localhost).
origins = [
    "http://127.0.0.1:5500",  # Si usas Live Server de VS Code (cambia el puerto si es necesario)
    "null",  # Para permitir peticiones desde archivos locales (abriendo el index.html directamente)
    # "https://www.tu-dominio.com", # ¡Añade tu dominio cuando publiques la web!
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"], # Permite todas las cabeceras
)


# --- Endpoint para el Formulario de Contacto ---
@app.post("/api/contact")
async def handle_contact_form(form: ContactForm):
    """
    Recibe los datos del formulario, los valida y envía un correo electrónico.
    """
    # Obtener credenciales seguras desde las variables de entorno
    SENDER_EMAIL = os.getenv("EMAIL_USER")
    SENDER_PASSWORD = os.getenv("EMAIL_PASSWORD")
    RECIPIENT_EMAIL = SENDER_EMAIL # O pon otro correo si quieres

    if not SENDER_EMAIL or not SENDER_PASSWORD:
        raise HTTPException(status_code=500, detail="Configuración de email incompleta en el servidor.")

    # --- Construcción del Correo Electrónico ---
    message = MIMEMultipart("alternative")
    message["Subject"] = f"Nuevo mensaje de tu portafolio: {form.asunto}"
    message["From"] = SENDER_EMAIL
    message["To"] = RECIPIENT_EMAIL

    # Crear el cuerpo del correo en formato HTML para que se vea bien
    html_body = f"""
    <html>
    <body>
        <h2>Has recibido un nuevo mensaje de tu portafolio:</h2>
        <p><strong>Nombre:</strong> {form.nombre}</p>
        <p><strong>Email:</strong> <a href="mailto:{form.email}">{form.email}</a></p>
        <p><strong>Asunto:</strong> {form.asunto}</p>
        <hr>
        <h3>Mensaje:</h3>
        <p>{form.mensaje.replace("\n", "<br>")}</p>
    </body>
    </html>
    """
    message.attach(MIMEText(html_body, "html"))

    # --- Envío del Correo con SMTP de Gmail ---
    try:
        # 587 es el puerto para el protocolo TLS de Gmail
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()  # Iniciar conexión segura
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, message.as_string())
        
        return {"message": "Mensaje enviado exitosamente!"}
    
    except Exception as e:
        # En caso de un error al enviar el correo, devolvemos un error HTTP
        raise HTTPException(status_code=500, detail=f"No se pudo enviar el correo: {e}")
