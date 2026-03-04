import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const internshipsPromise = fetch("http://127.0.0.1:5000/api/internships").then((res) => res.json());
        const applicationsPromise = user?._id
          ? fetch(`http://127.0.0.1:5000/api/applications/${user._id}`).then((res) => res.json())
          : Promise.resolve([]);

        const [internshipsData, applicationsData] = await Promise.all([
          internshipsPromise,
          applicationsPromise
        ]);

        setJobs(internshipsData);
        setApplications(Array.isArray(applicationsData) ? applicationsData : []);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?._id]);

  useEffect(() => {
    if (loading) return;
    if (location.hash === "#my-applications") {
      const section = document.getElementById("my-applications");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [loading, location.hash]);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );
  const appliedInternshipIds = new Set(applications.map((item) => item.internshipId));

  if (loading) {
    return (
      <section className="container loading-shell">
        <h2>Loading internships...</h2>
      </section>
    );
  }

  return (
    <section className="container">
      <div className="dashboard-header">
        <div>
          <h2 className="page-title">Internship Opportunities</h2>
          <p className="page-subtitle">Search roles and open each listing for application details.</p>
        </div>
        <span className="result-chip">{filteredJobs.length} results</span>
      </div>

      <input
        type="text"
        placeholder="Search by internship title"
        className="input-field search-field"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <section id="my-applications" className="applications-section">
        <h3>My Applications</h3>
        {applications.length === 0 ? (
          <p className="muted-text">You have not submitted any applications yet.</p>
        ) : (
          <div className="applications-grid">
            {applications.map((application) => (
              <article key={application._id} className="application-card">
                <p className="application-role">{application.jobTitle}</p>
                <p className="application-meta">
                  Status: <strong>{application.status || "Pending"}</strong>
                </p>
                <p className="application-meta">
                  Applied: {new Date(application.appliedAt).toLocaleDateString()}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      {filteredJobs.length === 0 ? (
        <div className="empty-state">
          <h3>No internships found</h3>
          <p>Try a different keyword to see more opportunities.</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {filteredJobs.map((job) => (
            <article key={job._id} className="card job-card">
              <h3>{job.title}</h3>
              <p className="muted-text">{job.description}</p>
              <div className="meta-row">
                <span className="meta-chip">{job.location}</span>
                {appliedInternshipIds.has(job._id) && (
                  <span className="meta-chip applied-chip">Applied</span>
                )}
              </div>
              <button className="button-primary" onClick={() => navigate(`/details/${job._id}`)}>
                View Details
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default StudentDashboard;
