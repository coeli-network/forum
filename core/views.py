from django.http import HttpResponseRedirect
from django.shortcuts import render

from .forms import SubmitForm
from .models import Post


def index(request):
    latest_posts = Post.objects.order_by("-created_at")[:100]
    return render(request, "core/index.html", {"posts": latest_posts})


def submit(request):
    if request.method == "POST":
        form = SubmitForm(request.POST)
        if form.is_valid():
            post = Post(
                title=form.cleaned_data["title"],
                link=form.cleaned_data["link"],
                content=form.cleaned_data["content"],
            )
            post.save()
            return HttpResponseRedirect("/")
    form = SubmitForm()
    return render(request, "core/submit.html", {"form": form})
