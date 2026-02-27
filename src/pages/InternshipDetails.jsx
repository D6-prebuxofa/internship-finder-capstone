import { useNavigate } from "react-router-dom";

const InternshipDetails = () => {
  const navigate = useNavigate();

  const handleApply = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      navigate("/");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/applications/apply",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id,
            jobTitle: "Frontend Developer Intern",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Application submitted!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Network error");
    }
  };

  return (
    <div>
      <h2>Frontend Developer Intern</h2>
      <p>React + TypeScript role</p>

      <button onClick={handleApply}>
        Apply Now
      </button>
    </div>
  );
};

export default InternshipDetails;
