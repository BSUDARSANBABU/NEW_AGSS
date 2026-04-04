from django.db import models
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User

# core_api/models.py
from django.contrib.auth.models import User
from django.utils import timezone


# --- Developer Profile ---
class Developer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    bio = models.TextField()
    profile_image = models.ImageField(upload_to="developers/", blank=True, null=True)
    skills = models.CharField(max_length=255)  # React, Django, SQL
    experience_years = models.PositiveIntegerField(default=0)
    github_link = models.URLField(blank=True)
    linkedin_link = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


# --- Project ---
class Project(models.Model):
    developers = models.ManyToManyField(
        Developer, through="ProjectDeveloper", related_name="assigned_projects"
    )

    title = models.CharField(max_length=200)
    description = models.TextField()
    technologies_used = models.CharField(max_length=255)
    project_image = models.ImageField(upload_to="projects/", blank=True, null=True)
    github_repo = models.URLField(blank=True)
    live_link = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# --- Resource (like a Blog/Guide) ---
class Resource(models.Model):
    CATEGORY_CHOICES = [
        ("BLOG", "Blog"),
        ("GUIDE", "Guide"),
        ("TOOL", "Tool / Calculator"),
        ("GLOSSARY", "Glossary Item"),
    ]

    TOOL_CHOICES = [
        ("currency", "Currency Converter"),
        ("gst", "GST Calculator"),
        ("emi", "EMI Calculator"),
    ]

    title = models.CharField(max_length=200)

    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default="BLOG")

    # ✅ Used ONLY when category == TOOL
    tool_type = models.CharField(
        max_length=20, choices=TOOL_CHOICES, null=True, blank=True
    )

    content = models.TextField(blank=True)

    author = models.ForeignKey(
        Developer, on_delete=models.SET_NULL, null=True, blank=True
    )

    thumbnail = models.ImageField(upload_to="resources/", null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    published_on = models.DateField(null=True, blank=True)

    def clean(self):
        if self.category == "TOOL" and not self.tool_type:
            raise ValidationError(
                {"tool_type": "tool_type is required when category is TOOL."}
            )

        if self.category != "TOOL" and self.tool_type:
            raise ValidationError(
                {"tool_type": "tool_type must be empty unless category is TOOL."}
            )

    def __str__(self):
        return f"{self.category}: {self.title}"


@receiver(post_delete, sender=Resource)
def delete_resource_image(sender, instance, **kwargs):
    """
    Delete image file when Resource is deleted
    """
    if instance.thumbnail:
        instance.thumbnail.delete(save=False)


@receiver(pre_save, sender=Resource)
def delete_old_thumbnail_on_change(sender, instance, **kwargs):
    """
    Delete old image file when thumbnail is replaced
    """
    if not instance.pk:
        return  # New object, nothing to delete

    try:
        old = Resource.objects.get(pk=instance.pk)
    except Resource.DoesNotExist:
        return

    if old.thumbnail and old.thumbnail != instance.thumbnail:
        old.thumbnail.delete(save=False)


class DemoBooking(models.Model):

    PROJECT_TYPE_CHOICES = [
        ("web", "Web Development"),
        ("mobile", "Mobile App"),
        ("design", "UI/UX Design"),
        ("consulting", "Consulting"),
        ("other", "Other"),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    preferred_date = models.DateField()
    project_type = models.CharField(
        max_length=20,
        choices=PROJECT_TYPE_CHOICES,
        default="web"
    )
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.project_type}"


class ProjectAsset(models.Model):
    ASSET_TYPE_CHOICES = [
        ("IMAGE", "Image"),
        ("DOCUMENT", "Document"),
        ("VIDEO", "Video"),
        ("OTHER", "Other"),
    ]

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="assets"
    )
    asset_name = models.CharField(max_length=150)
    asset_type = models.CharField(max_length=20, choices=ASSET_TYPE_CHOICES)
    file = models.FileField(upload_to="project_assets/")
    uploaded_by = models.ForeignKey("Developer", on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.asset_name


class ProjectDocument(models.Model):
    DOCUMENT_TYPE_CHOICES = [
        ("REQ", "Requirement"),
        ("DESIGN", "Design"),
        ("REPORT", "Report"),
        ("OTHER", "Other"),
    ]

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="documents"
    )
    title = models.CharField(max_length=200)
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPE_CHOICES)
    file = models.FileField(upload_to="project_documents/")
    version = models.CharField(max_length=20, default="1.0")
    uploaded_by = models.ForeignKey("Developer", on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Timesheet(models.Model):
    developer = models.ForeignKey("Developer", on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    date = models.DateField()
    hours_worked = models.DecimalField(max_digits=5, decimal_places=2)
    task_description = models.TextField()
    is_approved = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.developer} - {self.project} ({self.date})"

class PerformanceReview(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="reviews",
        null=True,
        blank=True
    )

    reviewer_name = models.CharField(max_length=100)
    rating = models.IntegerField()
    feedback = models.TextField()
    review_period = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project.title if self.project else 'General Review'} - {self.rating}"

class Client(models.Model):
    client_name = models.CharField(max_length=100)
    company_name = models.CharField(max_length=150)
    company_address = models.TextField()
    company_description = models.TextField()
    project_description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.company_name


class EmailOTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return timezone.now() - self.created_at < timezone.timedelta(minutes=5)


class Customer(models.Model):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True)
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=128)  # hashed later
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


class Asset(models.Model):
    STATUS_CHOICES = [
        ("Available", "Available"),
        ("In Use", "In Use"),
        ("Maintenance", "Maintenance"),
    ]

    name = models.CharField(max_length=100)
    asset_type = models.CharField(max_length=100)
    assigned_to = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    purchase_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.name


class Document(models.Model):
    title = models.CharField(max_length=150)
    category = models.CharField(max_length=100)
    uploaded_by = models.CharField(max_length=100)
    file = models.FileField(upload_to="documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# models.py


class Job(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    experience_required = models.CharField(max_length=100)
    skills_required = models.TextField()
    location = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title

    def is_expired(self):
        if not self.expires_at:
            return False
        return timezone.now().date() > self.expires_at


# models.py
class JobApplication(models.Model):
    STATUS_CHOICES = [
        ("submitted", "Submitted"),
        ("viewed", "Viewed"),
        ("selected", "Selected"),
        ("rejected", "Rejected"),
    ]

    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    education = models.CharField(max_length=200)
    skill_set = models.TextField()
    certification = models.CharField(max_length=200, blank=True)
    email = models.EmailField()
    contact = models.CharField(max_length=20)
    linkedin_id = models.URLField(blank=True)
    resume = models.FileField(upload_to="resumes/")
    experience = models.CharField(max_length=50)

    # 🔥 NEW FIELDS
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="submitted"
    )
    viewed_at = models.DateTimeField(null=True, blank=True)
    decided_at = models.DateTimeField(null=True, blank=True)

    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} - {self.job.title}"


class ProjectDeveloper(models.Model):

    ROLE_CHOICES = [
        ("FE", "Frontend"),
        ("BE", "Backend"),
        ("FS", "Fullstack"),
        ("UI", "UI/UX"),
        ("QA", "QA"),
        ("PM", "Project Manager"),
    ]

    MEMBER_TYPE = [
        ("LEAD", "Team Lead"),
        ("MEMBER", "Team Member"),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    developer = models.ForeignKey(Developer, on_delete=models.CASCADE)

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    member_type = models.CharField(
        max_length=10,
        choices=MEMBER_TYPE,
            default="MEMBER"
    )

    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("project", "developer")

class Documentation(models.Model):

    id = models.BigAutoField(primary_key=True)

    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    file = models.FileField(upload_to="documentations/")

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    uploaded_by = models.CharField(max_length=100,default="Admin")

    category = models.CharField(max_length=100, blank=True)

# models.py

class SiteSettings(models.Model):
    logo = models.ImageField(upload_to="site/", blank=True, null=True)
    heading = models.CharField(max_length=200, blank=True)
    subheading = models.TextField(blank=True)
    hero_heading = models.TextField(blank=True, help_text="Main heading for hero section")
    hero_subheading = models.TextField(blank=True, help_text="Subheading for hero section")
    hero_image = models.ImageField(upload_to="site/hero/", blank=True, null=True, help_text="Right side image for hero section")
    
    # Hero Buttons
    hero_button1_text = models.CharField(max_length=100, blank=True, default="Initiate Deployment")
    hero_button1_url = models.CharField(max_length=200, blank=True, default="/admin")
    hero_button1_is_primary = models.BooleanField(default=True, help_text="Make this the primary button")
    
    hero_button2_text = models.CharField(max_length=100, blank=True, default="View Technical Specs")
    hero_button2_url = models.CharField(max_length=200, blank=True, default="#")
    hero_button2_is_primary = models.BooleanField(default=False, help_text="Make this the primary button")
    
    # Hero Styling Settings
    hero_heading_font_family = models.CharField(max_length=100, blank=True, default="Inter, sans-serif", help_text="Font family for hero heading")
    hero_heading_font_size = models.CharField(max_length=20, blank=True, default="4rem", help_text="Font size for hero heading (e.g., 4rem, 64px)")
    hero_subheading_font_family = models.CharField(max_length=100, blank=True, default="Inter, sans-serif", help_text="Font family for hero subheading")
    hero_subheading_font_size = models.CharField(max_length=20, blank=True, default="1.125rem", help_text="Font size for hero subheading (e.g., 1.125rem, 18px)")
    hero_image_width = models.CharField(max_length=20, blank=True, default="100%", help_text="Width for hero image (e.g., 100%, 500px)")
    hero_image_height = models.CharField(max_length=20, blank=True, default="auto", help_text="Height for hero image (e.g., auto, 400px)")
    
    site_name = models.CharField(max_length=200, blank=True, default="AI Developer Platform")
    before_logo = models.CharField(max_length=200, blank=True, default="Innovate • Build • Deploy")
    favicon = models.URLField(blank=True, null=True)
    main_heading = models.CharField(max_length=200, blank=True, default="Welcome to Our Platform")
    project_display_name = models.CharField(max_length=200, blank=True, default="Portfolio Projects")

    def __str__(self):
        return "Site Settings"

class ProjectImage(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="project_images"
    )
    image = models.ImageField(upload_to="project_images/")
    alt_text = models.CharField(max_length=200, blank=True)
    is_featured = models.BooleanField(default=False)  # Primary image for the project
    created_at = models.DateTimeField(auto_now_add=True)
    order = models.PositiveIntegerField(default=0)  # For ordering images

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.project.title} - Image {self.id}"


class Footer(models.Model):
    """Footer contact and company information"""
    email = models.EmailField(max_length=254, help_text="Contact email address")
    phone = models.CharField(max_length=20, blank=True, help_text="Contact phone number")
    address = models.TextField(blank=True, help_text="Company address")
    company_description = models.TextField(blank=True, help_text="Company description for footer")
    social_links = models.JSONField(default=dict, blank=True, help_text="Social media links as JSON")
    copyright_text = models.CharField(max_length=200, blank=True, help_text="Copyright text")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Footer Settings - {self.email}"

    class Meta:
        verbose_name = "Footer Setting"
        verbose_name_plural = "Footer Settings"


@receiver(post_delete, sender=ProjectImage)
def delete_project_image_file(sender, instance, **kwargs):
    """
    Delete image file when ProjectImage is deleted
    """
    if instance.image:
        instance.image.delete(save=False)


class InterviewProcess(models.Model):
    job = models.ForeignKey(
        "Job",
        on_delete=models.CASCADE,
        related_name="interview_rounds"
    )

    round_number = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()

    class Meta:
        ordering = ["round_number"]
