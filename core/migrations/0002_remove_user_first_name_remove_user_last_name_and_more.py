# Generated by Django 5.1.1 on 2024-10-08 01:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="first_name",
        ),
        migrations.RemoveField(
            model_name="user",
            name="last_name",
        ),
        migrations.RemoveField(
            model_name="user",
            name="password",
        ),
        migrations.AlterField(
            model_name="user",
            name="email",
            field=models.CharField(max_length=254, null=True),
        ),
    ]
