FROM python:3.9.1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt install -y netcat
RUN pip install --upgrade pip
COPY deploy/requirements.txt ./
RUN pip install -r requirements.txt
