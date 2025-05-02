from django.urls import path
from .views import process_ml_model

urlpatterns = [
    path("process/", process_ml_model, name="process_ml"),
]
