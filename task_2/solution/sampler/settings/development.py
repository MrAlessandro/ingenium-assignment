from .base import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "DJANGO_SECRET_KEY"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "USER": "postgres",
        "PASSWORD": "postgres",
        "HOST": "127.0.0.1",
        "PORT": "5432",
        "NAME": "sampler",
    }
}

# Cache
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = []

CORS_ALLOW_ALL_ORIGINS = True

CELERY_BROKER_URL = "redis://127.0.0.1:6379"
CELERY_RESULT_BACKEND = "redis://127.0.0.1:6379"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TASK_SERIALIZER = "json"
