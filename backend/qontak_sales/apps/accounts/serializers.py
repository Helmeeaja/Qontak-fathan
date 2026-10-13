from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Company, ProductionSetting, Role, RoleAuthority

User = get_user_model()


class RoleAuthoritySerializer(serializers.ModelSerializer):
    class Meta:
        model = RoleAuthority
        fields = ["id", "feature", "sub_feature", "see", "create", "edit", "can_delete"]


class RoleSerializer(serializers.ModelSerializer):
    authorities = RoleAuthoritySerializer(many=True, required=False)

    class Meta:
        model = Role
        fields = ["id", "code", "name", "description", "is_default", "authorities"]

    def create(self, validated_data):
        authorities = validated_data.pop("authorities", [])
        role = Role.objects.create(**validated_data)
        for authority in authorities:
            RoleAuthority.objects.create(role=role, **authority)
        return role


class ProductionSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionSetting
        fields = [
            "id",
            "production_plan_date_mode",
            "allow_backdated_plan_date",
            "allow_partial_production",
        ]


class CompanySerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = [
            "id", "name", "created_at", "updated_at",
            "company_email", "phone", "industry", "industry_other",
            "address", "province", "city", "postal_code", "company_size",
            "bank_name", "swift_code", "branch_office", "branch_address",
            "account_number", "account_holder",
            "logo", "logo_url", "fax",
            "shipping_address", "billing_address", "tin", "website", "email",
            "show_logo_in_report",
            "feature_approval", "feature_multiple_withholding",
            "feature_performance_summary", "feature_tax_inclusive",
            "feature_transaction_tag", "feature_multicurrency",
            "base_currency", "currency_format",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "logo_url"]

    def get_logo_url(self, obj):
        request = self.context.get("request")
        if obj.logo and request:
            return request.build_absolute_uri(obj.logo.url)
        return None


class UserSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.name", read_only=True)
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "first_name", "last_name",
            "role", "company", "company_name", "avatar", "avatar_url", "phone",
        ]
        read_only_fields = ["id", "role", "avatar_url", "company"]

    def get_avatar_url(self, obj):
        request = self.context.get("request")
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    company_name = serializers.CharField(max_length=255)

    def validate_email(self, value):
        value = value.lower().strip()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value

    def create(self, validated_data):
        company = Company.objects.create(name=validated_data["company_name"].strip())
        name_parts = validated_data["name"].strip().split()
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=name_parts[0] if name_parts else "",
            last_name=" ".join(name_parts[1:]),
            company=company,
            role="MANAGER",
        )
        return user


class AgentCreateSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True, default="")
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True, default="")
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True, default="")
    avatar = serializers.ImageField(required=False, allow_null=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value.lower().strip()


class InviteMemberSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(required=False, allow_blank=True, default="")
    type = serializers.ChoiceField(choices=["member", "partner"], default="member")
    access_time_limit = serializers.CharField(max_length=255, required=False, allow_blank=True, default="")
    roles = serializers.ListField(
        child=serializers.PrimaryKeyRelatedField(queryset=Role.objects.all()),
        required=False,
    )

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if not value:
            return value
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value.lower().strip()


class MemberSerializer(serializers.ModelSerializer):
    roles = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Role.objects.all(), required=False
    )

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "first_name", "last_name",
            "status", "type", "access_time_limit", "role", "roles",
        ]
        read_only_fields = ["id", "role"]

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email", "").strip().lower()
        password = attrs.get("password", "")
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")
        if not user.check_password(password):
            raise serializers.ValidationError("Invalid email or password.")
        if not user.is_active:
            raise serializers.ValidationError("Account is disabled.")
        refresh = RefreshToken.for_user(user)
        return {"refresh": str(refresh), "access": str(refresh.access_token)}
