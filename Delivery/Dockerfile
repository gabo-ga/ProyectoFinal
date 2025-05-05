#usar la imagen de python
FROM python:3.12-slim

#directorio de trabajo
WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    python3-pip \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

#variables de entorno
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

#Copiar los archivos de dependencias
COPY requirements.txt .

#actualizar pip
RUN pip install --upgrade pip

RUN pip install --upgrade setuptools wheel

#instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

#copiar el codigo fuente
COPY . .

#puerto que se va a exponer
EXPOSE 8000

#comando para ejecutar la aplicacion
CMD ["python3", "manage.py", "runserver","0.0.0.0:8000"]
