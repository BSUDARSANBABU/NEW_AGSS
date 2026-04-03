from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser

from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.utils import timezone

import random

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
        return Response({"error": "Email required"}, status=400)

    otp = str(random.randint(100000, 999999))
    EmailOTP.objects.create(email=email, otp=otp)

    try:
        send_mail(
            "DevHub - Your OTP Code",
            f"Your DevHub OTP code is {otp}",
            settings.DEFAULT_FROM_EMAIL,
            [email],
        )
    except Exception as e:
        return Response({"error": str(e)}, status=500)

    return Response({"message": "OTP sent"})

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
    email = request.data.get("email")
    name = request.data.get("name")
    phone = request.data.get("phone")
    password = request.data.get("password")
    otp = request.data.get("otp")

    if not all([email, name, phone, password, otp]):
        return Response({"error": "All fields are required"}, status=400)

    # ✅ VERIFY OTP AGAIN (CRITICAL)
    record = EmailOTP.objects.filter(email=email, otp=otp).last()
    if not record or not record.is_valid():
        return Response({"error": "Invalid or expired OTP"}, status=400)

    if Customer.objects.filter(email=email).exists():
        return Response({"error": "Email already registered"}, status=400)

    customer = Customer.objects.create(
        email=email,
        name=name,
        phone=phone,
        password=make_password(password),
        is_verified=True
    )

    return Response({
        "id": customer.id,
        "email": customer.email,
        "name": customer.name
    }, status=201)

    email = request.data.get("email")

    if Customer.objects.filter(email=email).exists():
        return Response({"error": "Email already registered"}, status=400)

    serializer = CustomerSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    customer = serializer.save(is_verified=True)

    return Response({
        "id": customer.id,
        "email": customer.email,
        "name": customer.name
    }, status=201)
    serializer = CustomerSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    customer = serializer.save(is_verified=True)

    return Response({
        "id": customer.id,
        "email": customer.email,
        "name": customer.name
    }, status=201)

    email = request.data.get("email")
    name = request.data.get("name")
    password = request.data.get("password")

    if not email or not name or not password:
        return Response(
            {"error": "Email, name and password are required"},
            status=400
        )

    if Customer.objects.filter(email=email).exists():
        return Response({"error": "Account already exists"}, status=400)

    customer = Customer.objects.create(
        email=email,
        name=name,
        password=make_password(password),
        is_verified=True,
    )

    return Response({
        "id": customer.id,
        "email": customer.email,
        "name": customer.name
    })

    email = request.data.get("email")
    name = request.data.get("name")
    password = request.data.get("password")

    if Customer.objects.filter(email=email).exists():
        return Response({"error": "Account already exists"}, status=400)

    customer = Customer.objects.create(
        email=email,
        name=name,
        password=make_password(password),
        is_verified=True,
    )

    return Response({   
        "id": customer.id,
        "email": customer.email,
        "name": customer.name
    })

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

@api_view(["POST"])
@permission_classes([AllowAny])
def register_customer(request):
    email = request.data.get("email")
    name = request.data.get("name")
    phone = request.data.get("phone")
    password = request.data.get("password")
    otp = request.data.get("otp")

    if not all([email, name, phone, password, otp]):
        return Response({"error": "All fields are required"}, status=400)

    # Verify OTP
    record = EmailOTP.objects.filter(email=email, otp=otp).last()

    if not record or not record.is_valid():
        return Response({"error": "Invalid or expired OTP"}, status=400)

    if Customer.objects.filter(email=email).exists():
        return Response({"error": "Email already registered"}, status=400)

    customer = Customer.objects.create(
        email=email,
        name=name,
        phone=phone,
        password=make_password(password),
        is_verified=True
    )

    # Delete OTP after successful verification
    record.delete()

    return Response({
        "id": customer.id,
        "email": customer.email,
        "name": customer.name
    }, status=201)

class CustomerLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CustomerLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        customer = serializer.validated_data["customer"]

        return Response({
            "id": customer.id,
            "email": customer.email,
            "name": customer.name
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




