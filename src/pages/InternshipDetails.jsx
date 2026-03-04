import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [phone, setPhone] = useState("");
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchInternships = async () => {
      const response = await fetch("http://127.0.0.1:5000/api/internships");
      const data = await response.json();
      const selected = data.find((item) => item._id === id);
      setJob(selected);
    };

    fetchInternships();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();

    if (!resume || !coverLetter) {
      alert("Both Resume and Cover Letter are required!");
      return;
    }

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("internshipId", job._id);
    formData.append("jobTitle", job.title);
    formData.append("phone", phone);
    formData.append("resume", resume);
    formData.append("coverLetter", coverLetter);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/applications/apply", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Application submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Apply Error:", error);
      alert("Network error");
    }
  };

  if (!user) {
    return (
      <section className="container empty-state">
        <h3>Please login first</h3>
        <button className="button-primary" onClick={() => navigate("/")}>Go to Login</button>
      </section>
    );
  }

  if (!job) {
    return (
      <section className="container loading-shell">
        <h2>Loading internship details...</h2>
      </section>
    );
  }

  return (
    <section className="container details-layout">
      <article className="detail-summary card">
        <span className="meta-chip">{job.location}</span>
        <h2 className="page-title">{job.title}</h2>
        <p className="muted-text">{job.description}</p>
        <div className="button-row">
          <button className="button-light" onClick={() => navigate("/dashboard")}>Back</button>
        </div>
      </article>

      <aside className="application-panel card">
        <h3>Apply Now</h3>
        <p className="page-subtitle">Submit your details with resume and cover letter.</p>

        <form onSubmit={handleApply} className="auth-form">
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          <input
            type="text"
            className="input-field"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <label className="field-label">Upload Resume (PDF/DOC)</label>
          <input
            type="file"
            className="file-input"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
            required
          />

          <label className="field-label">Upload Cover Letter (PDF/DOC)</label>
          <input
            type="file"
            className="file-input"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setCoverLetter(e.target.files[0])}
            required
          />

          <button type="submit" className="button-primary">Submit Application</button>
        </form>
      </aside>
    </section>
  );
};

export default InternshipDetails;
