from django.core.management.base import BaseCommand
from core_api.models import PerformanceReview


class Command(BaseCommand):
    help = 'Clear all mock review data from the database'

    def handle(self, *args, **options):
        # Count existing reviews
        review_count = PerformanceReview.objects.count()
        
        if review_count == 0:
            self.stdout.write(self.style.WARNING('No reviews found in database.'))
            return
        
        # Ask for confirmation
        confirm = input(f'Are you sure you want to delete {review_count} review(s)? Type "yes" to confirm: ')
        
        if confirm.lower() == 'yes':
            # Delete all reviews
            deleted_count, _ = PerformanceReview.objects.all().delete()
            self.stdout.write(self.style.SUCCESS(f'Successfully deleted {deleted_count} review(s) from database.'))
        else:
            self.stdout.write(self.style.WARNING('Operation cancelled.'))
