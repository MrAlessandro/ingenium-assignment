from .base import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get("DJANGO_DEBUG").lower() == "true"

ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS").split(",")

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "USER": os.environ.get("POSTGRES_USER"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD"),
        "HOST": os.environ.get("POSTGRES_HOST"),
        "PORT": os.environ.get("POSTGRES_PORT"),
        "NAME": os.environ.get("POSTGRES_DB"),
    }
}

# Cache
CACHES = {
    "default": {
        # use memcached for production
        "BACKEND": "django.core.cache.backends.memcached.PyMemcacheCache",
        "LOCATION": f"{os.environ.get('MEMCACHED_HOST', '127.0.0.1')}:{os.environ.get('MEMCACHED_PORT', '11211')}",
        "TIMEOUT": 60 * 5,
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

CORS_ALLOWED_ORIGINS = os.environ.get("DJANGO_CORS_ALLOWED_ORIGINS").split(",")

CELERY_BROKER_URL = (
    f"redis://{os.environ.get('REDIS_HOST')}:{os.environ.get('REDIS_PORT')}"
)
CELERY_RESULT_BACKEND = (
    f"redis://{os.environ.get('REDIS_HOST')}:{os.environ.get('REDIS_PORT')}"
)
CELERY_RESULT_SERIALIZER = "json"
CELERY_TASK_SERIALIZER = "json"
