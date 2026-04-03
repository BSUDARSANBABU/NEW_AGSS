from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DeveloperViewSet,
    InterviewProcessViewSet,
    JobViewSet,
    ProjectViewSet,
    ProjectImageViewSet,
    ResourceViewSet,
    DemoBookingCreateView,
    ClientViewSet,
    PerformanceReviewViewSet, 
    JobApplicationViewSet,
    send_otp,
    verify_otp,
    register_customer,
    customer_login,
    CustomerViewSet,
    CustomerLoginView,
    JobViewSet,
    DocumentationViewSet,
    SiteSettingsViewSet,
    InterviewProcessViewSet,
    reset_customer_password,
    FooterViewSet
)

router = DefaultRouter()
router.register(r'developers', DeveloperViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'projects/(?P<project_pk>\d+)/images', ProjectImageViewSet, basename='project-images')
router.register(r'resources', ResourceViewSet)
router.register(r'BookDemo', DemoBookingCreateView)
router.register(r'demo-bookings', DemoBookingCreateView)
router.register(r'clients', ClientViewSet, basename='clients')
router.register(r'performance-reviews',PerformanceReviewViewSet,basename='performance-review')
router.register(r'jobs', JobViewSet)
router.register(r'job-applications', JobApplicationViewSet)
router.register("customers", CustomerViewSet)
router.register("documentation", DocumentationViewSet, basename="documentation")
router.register("site-settings", SiteSettingsViewSet, basename="site-settings")
router.register(r'interview-process', InterviewProcessViewSet)
router.register(r'footer', FooterViewSet, basename='footer')

urlpatterns = [
    path('', include(router.urls)),
    path('send-otp/', send_otp, name='send_otp'),
    path('verify-otp/', verify_otp, name='verify_otp'),
    path("customer/register/", register_customer),
    path("customer/login/", CustomerLoginView.as_view()),
    path("send-otp/", send_otp),
    path("reset-customer-password/", reset_customer_password),
]
