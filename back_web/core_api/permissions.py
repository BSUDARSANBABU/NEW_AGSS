from rest_framework import permissions

class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    """
    Allows read-only access for unauthenticated users,
    but requires authentication for write operations.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated

class IsAuthenticated(permissions.BasePermission):
    """
    Allows access only to authenticated users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Allows read-only access for unauthenticated users,
    but allows write access only to the owner of the object.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Check if the object has a user field and if it matches the current user
        if hasattr(obj, 'user') and obj.user == request.user:
            return True
        
        # Check if the object has a created_by field and if it matches the current user
        if hasattr(obj, 'created_by') and obj.created_by == request.user:
            return True
            
        return False
