from django.db import models

class Form(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    schema = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class FormSubmission(models.Model):
    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name="submissions")
    answers = models.JSONField()
    submitted_at = models.DateTimeField(auto_now_add=True)
