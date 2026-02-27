import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Dashboard</h2>

      <button onClick={() => navigate("/internships")}>
        Browse Internships
      </button>

      <br /><br />

      <button
        onClick={() => {
          localStorage.removeItem("user");
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default StudentDashboard;