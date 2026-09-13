from rest_framework import viewsets
from .models import COA
from .serializers import COASerializer
class COAViewSet(viewsets.ModelViewSet):
    queryset = COA.objects.all()
    serializer_class = COASerializer
