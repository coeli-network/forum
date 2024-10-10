import secrets

from django import forms
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import LoginView
from django.core.paginator import Paginator
from django.db.models import Count
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods

from .forms import PostCreateForm, UserRegisterForm
from .models import Comment, Post, User


# home
@require_GET
def index(request):
    latest_posts = Post.objects.order_by("-created_at").annotate(
        comment_count=Count("comment")
    )
    paginator = Paginator(latest_posts, 20)  # Show 20 posts per page
    page_number = request.GET.get("page", 1)
    page_obj = paginator.get_page(page_number)

    context = {"page_obj": page_obj}

    if request.htmx:
        return render(request, "core/partials/post_list.html", context)
    return render(request, "core/index.html", context)


# users
def user_detail(request, id):
    user = User.objects.get(id=id)
    return render(request, "core/users/user_detail.html", {"user": user})


@csrf_exempt
def user_login(request):
    if request.method == "GET":
        challenge = secrets.token_hex(16)
        request.session["login_challenge"] = challenge
        return render(request, "core/users/login.html", {"challenge": challenge})
    elif request.method == "POST":
        import json

        data = json.loads(request.body)
        urbit_id = data.get("urbitId")
        public_key = data.get("publicKey")
        signature = data.get("signature")
        challenge = request.session.get("login_challenge")

        # Verify the signature (you'll need to implement this function)
        if verify_signature(public_key, challenge, signature):
            try:
                user = User.objects.get(id=int(urbit_id, 32))
                if user.public_key == public_key:
                    login(request, user)
                    return JsonResponse({"success": True, "redirect": "/"})
                else:
                    return JsonResponse(
                        {"success": False, "error": "Invalid public key"}
                    )
            except User.DoesNotExist:
                return JsonResponse({"success": False, "error": "User not found"})
        else:
            return JsonResponse({"success": False, "error": "Invalid signature"})

    return JsonResponse({"success": False, "error": "Invalid request method"})


def verify_signature(public_key, message, signature):
    # Implement signature verification here
    # This is a placeholder and should be replaced with actual verification logic
    return True


def user_logout(request):
    logout(request)
    return redirect("index")


def user_register(request):
    if request.method == "POST":
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data["username"]
            email = form.cleaned_data["email"]
            password = form.cleaned_data["password1"]
            user = User.objects.create_user(
                username=username, email=email, password=password
            )
            login(request, user)
            return redirect("index")
    else:
        form = UserRegisterForm()
    return render(request, "core/users/register.html", {"form": form})


# posts
@login_required
@require_http_methods(["GET", "POST"])
def post_create(request):
    if request.method == "POST":
        form = PostCreateForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            return redirect("post_detail", id=post.id)
    else:
        form = PostCreateForm()

    context = {"form": form}
    return render(request, "core/posts/post_create.html", context)


def post_detail(request, id):
    post = Post.objects.get(id=id)
    comment_form = CommentForm()
    return render(
        request,
        "core/posts/post_detail.html",
        {"post": post, "comment_form": comment_form},
    )


# comments
@login_required
@require_http_methods(["POST"])
def comment_create(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    form = CommentForm(request.POST)
    if form.is_valid():
        comment = Comment.objects.create(
            post=post, author=request.user, content=form.cleaned_data["content"]
        )
        if request.htmx:
            comments = post.comment_set.all()
            return render(
                request, "core/partials/comment_list.html", {"comments": comments}
            )
        return redirect("post_detail", id=post_id)
    if request.htmx:
        return HttpResponse("Error: Invalid form submission", status=400)
    return HttpResponseBadRequest("Invalid request")


class CommentForm(forms.Form):
    content = forms.CharField(
        widget=forms.Textarea(attrs={"placeholder": "Write your comment here..."}),
        label="",  # This removes the label
    )
