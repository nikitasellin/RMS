# Development settings
from .base import *

SECRET_KEY = ')x^tnrs^yggo!s+-@9o#na%l)26q@*rsyco^pdq0w(eqvuyxj*'

DEBUG = True

ALLOWED_HOSTS = []

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'resmanagement',
        'USER': 'resmanager',
        'PASSWORD': 'Hzsj6W1yrk',
        'HOST': 'db',
        'PORT': '5432'
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.filebased.EmailBackend'
EMAIL_FILE_PATH = 'tmp/emails/'
ADMIN_EMAIL = 'nikita@selin.com.ru'

CORS_ALLOW_ALL_ORIGINS = True

FRONTEND_URL = os.environ.get('FRONTEND_URL')
