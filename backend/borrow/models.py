from django.db import models
from django.conf import settings
from books.models import Book

class Borrow(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    borrowed_at = models.DateTimeField(auto_now_add=True)
    return_due = models.DateTimeField()
    returned_at = models.DateTimeField(null=True, blank=True)

    status = models.CharField(max_length=20, default='borrowed')