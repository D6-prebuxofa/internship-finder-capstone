import { useNavigate } from "react-router-dom";

const internships = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    location: "Toronto",
    description:
      "Work with React and TypeScript to build responsive web applications. Collaborate with designers and backend engineers. Improve UI performance and accessibility."
  },
  {
    id: 2,
    title: "Backend Developer Intern",
    location: "Vancouver",
    description:
      "Develop REST APIs using Node.js and Express. Work with MongoDB databases and implement authentication systems. Optimize server performance."
  },
  {
    id: 3,
    title: "Full Stack Developer Intern",
    location: "Montreal",
    description:
      "Build complete web applications using MERN stack. Integrate frontend and backend systems. Participate in agile development cycles."
  },
  {
    id: 4,
    title: "UI/UX Designer Intern",
    location: "Ottawa",
    description:
      "Design user-centered interfaces and wireframes. Conduct usability testing and research. Collaborate closely with developers."
  },
  {
    id: 5,
    title: "DevOps Intern",
    location: "Calgary",
    description:
      "Assist in CI/CD pipeline setup. Work with Docker and cloud platforms. Monitor application performance and deployment processes."
  }
];

const Internships = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Internships</h2>

      {internships.map((job) => (
        <div key={job.id} style={{ border: "1px solid gray", padding: "15px", marginBottom: "10px" }}>
          <h3>{job.title}</h3>
          <p><strong>Location:</strong> {job.location}</p>
          <p>{job.description}</p>

          <button onClick={() => navigate(`/details/${job.id}`)}>
            View Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default Internships;