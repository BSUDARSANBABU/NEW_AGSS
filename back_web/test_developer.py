#!/usr/bin/env python
import os
import sys
import django
from django.conf import settings

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'devhub_backend.settings')

import django
from django.core.management import execute_from_command_line

def test_developer_serializer():
    """Test the Developer serializer directly"""
    try:
        from core_api.serializers import DeveloperSerializer
        from core_api.models import Developer
        
        # Test data
        test_data = {
            'name': 'Test Developer',
            'title': 'Test Engineer',
            'bio': 'Test bio',
            'skills': 'Python, Django',
            'experience_years': 5,
            'github_link': 'https://github.com/test',
            'linkedin_link': 'https://linkedin.com/in/test',
            'is_active': True
        }
        
        # Create serializer instance
        serializer = DeveloperSerializer(data=test_data)
        
        # Test validation
        if serializer.is_valid():
            print("✅ Serializer validation passed")
            print(f"Validated data: {serializer.validated_data}")
            
            # Test create
            try:
                instance = serializer.save()
                print(f"✅ Developer created: {instance}")
                return True
            except Exception as e:
                print(f"❌ Error creating developer: {e}")
                return False
        else:
            print(f"❌ Serializer validation failed: {serializer.errors}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing serializer: {e}")
        return False

if __name__ == '__main__':
    test_developer_serializer()
