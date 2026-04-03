# Generated migration for making PerformanceReview.project optional

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core_api', '0004_footer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='performancereview',
            name='project',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='reviews',
                to='core_api.project'
            ),
        ),
    ]
