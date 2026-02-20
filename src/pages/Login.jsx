import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"

function Login() {
  const navigate = useNavigate()

  const [role, setRole] = useState("Student")

  const handleLogin = () => {
    // For now simulate login based on role
    if (role === "Student") navigate("/student-dashboard")
    if (role === "Company") navigate("/company-dashboard")
    if (role === "Admin") navigate("/admin-dashboard")
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f3f4f6",
      fontFamily: "Segoe UI"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ marginBottom: "20px" }}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          style={inputStyle}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={inputStyle}
        >
          <option>Student</option>
          <option>Company</option>
          <option>Admin</option>
        </select>

        <button style={buttonStyle} onClick={handleLogin}>
          Login
        </button>

        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc"
}

const buttonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#6366f1",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
}

export default Login
