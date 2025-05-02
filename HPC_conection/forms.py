from django import forms

class ScriptForm(forms.Form):
    code = forms.CharField(widget=forms.Textarea, label="Enter Python Script")
