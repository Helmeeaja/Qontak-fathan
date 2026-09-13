import { useState } from "react";
import { Navigate, Link as RouterLink, useNavigate } from "react-router-dom";
import { Eye, EyeClosed } from "@phosphor-icons/react";
import api from "@/services/api";
import brandLogo from "@/assets/brand.png";
import LoadingPopup from "@/components/ui/LoadingPopup";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-[13px] py-3 text-[15px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirm: "",
    company_name: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (localStorage.getItem("access_token")) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.password_confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register/", {
        name: form.name,
        email: form.email,
        password: form.password,
        company_name: form.company_name,
      });

      navigate("/login");
    } catch (err) {
      const data = err.response?.data;

      if (data?.message) {
        setError(data.message);
      } else if (data?.email) {
        setError(Array.isArray(data.email) ? data.email[0] : data.email);
      } else if (data?.detail) {
        setError(data.detail);
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <section className="relative hidden flex-1 items-center overflow-hidden bg-brand p-12 text-white md:flex">
        <div className="absolute -bottom-[100px] -left-[100px] h-[300px] w-[300px] rounded-full bg-white opacity-5" />
        <div className="absolute -top-[50px] -right-[50px] h-[200px] w-[200px] rounded-full bg-white opacity-5" />

        <div className="relative z-[2] max-w-[500px]">
          <img
            src={brandLogo}
            alt="QontakSales"
            className="mb-[55px] h-10 w-auto object-contain"
          />

          <h2 className="m-0 mb-7 text-[28px] font-bold leading-[1.3]">
            Start closing more deals today.
          </h2>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
              <p className="m-0 text-[15px] opacity-90">
                Free forever for small teams
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
              <p className="m-0 text-[15px] opacity-90">
                Setup in under 2 minutes
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
              <p className="m-0 text-[15px] opacity-90">
                No credit card required
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-1 items-center justify-center overflow-y-auto p-10 max-md:p-6">
        <div className="w-full max-w-[480px]">
          <div className="mb-6">
            <h1 className="m-0 text-[30px] font-bold text-slate-900 max-md:text-[26px]">
              Create your account
            </h1>
            <p className="m-0 mt-2 text-[15px] text-slate-500">
              Get started with QontakSales for free
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-[30px] shadow-[0_4px_20px_rgba(15,23,42,0.06)] max-md:p-[22px]">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-[18px] rounded-lg border border-red-200 bg-red-50 px-[13px] py-[11px] text-center text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="mb-[18px] flex flex-col gap-[7px]">
                <label htmlFor="name" className="text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className={inputClass}
                />
              </div>

              <div className="mb-[18px] flex flex-col gap-[7px]">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  required
                  className={inputClass}
                />
              </div>

              <div className="mb-[18px] flex flex-col gap-[7px]">
                <label htmlFor="company_name" className="text-sm font-semibold text-slate-700">
                  Company Name
                </label>
                <input
                  id="company_name"
                  name="company_name"
                  type="text"
                  value={form.company_name}
                  onChange={handleChange}
                  placeholder="Your Company"
                  required
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5 max-md:grid-cols-1 max-md:gap-0">
                <div className="mb-[18px] flex flex-col gap-[7px]">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min 8 characters"
                      required
                      className={`${inputClass} pr-11`}
                    />

                    <button
                      type="button"
                      className="absolute top-1/2 right-2.5 flex -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent text-slate-500 hover:text-brand"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeClosed size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-[18px] flex flex-col gap-[7px]">
                  <label htmlFor="password_confirm" className="text-sm font-semibold text-slate-700">
                    Confirm
                  </label>

                  <input
                    id="password_confirm"
                    name="password_confirm"
                    type={showPassword ? "text" : "password"}
                    value={form.password_confirm}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer rounded-lg border-0 bg-brand px-4 py-[13px] text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-brand-dark disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          </div>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <RouterLink to="/login" className="font-semibold text-brand no-underline hover:underline">
              Sign in
            </RouterLink>
          </p>
        </div>
      </section>

      <LoadingPopup
        open={loading}
        message="Creating account..."
      />
    </div>
  );
}
