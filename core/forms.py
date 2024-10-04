from django import forms
from django.core.exceptions import ValidationError

from .models import Post


class PostCreateForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ["title", "link", "content"]

    def clean(self):
        cleaned_data = super().clean()
        link = cleaned_data.get("link")
        content = cleaned_data.get("content")

        if not link and not content:
            raise ValidationError("At least one of link or content must be provided.")

        return cleaned_data


class UserRegisterForm(forms.Form):
    username = forms.CharField(max_length=150)
    email = forms.EmailField()
    password1 = forms.CharField(widget=forms.PasswordInput, label="Password")
    password2 = forms.CharField(widget=forms.PasswordInput, label="Confirm Password")

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")

        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords do not match")

        return cleaned_data
