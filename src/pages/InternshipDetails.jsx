import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

const internships = [
  {
    id: "1",
    title: "Frontend Developer Intern",
    description: "Work with React and TypeScript to build modern UI applications."
  },
  {
    id: "2",
    title: "Backend Developer Intern",
    description: "Build REST APIs using Node.js and MongoDB."
  },
  {
    id: "3",
    title: "Full Stack Developer Intern",
    description: "Work on complete MERN stack applications."
  },
  {
    id: "4",
    title: "UI/UX Designer Intern",
    description: "Design intuitive user experiences and wireframes."
  },
  {
    id: "5",
    title: "DevOps Intern",
    description: "Manage CI/CD pipelines and cloud infrastructure."
  }
];

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);

  const job = internships.find((job) => job.id === id);

  const handleApply = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      navigate("/");
      return;
    }

    if (!resume) {
      alert("Upload resume first");
      return;
    }

    alert(`Applied for ${job.title} successfully!`);
  };

  if (!job) return <h2>Job not found</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{job.title}</h2>
      <p>{job.description}</p>

      <br />

      <input
        type="file"
        onChange={(e) => setResume(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleApply}>
        Apply Now
      </button>
    </div>
  );
};

export default InternshipDetails;
