import os
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction

from users.models import User
from estructura.models import Urbanizacion, Vivienda
from incidents.models import Incident
from reservations.models import Facility, Reservation
from packages.models import Package
from access.models import VisitorAccess
from works.models import Work
from notifications.models import Notification


class Command(BaseCommand):
    help = "Carga datos de demostración realistas en la base de datos"

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("🚀 Iniciando seed de datos..."))

        # --------------------------------------------------
        # URBANIZACIÓN
        # --------------------------------------------------
        urb, _ = Urbanizacion.objects.get_or_create(
            nombre="Residencial Los Olivos",
            defaults={
                "direccion": "Calle de los Olivos, 1",
                "localidad": "Pozuelo de Alarcón",
                "provincia": "Madrid",
                "codigo_postal": "28223",
            },
        )
        self.stdout.write(f"  ✅ Urbanización: {urb.nombre}")

        # --------------------------------------------------
        # VIVIENDAS
        # --------------------------------------------------
        viviendas_data = [
            ("A-101", "Bloque A, Portal 1, 1ºB"),
            ("A-102", "Bloque A, Portal 1, 2ºA"),
            ("A-201", "Bloque A, Portal 2, 1ºA"),
            ("A-202", "Bloque A, Portal 2, 2ºB"),
            ("B-101", "Bloque B, Portal 1, Bajo A"),
            ("B-102", "Bloque B, Portal 1, 1ºA"),
            ("B-201", "Bloque B, Portal 2, 2ºA"),
            ("B-202", "Bloque B, Portal 2, Ático B"),
            ("C-101", "Chalet C-101"),
            ("C-102", "Chalet C-102"),
        ]

        viviendas = {}
        for ref, detalle in viviendas_data:
            v, _ = Vivienda.objects.get_or_create(
                referencia=ref,
                urbanizacion=urb,
                defaults={
                    "direccion_detalle": detalle,
                    "propietario_nombre": f"Propietario {ref}",
                },
            )
            viviendas[ref] = v
        self.stdout.write(f"  ✅ {len(viviendas)} viviendas creadas")

        # --------------------------------------------------
        # USUARIOS
        # --------------------------------------------------
        def create_user(username, password, role, tipo, vivienda=None, email=""):
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    "role": role,
                    "tipo_usuario": tipo,
                    "vivienda": vivienda,
                    "email": email or f"{username}@estateflow.es",
                    "is_active": True,
                    "activo": True,
                },
            )
            if created:
                user.set_password(password)
                user.save()
            return user

        # Admin
        admin = create_user("admin", "admin123456", "ADMIN", "PERSONAL", email="admin@estateflow.es")

        # Staff
        staff1 = create_user("porteria", "staff123456", "STAFF", "PERSONAL", email="porteria@estateflow.es")
        staff2 = create_user("mantenimiento", "staff123456", "STAFF", "PERSONAL", email="mantenimiento@estateflow.es")

        # Residentes
        residentes = []
        resident_data = [
            ("maria", "user123456", "PROPIETARIO", "A-101", "maria.garcia@email.com"),
            ("carlos", "user123456", "INQUILINO", "A-102", "carlos.ruiz@email.com"),
            ("laura", "user123456", "PROPIETARIO", "A-201", "laura.martin@email.com"),
            ("javier", "user123456", "PROPIETARIO", "B-101", "javier.lopez@email.com"),
            ("ana", "user123456", "INQUILINO", "B-102", "ana.sanchez@email.com"),
            ("pedro", "user123456", "PROPIETARIO", "C-101", "pedro.fernandez@email.com"),
            ("elena", "user123456", "PROPIETARIO", "C-102", "elena.torres@email.com"),
        ]

        for username, pwd, tipo, ref, email in resident_data:
            u = create_user(username, pwd, "USER", tipo, vivienda=viviendas.get(ref), email=email)
            residentes.append(u)

        self.stdout.write(f"  ✅ {len(residentes) + 3} usuarios creados (1 admin, 2 staff, {len(residentes)} residentes)")

        # --------------------------------------------------
        # INSTALACIONES
        # --------------------------------------------------
        facilities_data = [
            ("Pista de Pádel", "Pista de pádel con iluminación nocturna", "08:00", "22:00", 60),
            ("Piscina Municipal", "Piscina de verano con socorrista", "10:00", "20:00", 120),
            ("Salón Social", "Salón para eventos y reuniones", "09:00", "23:00", 120),
            ("Gimnasio Comunitario", "Gimnasio equipado con máquinas", "06:00", "23:00", 60),
            ("Pista de Tenis", "Pista de tenis rápida", "08:00", "21:00", 60),
            ("Zona BBQ", "Zona de barbacoa con mesas", "11:00", "22:00", 120),
        ]

        facilities = {}
        for name, desc, opening, closing, slot in facilities_data:
            f, _ = Facility.objects.get_or_create(
                name=name,
                defaults={
                    "description": desc,
                    "opening_time": opening,
                    "closing_time": closing,
                    "slot_duration_minutes": slot,
                    "active": True,
                },
            )
            facilities[name] = f
        self.stdout.write(f"  ✅ {len(facilities)} instalaciones creadas")

        # --------------------------------------------------
        # INCIDENCIAS
        # --------------------------------------------------
        incidents_data = [
            ("Fuga de agua en garaje", "Hay una fuga de agua en el garaje del Bloque A que está afectando a varios plazas.", "PLUMBING", "Garaje Bloque A", "HIGH", "OPEN", residentes[0]),
            ("Luz rota en escalera", "La luz de la escalera del portal 2 del Bloque A no funciona desde hace dos días.", "ELECTRICITY", "Bloque A, Portal 2", "NORMAL", "IN_PROGRESS", residentes[1]),
            ("Portón automático no cierra", "El portón automático del garaje del Bloque B se queda abierto y no cierra.", "INFRASTRUCTURE", "Garaje Bloque B", "CRITICAL", "OPEN", residentes[3]),
            ("Jardín sin mantenimiento", "Los jardines de la zona común entre los bloques A y B necesitan mantenimiento.", "GARDENING", "Zona común central", "NORMAL", "RESOLVED", residentes[2]),
            ("Cámara de seguridad rota", "La cámara de seguridad de la entrada principal no graba.", "SECURITY", "Entrada principal", "HIGH", "IN_PROGRESS", residentes[4]),
            ("Ascensor bloqueado", "El ascensor del Bloque B se ha quedado bloqueado entre el 1º y 2º.", "EMERGENCY", "Bloque B", "CRITICAL", "OPEN", residentes[5]),
            ("Piscenta con algas", "La piscina tiene un exceso de algas en los bordes.", "CLEANING", "Piscina", "NORMAL", "RESOLVED", residentes[6]),
            ("Ruido en obra vecina", "El vecino del C-101 está haciendo obras fuera del horario permitido.", "SECURITY", "Chalet C-101", "NORMAL", "OPEN", residentes[0]),
            ("Barandilla suelta", "La barandilla de la terraza del Bloque A, 2º está suelta.", "INFRASTRUCTURE", "Bloque A, 2º", "HIGH", "OPEN", residentes[2]),
            ("Caldera comunitaria", "La caldera comunitaria del Bloque B no calienta suficiente.", "INFRASTRUCTURE", "Sala de calderas B", "HIGH", "IN_PROGRESS", residentes[3]),
        ]

        incident_objs = []
        for title, desc, cat, loc, urg, status, user in incidents_data:
            inc = Incident(
                title=title,
                description=desc,
                category=cat,
                location=loc,
                urgency=urg,
                status=status,
                created_by=user,
            )
            if status in ("IN_PROGRESS", "RESOLVED"):
                inc.assigned_to = staff2
            if status == "RESOLVED":
                inc.resolved_at = timezone.now() - timedelta(days=2)
            incident_objs.append(inc)

        # bulk_create bypasses save() and clean(), avoiding transition validation
        Incident.objects.bulk_create(incident_objs)
        self.stdout.write(f"  ✅ {len(incidents_data)} incidencias creadas")

        # --------------------------------------------------
        # RESERVAS
        # --------------------------------------------------
        today = timezone.now().date()
        reservations_data = [
            (facilities["Pista de Pádel"], residentes[0], today + timedelta(days=1), "10:00", "11:00"),
            (facilities["Pista de Pádel"], residentes[1], today + timedelta(days=2), "18:00", "19:00"),
            (facilities["Salón Social"], residentes[2], today + timedelta(days=5), "20:00", "23:00"),
            (facilities["Gimnasio Comunitario"], residentes[3], today + timedelta(days=1), "07:00", "08:00"),
            (facilities["Piscina Municipal"], residentes[4], today + timedelta(days=3), "12:00", "14:00"),
            (facilities["Pista de Tenis"], residentes[5], today + timedelta(days=2), "17:00", "18:00"),
            (facilities["Zona BBQ"], residentes[6], today + timedelta(days=7), "13:00", "16:00"),
            (facilities["Gimnasio Comunitario"], residentes[0], today, "06:00", "07:00"),
        ]

        for facility, user, date, start, end in reservations_data:
            Reservation.objects.get_or_create(
                facility=facility, user=user, date=date, start_time=start, end_time=end,
            )
        self.stdout.write(f"  ✅ {len(reservations_data)} reservas creadas")

        # --------------------------------------------------
        # PAQUETES
        # --------------------------------------------------
        packages_data = [
            (residentes[0], "AMAZON", "AMZ-001-2025-ESP", "Caja con electrodoméstico", False),
            (residentes[1], "SEUR", "SEUR-456789123", "Ropa de deporte", True),
            (residentes[2], "DHL", "DHL-ES-998877", "Documentos importantes", False),
            (residentes[3], "CORREOS", "COR-2025-554433", "Libros (x3)", False),
            (residentes[4], "AMAZON", "AMZ-002-2025-ESP", "Material de oficina", True),
            (residentes[5], "SEUR", "SEUR-789456123", "Equipamiento de jardinería", False),
            (residentes[6], "DHL", "DHL-ES-112233", "Regalo cumpleaños", False),
            (residentes[0], "AMAZON", "AMZ-003-2025-ESP", "Cable HDMI x2", True),
        ]

        for resident, carrier, tracking, desc, delivered in packages_data:
            Package.objects.get_or_create(
                resident=resident, tracking_number=tracking,
                defaults={"carrier": carrier, "description": desc, "delivered": delivered},
            )
        self.stdout.write(f"  ✅ {len(packages_data)} paquetes creados")

        # --------------------------------------------------
        # ACCESOS
        # --------------------------------------------------
        accesses_data = [
            (residentes[0], "Juan García Pérez", "12345678A", today + timedelta(days=1)),
            (residentes[0], "Mensajería Express", "", today),
            (residentes[1], "Lucía Martínez", "87654321B", today + timedelta(days=2)),
            (residentes[2], "Técnico Calidad Solar", "11223344C", today),
            (residentes[3], "Fontanería Madrid SL", "", today + timedelta(days=1)),
            (residentes[4], "Carlos Pérez (padre)", "99887766D", today + timedelta(days=3)),
            (residentes[5], "Empresa Reformas López", "55443322E", today + timedelta(days=1)),
            (residentes[6], "Ana Torres (hija)", "44556677F", today),
        ]

        for resident, name, dni, date in accesses_data:
            VisitorAccess.objects.get_or_create(
                resident=resident, visitor_name=name,
                defaults={"visitor_dni": dni, "visit_date": date, "authorized": True},
            )
        self.stdout.write(f"  ✅ {len(accesses_data)} accesos autorizados")

        # --------------------------------------------------
        # OBRAS
        # --------------------------------------------------
        works_data = [
            (residentes[0], "Reforma cocina", "Reforma completa de cocina: pladur, electricidad y fontanería", today + timedelta(days=10), today + timedelta(days=40), "Reformas García SL", 3, "APPROVED"),
            (residentes[3], "Instalación aire acondicionado", "Instalación de split en salón y dormitorio principal", today + timedelta(days=5), today + timedelta(days=7), "ClimaMadrid", 2, "PENDING"),
            (residentes[5], "Pintura exterior chalet", "Pintura completa de fachada del chalet C-101", today + timedelta(days=15), today + timedelta(days=25), "Pinturas Elite", 4, "PENDING"),
            (residentes[2], "Cambio de ventanas", "Sustitución de 6 ventanas por doble cristal", today - timedelta(days=10), today - timedelta(days=1), "Aluminios Pozuelo", 2, "COMPLETED"),
            (residentes[6], "Impermeabilización terraza", "Impermeabilización de terraza con membrana líquida", today + timedelta(days=20), today + timedelta(days=23), "Imper SL", 2, "PENDING"),
        ]

        for resident, title, desc, start, end, company, workers, status in works_data:
            Work.objects.get_or_create(
                resident=resident, title=title,
                defaults={
                    "description": desc, "start_date": start, "end_date": end,
                    "company": company, "workers_count": workers, "status": status,
                },
            )
        self.stdout.write(f"  ✅ {len(works_data)} obras registradas")

        # --------------------------------------------------
        # NOTIFICACIONES
        # --------------------------------------------------
        notifs_data = [
            (residentes[0], "Tu incidencia 'Fuga de agua en garaje' ha sido asignada al equipo de mantenimiento."),
            (residentes[0], "Tienes un paquete de Amazon pendiente de recogida en portería."),
            (residentes[1], "Tu reserva de pádel para mañana a las 18:00 está confirmada."),
            (residentes[2], "La obra 'Cambio de ventanas' ha sido marcada como finalizada."),
            (residentes[3], "Nueva incidencia reportada en tu edificio: 'Portón automático no cierra'."),
            (residentes[4], "Tu acceso para 'Técnico Calidad Solar' ha sido autorizado."),
            (residentes[5], "Tienes 2 paquetes pendientes en portería."),
            (residentes[6], "Recordatorio: reserva de zona BBQ el próximo sábado."),
            (admin, "Nueva incidencia crítica: 'Ascensor bloqueado' en Bloque B."),
            (admin, "Nueva incidencia crítica: 'Portón automático no cierra' en Garaje Bloque B."),
            (staff1, "Paquete recibido para María (A-101) de Amazon."),
            (staff1, "Paquete recibido para Pedro (C-101) de SEUR."),
        ]

        for user, msg in notifs_data:
            Notification.objects.get_or_create(user=user, message=msg)
        self.stdout.write(f"  ✅ {len(notifs_data)} notificaciones creadas")

        self.stdout.write(self.style.SUCCESS("\n🎉 Seed completado con éxito!"))
        self.stdout.write("\n📋 Credenciales de acceso:")
        self.stdout.write(f"  Admin:     admin / admin123456")
        self.stdout.write(f"  Staff:     porteria / staff123456")
        self.stdout.write(f"  Staff:     mantenimiento / staff123456")
        self.stdout.write(f"  Residente: maria / user123456")
        self.stdout.write(f"  Residente: carlos / user123456")
        self.stdout.write(f"  Residente: laura / user123456")
