# Generated by Django 5.1.1 on 2024-10-04 14:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0002_post_url_alter_post_content"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="post",
            name="url",
        ),
        migrations.AddField(
            model_name="post",
            name="link",
            field=models.URLField(blank=True, unique=True),
        ),
    ]