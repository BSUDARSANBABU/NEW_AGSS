from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser

from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.utils import timezone

import random
import jwt
from datetime import datetime, timedelta

from .models import (
    Developer, Project, Resource, DemoBooking, Customer,
    PerformanceReview, Job, JobApplication, Client, EmailOTP, 
    ProjectAsset, ProjectDeveloper,Documentation,SiteSettings,InterviewProcess,Footer,ProjectImage
)
from .serializers import (
    DeveloperSerializer, ProjectSerializer, ResourceSerializer,
    DemoBookingSerializer, CustomerSerializer, CustomerLoginSerializer,
    PerformanceReviewSerializer, JobSerializer, JobApplicationSerializer,
    ClientSerializer, ProjectAssetSerializer, ProjectDeveloperSerializer,
    InterviewProcessSerializer, DocumentationSerializer, SiteSettingsSerializer, FooterSerializer, ProjectImageSerializer
)
from .permissions import IsAuthenticated, IsOwnerOrReadOnly

class InterviewProcessViewSet(viewsets.ModelViewSet):
    queryset = InterviewProcess.objects.all().order_by("round_number")
    serializer_class = InterviewProcessSerializer
    permission_classes = [AllowAny]  # Allow public access for interview process details

class SiteSettingsViewSet(viewsets.ModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [AllowAny]  # Allow public access for site settings


class DocumentationViewSet(viewsets.ModelViewSet):

    queryset = Documentation.objects.select_related(
        "project",
        "created_by"
    ).order_by("-id")

    serializer_class = DocumentationSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):

        user = None
        developer = None

        # ✅ Only assign if logged in
        if self.request.user.is_authenticated:
            user = self.request.user
            developer = Developer.objects.filter(
                user=user
            ).first()

        serializer.save(
            created_by=user
        )

class DeveloperViewSet(viewsets.ModelViewSet):
    queryset = Developer.objects.all()
    serializer_class = DeveloperSerializer
    # Allow full public access for portfolio content
    permission_classes = [AllowAny] 
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_context(self):
        return {"request": self.request} 

from rest_framework.parsers import MultiPartParser, FormParser
from .models import ProjectAsset

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]  # Allow full public access for portfolio content
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_context(self):
        return {"request": self.request}

class ProjectImageViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectImageSerializer
    permission_classes = [AllowAny]  # Allow public access for project images
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        project_id = self.kwargs.get('project_pk')
        if project_id:
            return ProjectImage.objects.filter(project_id=project_id).order_by('order', 'created_at')
        return ProjectImage.objects.all().order_by('-created_at')
    
class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [AllowAny]  # Allow full public access for portfolio content
    parser_classes = (JSONParser, MultiPartParser, FormParser)

    def get_queryset(self):
        queryset = Resource.objects.all()
        category = self.request.query_params.get("category")

        if category:
            queryset = queryset.filter(category=category)

        return queryset


class DemoBookingCreateView(viewsets.ModelViewSet):
    queryset = DemoBooking.objects.all()
    serializer_class = DemoBookingSerializer
    permission_classes = [AllowAny]  # Allow full public access for contact forms

from rest_framework.viewsets import ModelViewSet
from .models import Client
from .serializers import ClientSerializer

class ClientViewSet(ModelViewSet):
    queryset = Client.objects.all().order_by("-created_at")
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]

from rest_framework.viewsets import ModelViewSet

class JobViewSet(ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Job.objects.all()

        today = timezone.now().date()

        # If request is from admin (authenticated user)
        if self.request.user.is_authenticated:
            return queryset   # show ALL jobs including expired

        # Public users
        return queryset.filter(
            is_active=True
        ).filter(
            expires_at__isnull=True
        ) | queryset.filter(
            is_active=True,
            expires_at__gte=today
        )


from rest_framework.decorators import action

class JobApplicationViewSet(ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [AllowAny]  # Confidential data

    @action(detail=True, methods=["post"])
    def mark_viewed(self, request, pk=None):
        application = self.get_object()

        if application.status == "submitted":
            application.status = "viewed"
            application.viewed_at = timezone.now()
            application.save()

        return Response({"status": application.status})

class CustomerViewSet(ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]  # Customer data should be protected

class CustomerLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CustomerLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        customer = serializer.validated_data["customer"]

        return Response({
            "message": "Login successful",
            "customer_id": customer.id,
            "email": customer.email,
            "name": customer.name
        }, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([AllowAny])
def send_otp(request):
    email = request.data.get("email")

    if not email:
        return Response({"success": False, "error": "Email required"}, status=400)

    otp = str(random.randint(100000, 999999))
    EmailOTP.objects.create(email=email, otp=otp)

    try:
        send_mail(
            "DevHub - Your OTP Code",
            f"Your DevHub OTP code is {otp}",
            settings.DEFAULT_FROM_EMAIL,
            [email],
        )
        return Response({"success": True, "message": "OTP sent successfully"})
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=500)

@api_view(["POST"])
@permission_classes([AllowAny])
def verify_otp(request):
    email = request.data.get("email")
    otp = request.data.get("otp")

    record = EmailOTP.objects.filter(email=email, otp=otp).last()

    if not record or not record.is_valid():
        return Response({"success": False}, status=400)

    exists = Customer.objects.filter(email=email).exists()

    return Response({
        "success": True,
        "exists": exists
    })

@api_view(["POST"])
@permission_classes([AllowAny])
def register_customer(request):
    print("=== Registration Debug ===")
    print("Request data:", request.data)
    print("Request method:", request.method)
    print("Content type:", request.content_type)
    
    email = request.data.get("email")
    name = request.data.get("name")
    phone = request.data.get("phone", "")
    password = request.data.get("password")

    print(f"Parsed data - email: {email}, name: {name}, phone: {phone}, password: {'*' * len(password) if password else 'None'}")

    if not all([email, name, password]):
        print("Validation failed: Missing required fields")
        return Response({"success": False, "error": "Email, name, and password are required"}, status=400)

    # Check if customer already exists
    if Customer.objects.filter(email=email).exists():
        print("Customer already exists")
        return Response({"success": False, "error": "Email already registered"}, status=400)

    try:
        print("Creating customer...")
        customer = Customer.objects.create(
            email=email,
            name=name,
            phone=phone,
            password=make_password(password),
            is_verified=True  # Email is verified through OTP process
        )
        print(f"Customer created successfully: {customer.id}")

        return Response({
            "success": True,
            "id": customer.id,
            "email": customer.email,
            "name": customer.name,
            "message": "Registration successful"
        }, status=201)
    except Exception as e:
        print(f"Exception during registration: {str(e)}")
        return Response({"success": False, "error": str(e)}, status=400)

@api_view(["POST"])
@permission_classes([AllowAny])
def customer_login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        customer = Customer.objects.get(email=email)
    except Customer.DoesNotExist:
        return Response({"error": "Invalid email"}, status=400)

    if not check_password(password, customer.password):
        return Response({"error": "Invalid password"}, status=400)

    return Response({
        "id": customer.id,
        "email": customer.email,
        "name": customer.name
    })

@api_view(["POST"])
def reset_customer_password(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"error": "Email and password are required"}, status=400)

    try:
        customer = Customer.objects.get(email=email)
    except Customer.DoesNotExist:
        return Response({"error": "Customer not found"}, status=404)

    customer.password = make_password(password)
    customer.save()

    return Response({"success": True})


from rest_framework import viewsets, permissions
from .models import PerformanceReview
from .serializers import PerformanceReviewSerializer

class PerformanceReviewViewSet(viewsets.ModelViewSet):
    serializer_class = PerformanceReviewSerializer
    permission_classes = [AllowAny]  # Allow public access for reviews

    def get_queryset(self):
        queryset = PerformanceReview.objects.select_related(
            "project"
        ).order_by("-created_at")

        project_id = self.request.query_params.get("project")
        if project_id:
            queryset = queryset.filter(project_id=project_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save()

class CustomerLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CustomerLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        customer = serializer.validated_data["customer"]

        # Generate JWT token
        payload = {
            'customer_id': customer.id,
            'email': customer.email,
            'exp': datetime.utcnow() + timedelta(days=7),
            'iat': datetime.utcnow()
        }
        
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

        return Response({
            "success": True,
            "token": token,
            "customer": {
                "id": customer.id,
                "email": customer.email,
                "name": customer.name,
                "phone": customer.phone
            }
        })


class FooterViewSet(viewsets.ModelViewSet):
    """ViewSet for Footer model - manages footer contact and company information"""
    queryset = Footer.objects.all()
    serializer_class = FooterSerializer
    permission_classes = [AllowAny]  # Allow public access for footer data
    
    def get_queryset(self):
        """Return only the first footer record or create default if none exists"""
        footer = Footer.objects.first()
        if not footer:
            # Create default footer if none exists
            footer = Footer.objects.create(
                email='contact@example.com',
                phone='+1 234 567 8900',
                address='123 Business Street, City, State 12345',
                company_description='Professional platform for software development',
                social_links={},
                copyright_text='© 2024 Your Company. All rights reserved.'
            )
        return Footer.objects.filter(id=footer.id)


# Admin Authentication Views
class AdminLoginView(APIView):
    """Admin login endpoint"""
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "Username and password are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Authenticate using Django's built-in authentication
        user = authenticate(username=username, password=password)
        
        if user is None:
            return Response(
                {"error": "Invalid credentials"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_staff and not user.is_superuser:
            return Response(
                {"error": "Access denied. Admin privileges required."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        # Generate JWT token (you'll need to configure JWT settings)
        try:
            payload = {
                'user_id': user.id,
                'username': user.username,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'exp': datetime.utcnow() + timedelta(hours=24),  # Token expires in 24 hours
                'iat': datetime.utcnow()
            }
            
            # For now, using a simple token - in production, use proper JWT
            token = f"admin_token_{user.id}_{int(datetime.utcnow().timestamp())}"
            
            return Response({
                "success": True,
                "token": token,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "is_staff": user.is_staff,
                    "is_superuser": user.is_superuser,
                    "permissions": ["read", "write", "delete", "manage_users"] if user.is_superuser else ["read", "write"]
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": "Token generation failed"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminRefreshTokenView(APIView):
    """Refresh admin authentication token"""
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        
        if not token:
            return Response(
                {"error": "Token required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # For now, simple token validation - in production, validate JWT
        try:
            # Extract user info from token (simplified)
            if token.startswith("admin_token_"):
                parts = token.split("_")
                user_id = parts[2]
                
                # In production, validate token properly and check expiration
                # For demo purposes, we'll just return a new token
                new_token = f"admin_token_{user_id}_{int(datetime.utcnow().timestamp())}"
                
                return Response({
                    "success": True,
                    "token": new_token
                }, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Invalid token format"}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
        except Exception as e:
            return Response(
                {"error": "Token validation failed"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )


class AdminChangePasswordView(APIView):
    """Change admin password"""
    permission_classes = [IsAuthenticated]

    def put(self, request):
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not current_password or not new_password:
            return Response(
                {"error": "Current password and new password are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate new password strength
        if len(new_password) < 8:
            return Response(
                {"error": "New password must be at least 8 characters long"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if not any(c.islower() for c in new_password):
            return Response(
                {"error": "New password must contain lowercase letters"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if not any(c.isupper() for c in new_password):
            return Response(
                {"error": "New password must contain uppercase letters"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if not any(c.isdigit() for c in new_password):
            return Response(
                {"error": "New password must contain numbers"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if not any(c in '@$!%*?&' for c in new_password):
            return Response(
                {"error": "New password must contain special characters"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify current password
        user = request.user
        if not user.check_password(current_password):
            return Response(
                {"error": "Current password is incorrect"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update password
        user.set_password(new_password)
        user.save()

        return Response({
            "success": True,
            "message": "Password updated successfully"
        }, status=status.HTTP_200_OK)


class AdminLogoutView(APIView):
    """Admin logout endpoint"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # In a JWT-based system, you might want to blacklist the token
        # For now, we'll just return success
        return Response({
            "success": True,
            "message": "Logout successful"
        }, status=status.HTTP_200_OK)




