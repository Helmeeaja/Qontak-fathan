import { useEffect, useState } from "react";
import { formLabel, selectBase } from "@/components/ui/styles";
import api from "@/services/api";

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-[7px]">
      <label className={formLabel}>{label}</label>
      {children}
    </div>
  );
}

function Select({ value, onChange, disabled, loading, placeholder, options, optionValueKey }) {
  return (
    <select
      className={selectBase}
      value={value}
      disabled={disabled || loading}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{loading ? "Memuat..." : placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={option[optionValueKey]}>
          {option.name}
        </option>
      ))}
    </select>
  );
}

export default function RegionSelects({
  value,
  onChange,
  disabled = false,
  fields = ["province", "city", "district", "village"],
}) {
  const province = value.province || "";
  const city = value.city || "";
  const district = value.district || "";
  const village = value.village || "";

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loadingProv, setLoadingProv] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);
  const [loadingKec, setLoadingKec] = useState(false);
  const [loadingKel, setLoadingKel] = useState(false);

  const provinceCode = province
    ? provinces.find((p) => p.name === province)?.code || ""
    : "";
  const cityCode = city
    ? cities.find((k) => k.name === city)?.code || ""
    : "";
  const districtCode = district
    ? districts.find((k) => k.name === district)?.code || ""
    : "";

  useEffect(() => {
    let alive = true;
    setLoadingProv(true);
    api
      .get("/provinces/")
      .then((response) => {
        if (alive) setProvinces(response.data);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoadingProv(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!provinceCode) {
      setCities([]);
      return;
    }
    let alive = true;
    setLoadingCity(true);
    api
      .get("/cities/?province_code=" + provinceCode)
      .then((response) => {
        if (alive) setCities(response.data);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoadingCity(false);
      });
    return () => {
      alive = false;
    };
  }, [provinceCode]);

  useEffect(() => {
    if (!cityCode) {
      setDistricts([]);
      return;
    }
    let alive = true;
    setLoadingKec(true);
    api
      .get("/districts/?city_code=" + cityCode)
      .then((response) => {
        if (alive) setDistricts(response.data);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoadingKec(false);
      });
    return () => {
      alive = false;
    };
  }, [cityCode]);

  useEffect(() => {
    if (!districtCode) {
      setVillages([]);
      return;
    }
    let alive = true;
    setLoadingKel(true);
    api
      .get("/villages/?district_code=" + districtCode)
      .then((response) => {
        if (alive) setVillages(response.data);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoadingKel(false);
      });
    return () => {
      alive = false;
    };
  }, [districtCode]);

  const setProvince = (name) =>
    onChange({ province: name, city: "", district: "", village: "", postalCode: "" });
  const setCity = (name) =>
    onChange({ city: name, district: "", village: "", postalCode: "" });
  const setDistrict = (name) => onChange({ district: name, village: "", postalCode: "" });
  const setVillage = (name) => {
    const found = villages.find((v) => v.name === name);
    onChange({
      village: name,
      postalCode: found && found.postal_code ? found.postal_code : "",
    });
  };

  const allFields = [
    fields.includes("province") && (
      <Field key="province" label="Provinsi">
        <Select
          value={province}
          onChange={setProvince}
          disabled={disabled}
          loading={loadingProv}
          placeholder="Pilih provinsi"
          options={provinces}
          optionValueKey="name"
        />
      </Field>
    ),
    fields.includes("city") && (
      <Field key="city" label="Kota/Kabupaten">
        <Select
          value={city}
          onChange={setCity}
          disabled={disabled || !province}
          loading={loadingCity}
          placeholder="Pilih kota/kabupaten"
          options={cities}
          optionValueKey="name"
        />
      </Field>
    ),
    fields.includes("district") && (
      <Field key="district" label="Kecamatan">
        <Select
          value={district}
          onChange={setDistrict}
          disabled={disabled || !city}
          loading={loadingKec}
          placeholder="Pilih kecamatan"
          options={districts}
          optionValueKey="name"
        />
      </Field>
    ),
    fields.includes("village") && (
      <Field key="village" label="Kelurahan/Desa">
        <Select
          value={village}
          onChange={setVillage}
          disabled={disabled || !district}
          loading={loadingKel}
          placeholder="Pilih kelurahan/desa"
          options={villages}
          optionValueKey="name"
        />
      </Field>
    ),
  ].filter(Boolean);
  return <>{allFields}</>;
}
