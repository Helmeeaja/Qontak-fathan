from django.core.mail import send_mail
from django.db import transaction
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Company, ProductionSetting, Role
from .permissions import IsManager, IsManagerOrReadOnly
from .serializers import (
    AgentCreateSerializer,
    CompanySerializer,
    EmailTokenObtainPairSerializer,
    InviteMemberSerializer,
    MemberSerializer,
    ProductionSettingSerializer,
    RegisterSerializer,
    RoleSerializer,
    UserSerializer,
)

User = get_user_model()


class EmailTokenObtainPairView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = EmailTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Registration successful."}, status=status.HTTP_201_CREATED)


class ProfileView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user, context={"request": request}).data)

    def put(self, request):
        user = request.user
        for field in ("first_name", "last_name", "email", "phone"):
            if field in request.data:
                setattr(user, field, request.data[field])
        if "avatar" in request.FILES:
            user.avatar = request.FILES["avatar"]
        user.save()
        return Response(UserSerializer(user, context={"request": request}).data)


class CompanyDetailView(APIView):
    permission_classes = [IsManagerOrReadOnly]

    def get(self, request):
        serializer = CompanySerializer(request.user.company, context={"request": request})
        return Response(serializer.data)

    def put(self, request):
        serializer = CompanySerializer(
            request.user.company, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class DashboardStatsView(APIView):
    def get(self, request):
        company = request.user.company
        users = User.objects.filter(company=company) if company else User.objects.none()
        agents = users.filter(role="AGENT")
        managers = users.filter(role="MANAGER")
        return Response({
            "company_name": company.name if company else "",
            "total_users": users.count(),
            "total_agents": agents.count(),
            "total_managers": managers.count(),
        })


class AgentViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsManager]

    def get_queryset(self):
        return User.objects.filter(company=self.request.user.company, role="AGENT").order_by("first_name", "last_name")

    def create(self, request, *args, **kwargs):
        serializer = AgentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        agent = User.objects.create_user(
            username=data["username"],
            email=data["email"],
            password=data["password"],
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            phone=data.get("phone", ""),
            company=request.user.company,
            role="AGENT",
        )
        if data.get("avatar"):
            agent.avatar = data["avatar"]
            agent.save(update_fields=["avatar"])
        return Response(UserSerializer(agent, context={"request": request}).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        agent = self.get_object()
        for field in ("first_name", "last_name", "email", "phone"):
            if field in request.data:
                setattr(agent, field, request.data[field])
        if "avatar" in request.FILES:
            agent.avatar = request.FILES["avatar"]
        agent.save()
        return Response(UserSerializer(agent, context={"request": request}).data)

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MemberViewSet(viewsets.ModelViewSet):
    serializer_class = MemberSerializer
    permission_classes = [IsManager]

    def get_queryset(self):
        return (
            User.objects.filter(company=self.request.user.company)
            .prefetch_related("roles")
            .order_by("username")
        )

    def create(self, request, *args, **kwargs):
        serializer = InviteMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        member = User.objects.create_user(
            username=d["username"],
            email=d.get("email", ""),
            password=None,  # unusable password; user set sendiri lewat undangan
            company=request.user.company,
            role="AGENT",
            status="invited",
            type=d.get("type", "member"),
            access_time_limit=d.get("access_time_limit", ""),
            role_config=d.get("role_config", {}),
        )
        if d.get("roles"):
            member.roles.set(d["roles"])
        return Response(MemberSerializer(member).data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        member = self.get_object()
        for field in ("status", "type", "access_time_limit", "email", "role_config"):
            if field in request.data:
                setattr(member, field, request.data[field])
        member.save()
        if "roles" in request.data:
            ids = (
                request.data.getlist("roles")
                if hasattr(request.data, "getlist")
                else request.data["roles"]
            )
            member.roles.set(Role.objects.filter(id__in=ids))
        return Response(MemberSerializer(member).data)

    def destroy(self, request, *args, **kwargs):
        member = self.get_object()
        if member.role == "MANAGER" or member == request.user:
            return Response(
                {"detail": "Owner tidak dapat dihapus."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        member.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["post"], url_path="resend-invitation")
    def resend_invitation(self, request, pk=None):
        member = self.get_object()
        if member.status != "invited":
            return Response(
                {"detail": "Hanya user berstatus invited yang bisa dikirim ulang."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not member.email:
            return Response(
                {"detail": "User ini tidak punya email."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        send_mail(
            subject="Undangan bergabung",
            message=f"Halo {member.username}, kamu diundang bergabung ke {member.company.name}.",
            from_email=None,
            recipient_list=[member.email],
        )
        return Response({"detail": "Undangan berhasil dikirim ulang."})

    @action(detail=True, methods=["post"], url_path="transfer-ownership")
    def transfer_ownership(self, request, pk=None):
        new_owner = self.get_object()
        current = request.user
        if request.data.get("confirm") != "TRANSFER":
            return Response(
                {"detail": "Konfirmasi tidak valid."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if new_owner == current or new_owner.status != "active":
            return Response(
                {"detail": "Pemilik baru harus user aktif lain."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        with transaction.atomic():
            new_owner.role = "MANAGER"
            new_owner.save(update_fields=["role"])
            current.role = "AGENT"
            current.save(update_fields=["role"])
        return Response({"detail": "Kepemilikan berhasil dialihkan."})


class RoleViewSet(viewsets.ModelViewSet):
    serializer_class = RoleSerializer
    permission_classes = [IsManager]

    def get_queryset(self):
        return Role.objects.all().order_by("name")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        role = serializer.save()
        return Response(self.get_serializer(role).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        role = self.get_object()
        if role.is_default:
            return Response(
                {"detail": "Role bawaan tidak dapat dihapus."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        role.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProductionSettingDetailView(APIView):
    permission_classes = [IsManagerOrReadOnly]

    def get(self, request):
        setting, _created = ProductionSetting.objects.get_or_create(pk=1)
        return Response(ProductionSettingSerializer(setting).data)

    def put(self, request):
        setting, _created = ProductionSetting.objects.get_or_create(pk=1)
        serializer = ProductionSettingSerializer(setting, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)