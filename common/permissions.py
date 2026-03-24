from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "ADMIN"


class IsStaff(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ["ADMIN", "STAFF"]


class IsResident(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "USER"


# 🔥 ESTA ES LA QUE ACTUALIZAMOS
class IsOwnerOrAdmin(BasePermission):
    """
    Permite acceso si:
    - Es ADMIN o STAFF
    - Es el creador del objeto
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return (
            request.user.role in ["ADMIN", "STAFF"]
            or obj.created_by == request.user
        )