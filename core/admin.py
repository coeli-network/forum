from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from . import models

admin.site.register(models.User, UserAdmin)
admin.site.register(models.Post)
admin.site.register(models.Comment)
admin.site.register(models.Vote)
