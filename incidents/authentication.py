from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    Autenticación por sesión sin comprobación CSRF.
    Útil para APIs de lectura consumidas por frontend desacoplado.
    """

    def enforce_csrf(self, request):
        return
