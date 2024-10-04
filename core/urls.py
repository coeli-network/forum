from django.urls import path

from . import views

urlpatterns = [
    # home
    path("", views.index, name="index"),
    # auth
    path("login/", views.user_login, name="login"),
    path("logout/", views.user_logout, name="logout"),
    path("register/", views.user_register, name="register"),
    # users
    path("users/<int:id>", views.user_detail, name="profile"),
    # posts
    path("posts/create", views.post_create, name="post_create"),
    path("posts/<int:id>/", views.post_detail, name="post_detail"),
    # comments
    path("posts/<int:post_id>/comment/", views.comment_create, name="comment_create"),
]
