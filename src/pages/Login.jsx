import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("student");

  useEffect(() => {
    const existingUser = JSON.parse(localStorage.getItem("user"));
    if (!existingUser) return;

    if (existingUser.role === "company") navigate("/company/dashboard");
    else if (existingUser.role === "admin") navigate("/admin/dashboard");
    else navigate("/dashboard");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const loggedInUser = {
        ...data.user,
        _id: data.user._id || data.user.id
      };

      if (selectedRole !== loggedInUser.role) {
        const roleLabel = loggedInUser.role === "company" ? "Company Recruiter" : loggedInUser.role;
        alert(`This account is registered as ${roleLabel}. Please choose the correct login type.`);
        return;
      }

      localStorage.setItem("user", JSON.stringify(loggedInUser));
      if (loggedInUser.role === "company") {
        navigate("/company/dashboard");
      } else if (loggedInUser.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      alert("Network error");
    }
  };

  return (
    <div className="container auth-shell">
      <h2 className="page-title">Welcome Back</h2>
      <p className="page-subtitle">Log in as a student or company recruiter.</p>

      <form onSubmit={handleLogin} className="auth-form">
        <select
          className="input-field"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="student">Student Login</option>
          <option value="company">Company Recruiter Login</option>
          <option value="admin">Admin Login</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="button-primary">
          Login
        </button>
      </form>

      <div className="auth-switch">
        <p className="page-subtitle">New here? Choose how you want to join:</p>
        <div className="button-row">
          <button className="button-light" onClick={() => navigate("/register?role=student")}>
            Join as Student
          </button>
          <button className="button-light" onClick={() => navigate("/register?role=company")}>
            Join as Company Recruiter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
