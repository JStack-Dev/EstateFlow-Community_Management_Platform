"""
WSGI config for issueflow project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os
import sys

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "issueflow.settings")

# Auto-migrar y poblar la base de datos al arrancar si las tablas no existen
try:
    import django
    django.setup()
    from django.core.management import call_command
    from users.models import User
    # Verificar si la tabla de usuarios existe consultando el count
    if User.objects.count() == 0:
        call_command("seed_data")
except Exception:
    # Si las tablas no están creadas (OperationalError / no such table), ejecutar migrate y seed
    try:
        call_command("migrate", interactive=False)
        call_command("seed_data")
    except Exception as err:
        sys.stderr.write(f"Error auto-inicializando base de datos en WSGI: {err}\n")

application = get_wsgi_application()
