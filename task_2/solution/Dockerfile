# Use the official Python base image
FROM python:3.11-slim

# set environment variables
ENV SHELL /bin/bash
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

COPY requirements.txt /app/

RUN pip install -r requirements.txt
RUN pip install gunicorn

# Copy current workdir to the container
COPY . /app/

# Install the Python dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
RUN chmod +x entrypoint.sh

ENTRYPOINT [ "/app/entrypoint.sh" ]