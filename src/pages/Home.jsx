import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()

  const internships = [
    { id: 1, title: "Frontend Developer Intern", location: "Toronto" },
    { id: 2, title: "Backend Developer Intern", location: "Remote" }
  ]

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Internships</h2>

      {internships.map((internship) => (
        <div key={internship.id}>
          <h3>{internship.title}</h3>
          <p>{internship.location}</p>
          <button onClick={() => navigate("/details")}>
            View Details
          </button>
          <hr />
        </div>
      ))}
    </div>
  )
}

export default Home
