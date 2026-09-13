from rest_framework import serializers
from .models import COA
class COASerializer(serializers.ModelSerializer):
    class Meta:
        model = COA
        fields = ['id', 'kode', 'nama', 'kategori', 'saldo', 'created_at', 'updated_at']
