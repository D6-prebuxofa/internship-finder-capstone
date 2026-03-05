import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInternships = async () => {
      const response = await fetch(`${API_BASE_URL}/api/internships`);

      const data = await response.json();
      setInternships(data);
    };

    fetchInternships();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Internships</h2>

      {internships.map((job) => (
        <div
          key={job._id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px"
          }}
        >
          <h3>{job.title}</h3>
          <p><strong>Location:</strong> {job.location}</p>
          <p>{job.description}</p>

          <button onClick={() => navigate(`/details/${job._id}`)}>
            View Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default Internships;
