# Add sample performance reviews
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'devhub_backend.settings')
django.setup()

from core_api.models import PerformanceReview, Project

# Create sample projects if they don't exist
projects = Project.objects.all()[:3]
if not projects:
    Project.objects.create(title='E-Commerce Platform', description='Modern e-commerce solution', technologies_used='React, Django, PostgreSQL')
    Project.objects.create(title='Mobile Banking App', description='Secure banking application', technologies_used='React Native, Node.js')
    Project.objects.create(title='AI Analytics Dashboard', description='Data analytics platform', technologies_used='Python, TensorFlow, React')
    projects = Project.objects.all()[:3]

# Sample performance reviews
review_data = [
    {
        'reviewer_name': 'Sarah Johnson',
        'rating': 5,
        'feedback': 'Exceptional performance on the e-commerce platform project. Delivered high-quality code ahead of schedule and provided excellent technical leadership to the team.',
        'review_period': 'Q1 2026'
    },
    {
        'reviewer_name': 'Michael Chen',
        'rating': 4,
        'feedback': 'Strong technical skills and great problem-solving abilities. Successfully implemented complex features for the mobile banking app with attention to security requirements.',
        'review_period': 'Q1 2026'
    },
    {
        'reviewer_name': 'Emily Rodriguez',
        'rating': 5,
        'feedback': 'Outstanding contribution to the AI analytics dashboard. Demonstrated expertise in machine learning integration and created innovative solutions that exceeded client expectations.',
        'review_period': 'Q4 2025'
    },
    {
        'reviewer_name': 'David Kim',
        'rating': 4,
        'feedback': 'Reliable team member with solid development skills. Consistently delivers clean, maintainable code and actively participates in code reviews.',
        'review_period': 'Q4 2025'
    },
    {
        'reviewer_name': 'Jessica Taylor',
        'rating': 5,
        'feedback': 'Exceptional performance across multiple projects. Excellent communication skills and technical expertise. Goes above and beyond to ensure project success.',
        'review_period': 'Q1 2026'
    },
    {
        'reviewer_name': 'Robert Anderson',
        'rating': 4,
        'feedback': 'Strong analytical skills and attention to detail. Successfully optimized database performance resulting in significant performance improvements.',
        'review_period': 'Q4 2025'
    }
]

# Create reviews
for i, data in enumerate(review_data):
    review, created = PerformanceReview.objects.get_or_create(
        reviewer_name=data['reviewer_name'],
        rating=data['rating'],
        feedback=data['feedback'],
        review_period=data['review_period'],
        project=projects[i % len(projects)]
    )
    if created:
        print(f'Created review: {data["reviewer_name"]} - Rating: {data["rating"]}')

print(f'Total performance reviews: {PerformanceReview.objects.count()}')
print(f'High-rating reviews (4+): {PerformanceReview.objects.filter(rating__gte=4).count()}')
