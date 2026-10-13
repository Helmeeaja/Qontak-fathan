from django.db import models
from django.contrib.auth.models import AbstractUser


class Company(models.Model):
    name = models.CharField(max_length=255)

    company_email = models.EmailField(blank=True, default="")
    phone = models.CharField(max_length=20, blank=True, default="")
    industry = models.CharField(max_length=100, blank=True, default="")
    industry_other = models.CharField(max_length=100, blank=True, default="")
    address = models.TextField(blank=True, default="")
    province = models.CharField(max_length=100, blank=True, default="")
    city = models.CharField(max_length=100, blank=True, default="")
    postal_code = models.CharField(max_length=10, blank=True, default="")
    company_size = models.CharField(max_length=20, blank=True, default="")

    bank_name = models.CharField(max_length=100, blank=True, default="")
    swift_code = models.CharField(max_length=11, blank=True, default="")
    branch_office = models.CharField(max_length=150, blank=True, default="")
    branch_address = models.CharField(max_length=200, blank=True, default="")
    account_number = models.CharField(max_length=30, blank=True, default="")
    account_holder = models.CharField(max_length=150, blank=True, default="")

    logo = models.ImageField(upload_to="company_logos/", blank=True, null=True)
    fax = models.CharField(max_length=20, blank=True, default="")
    shipping_address = models.CharField(max_length=200, blank=True, default="")
    billing_address = models.CharField(max_length=200, blank=True, default="")
    tin = models.CharField(max_length=30, blank=True, default="")
    website = models.URLField(blank=True, default="")
    email = models.EmailField(blank=True, default="")
    show_logo_in_report = models.BooleanField(default=False)

    feature_approval = models.BooleanField(default=True)
    feature_multiple_withholding = models.BooleanField(default=False)
    feature_performance_summary = models.BooleanField(default=True)
    feature_tax_inclusive = models.BooleanField(default=False)
    feature_transaction_tag = models.BooleanField(default=True)
    feature_multicurrency = models.BooleanField(default=False)

    base_currency = models.CharField(max_length=50, default="IDR")
    currency_format = models.CharField(max_length=50, blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Role(models.Model):
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default="")
    is_default = models.BooleanField(default=False)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class RoleAuthority(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name="authorities")
    feature = models.CharField(max_length=100)
    sub_feature = models.CharField(max_length=100)
    see = models.BooleanField(default=False)
    create = models.BooleanField(default=False)
    edit = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)

    class Meta:
        unique_together = [("role", "feature", "sub_feature")]

    def __str__(self):
        return f"{self.role.name} - {self.feature} - {self.sub_feature}"


class ProductionSetting(models.Model):
    PLAN_DATE_MODES = [
        ("required", "required"),
        ("optional", "optional"),
        ("hidden", "hidden"),
    ]

    production_plan_date_mode = models.CharField(
        max_length=10, choices=PLAN_DATE_MODES, default="required"
    )
    allow_backdated_plan_date = models.BooleanField(default=False)
    allow_partial_production = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.pk and ProductionSetting.objects.exists():
            raise ValueError("ProductionSetting sudah ada (single-row table)")
        super().save(*args, **kwargs)

    def __str__(self):
        return "Production setting"


class CustomUser(AbstractUser):
    roles = models.ManyToManyField(Role, blank=True, related_name="users")
    ROLE_CHOICES = [
        ("MANAGER", "Sales Manager"),
        ("AGENT", "Sales Agent"),
    ]
    STATUS_CHOICES = [
        ("invited", "invited"),
        ("active", "active"),
        ("inactive", "inactive"),
    ]
    TYPE_CHOICES = [
        ("member", "member"),
        ("partner", "partner"),
    ]

    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="users", null=True, blank=True
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="AGENT")
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="active")
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default="member")
    access_time_limit = models.CharField(max_length=255, blank=True, default="")

    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"

    @property
    def avatar_url(self):
        if self.avatar:
            return self.avatar.url
        return None
