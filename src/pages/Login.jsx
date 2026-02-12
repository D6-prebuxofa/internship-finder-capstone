import { Link, useNavigate } from "react-router-dom"

function Login() {
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate("/home")
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <input type="email" placeholder="Email" /><br /><br />
      <input type="password" placeholder="Password" /><br /><br />

      <button onClick={handleLogin}>Login</button>

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  )
}

export default Login
