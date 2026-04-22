from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    is_member = models.BooleanField(default=True)
    joined_at = models.DateTimeField(auto_now_add=True)