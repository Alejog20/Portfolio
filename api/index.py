import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv

load_dotenv()

# --- Modelado de Datos (Sin cambios, ya está perfecto) ---
class ContactForm(BaseModel):
    nombre: str
    email: EmailStr
    asunto: str
    mensaje: str

# --- Inicialización de la Aplicación FastAPI ---
# Vercel buscará esta variable 'app' para servir tu API.
app = FastAPI()

# --- Configuración de CORS para Producción ---
# Es crucial añadir la URL de tu sitio en Vercel a la lista de orígenes.
# El asterisco "*" es una opción flexible pero menos segura para empezar.
origins = [
    # Es más seguro especificar tus dominios en lugar de usar "*".
    # Cuando tengas tu dominio final, añádelo aquí.
    "https://tu-dominio-final.vercel.app", 
    "http://127.0.0.1:5500", # Para pruebas con Live Server de VSCode
    "null" # Para pruebas abriendo el HTML localmente
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # ¡Importante! Usa tu lista de orígenes.
    allow_credentials=True,
    allow_methods=["POST"], # Solo permitimos POST para este endpoint
    allow_headers=["Content-Type"], # Solo permitimos la cabecera necesaria
)

# --- Endpoint para el Formulario de Contacto (Sin cambios en la lógica) ---
@app.post("/api/contact")
async def handle_contact_form(form: ContactForm):
    """
    Recibe los datos del formulario, los valida y envía un correo electrónico.
    """
    SENDER_EMAIL = os.getenv("EMAIL_USER")
    SENDER_PASSWORD = os.getenv("EMAIL_PASSWORD")
    RECIPIENT_EMAIL = os.getenv("RECIPIENT_EMAIL", SENDER_EMAIL) # Mejor si es una variable de entorno

    if not SENDER_EMAIL or not SENDER_PASSWORD:
        raise HTTPException(status_code=500, detail="Error de configuración en el servidor.")

    message = MIMEMultipart("alternative")
    message["Subject"] = f"Nuevo mensaje de tu portafolio: {form.asunto}"
    message["From"] = SENDER_EMAIL
    message["To"] = RECIPIENT_EMAIL

    html_body = f"""
    <html><body>
        <h2>Nuevo mensaje de tu portafolio:</h2>
        <p><strong>Nombre:</strong> {form.nombre}</p>
        <p><strong>Email:</strong> <a href="mailto:{form.email}">{form.email}</a></p>
        <p><strong>Asunto:</strong> {form.asunto}</p>
        <hr>
        <h3>Mensaje:</h3>
        <p>{form.mensaje.replace("\n", "<br>")}</p>
    </body></html>
    """
    message.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, message.as_string())
        
        return {"message": "Mensaje enviado exitosamente!"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"No se pudo enviar el correo.")