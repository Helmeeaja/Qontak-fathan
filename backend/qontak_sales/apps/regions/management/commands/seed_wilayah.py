import glob
import json
import os

from django.core.management.base import BaseCommand
from django.db import transaction

from qontak_sales.apps.regions.models import City, District, Province, Village


class Command(BaseCommand):
    help = "Isi data wilayah Indonesia (provinsi, kota/kab, kecamatan, kelurahan) + kode pos dari dataset GitHub"

    def add_arguments(self, parser):
        parser.add_argument(
            "--kodepos",
            type=str,
            default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "kodepos.json"),
            help="Path file JSON mapping kode wilayah level 4 -> kode pos",
        )

    @transaction.atomic
    def handle(self, *args, **kwargs):
        base = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
        fe_src = "/home/hilmi/QontakSales/frontend/src/data"
        fe_public = "/home/hilmi/QontakSales/frontend/public/data"

        provinsi = json.load(open(os.path.join(fe_src, "provinsi.json"), encoding="utf-8"))
        kota = json.load(open(os.path.join(fe_src, "kabupaten_kota.json"), encoding="utf-8"))
        kecamatan = json.load(open(os.path.join(fe_public, "kecamatan.json"), encoding="utf-8"))

        kelurahan = []
        for f in sorted(glob.glob(os.path.join(fe_public, "kelurahan", "*.json"))):
            kelurahan += json.load(open(f, encoding="utf-8"))

        kodepos_path = kwargs["kodepos"]
        kodepos = {}
        if os.path.exists(kodepos_path):
            kodepos = json.load(open(kodepos_path, encoding="utf-8"))
            self.stdout.write(f"Loaded {len(kodepos)} kode pos dari {kodepos_path}")
        else:
            self.stdout.write(self.style.WARNING(f"File kode pos tidak ditemukan: {kodepos_path}"))

        prov_map = {}
        for p in provinsi:
            obj, _ = Province.objects.get_or_create(code=p["id"], defaults={"name": p["name"]})
            prov_map[p["id"]] = obj
        self.stdout.write(f"Provinsi: {len(prov_map)}")

        city_map = {}
        for k in kota:
            obj, _ = City.objects.get_or_create(
                code=k["id"], defaults={"name": k["name"], "province": prov_map[k["provinceId"]]}
            )
            city_map[k["id"]] = obj
        self.stdout.write(f"Kota/Kabupaten: {len(city_map)}")

        dist_map = {}
        for c in kecamatan:
            obj, _ = District.objects.get_or_create(
                code=c["id"], defaults={"name": c["name"], "city": city_map[c["cityId"]]}
            )
            dist_map[c["id"]] = obj
        self.stdout.write(f"Kecamatan: {len(dist_map)}")

        existing = set(Village.objects.values_list("code", flat=True))
        batch = []
        for v in kelurahan:
            if v["id"] in existing:
                continue
            batch.append(
                Village(
                    code=v["id"],
                    name=v["name"],
                    district=dist_map[v["districtId"]],
                    postal_code=kodepos.get(v["id"], ""),
                )
            )
            if len(batch) >= 2000:
                Village.objects.bulk_create(batch)
                self.stdout.write(f"  kelurahan terimport: {Village.objects.count()}")
                batch = []
        if batch:
            Village.objects.bulk_create(batch)

        total = Village.objects.count()
        with_kodepos = Village.objects.exclude(postal_code="").count()
        self.stdout.write(self.style.SUCCESS(
            f"Selesai. Total kelurahan/desa: {total}, "
            f"memiliki kode pos: {with_kodepos}, "
            f"tanpa kode pos: {total - with_kodepos}."
        ))
