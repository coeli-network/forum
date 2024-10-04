from django import forms


class SubmitForm(forms.Form):
    title = forms.CharField(max_length=200)
    link = forms.URLField(required=False)
    content = forms.CharField(widget=forms.Textarea)
