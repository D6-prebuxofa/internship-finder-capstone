const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Student Dashboard</h2>

      <button onClick={() => navigate("/details")}>
        View Internship
      </button>

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