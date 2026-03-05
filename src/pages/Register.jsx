import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API_BASE_URL from "../config/api";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");
  const defaultRole = ["student", "company"].includes(roleParam) ? roleParam : "student";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: defaultRole
  });

  useEffect(() => {
    const existingUser = JSON.parse(localStorage.getItem("user"));
    if (!existingUser) return;

    if (existingUser.role === "company") navigate("/company/dashboard");
    else if (existingUser.role === "admin") navigate("/admin/dashboard");
    else navigate("/dashboard");
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Network error");
    }
  };

  return (
    <div className="container auth-shell">
      <h2 className="page-title">Create Your Account</h2>
      <p className="page-subtitle">Start tracking opportunities tailored for your career goals.</p>

      <form onSubmit={handleRegister} className="auth-form">
        <input
          type="text"
          name="name"
          placeholder="Full name"
          className="input-field"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input-field"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input-field"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="company">Company</option>
        </select>

        <button type="submit" className="button-primary">
          Register
        </button>
      </form>

      <div className="auth-switch">
        <button className="button-light" onClick={() => navigate("/")}>
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Register;
