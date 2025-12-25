from rest_framework import generics
from .models import Form, FormSubmission
from .serializers import FormSerializer, FormSubmissionSerializer

class FormListCreateView(generics.ListCreateAPIView):
    queryset = Form.objects.all()
    serializer_class = FormSerializer


class FormDetailView(generics.RetrieveAPIView):
    queryset = Form.objects.all()
    serializer_class = FormSerializer


class FormSubmitView(generics.CreateAPIView):
    serializer_class = FormSubmissionSerializer