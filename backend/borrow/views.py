from rest_framework import viewsets, status
from .models import Borrow
from .serializers import BorrowSerializer
from rest_framework.response import Response
from django.utils import timezone
from books.models import Book
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend


class BorrowViewSet(viewsets.ModelViewSet):
    queryset = Borrow.objects.all()
    serializer_class = BorrowSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']

    # 🔥 BORROW BOOK
    def create(self, request, *args, **kwargs):
        user = request.user
        book_id = request.data.get("book")

        try:
            book = Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=404)

        # ❌ No copies available
        if book.available_copies <= 0:
            return Response({"error": "No copies available"}, status=400)

        # ❌ Already borrowed (optional restriction)
        already = Borrow.objects.filter(user=user, book=book, status='borrowed')
        if already.exists():
            return Response({"error": "You already borrowed this book"}, status=400)

        # ✅ Reduce available copies
        book.available_copies -= 1
        book.save()

        borrow = Borrow.objects.create(
            user=user,
            book=book,
            return_due=timezone.now() + timezone.timedelta(days=7),
            status='borrowed'
        )

        serializer = self.get_serializer(borrow)
        return Response(serializer.data, status=201)

    # 🔥 RETURN BOOK
    @action(detail=True, methods=['post'])
    def return_book(self, request, pk=None):
        borrow = self.get_object()

        if borrow.status == 'returned':
            return Response({"error": "Already returned"}, status=400)

        borrow.status = 'returned'
        borrow.returned_at = timezone.now()
        borrow.save()

        # ✅ Increase available copies
        book = borrow.book
        book.available_copies += 1
        book.save()

        return Response({"message": "Book returned successfully"})

    @action(detail=False, methods=['get'])
    def my_books(self, request):
        borrow = Borrow.objects.filter(user=request.user)
        serializer = self.get_serializer(borrow, many=True)
        return Response(serializer.data)