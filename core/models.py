import urbitob as ob
from django.contrib.auth.models import AbstractUser, User
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class User(AbstractUser):
    id = models.PositiveIntegerField(
        primary_key=True,
        validators=[MinValueValidator(0), MaxValueValidator(2**32 - 1)],
        help_text="Urbit ID",
    )
    public_key = models.CharField(
        max_length=42, unique=True, help_text="Ethereum wallet address"
    )
    patp = models.CharField(
        max_length=14,
        unique=True,
        editable=False,
        help_text="Pronounceable version of the Urbit ID",
    )
    username = models.CharField(max_length=150, unique=True, null=True)
    password = None
    first_name = None
    last_name = None
    email = models.CharField(max_length=254, null=True)

    def save(self, *args, **kwargs):
        if not self.patp:
            self.patp = ob.patp(self.id)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.patp}"


class Post(models.Model):
    title = models.CharField(max_length=200, blank=True)
    link = models.URLField(blank=True)
    content = models.TextField(blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if not self.link and not self.content:
            raise ValidationError("At least one of link or content must be provided")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="replies"
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.content


class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} voted on {self.post.title}"
