import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";

const StudentDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedInternshipIds, setSavedInternshipIds] = useState(new Set());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [profileForm, setProfileForm] = useState(() => ({
    name: JSON.parse(localStorage.getItem("user"))?.name || "",
    email: JSON.parse(localStorage.getItem("user"))?.email || "",
    phone: JSON.parse(localStorage.getItem("user"))?.phone || "",
    password: ""
  }));
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser) return;
    setProfileForm({
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      password: ""
    });
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.role === "company") {
      navigate("/company/dashboard");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const internshipsPromise = fetch(`${API_BASE_URL}/api/internships`).then((res) => res.json());
        const applicationsPromise = currentUser?._id
          ? fetch(`${API_BASE_URL}/api/applications/${currentUser._id}`).then((res) => res.json())
          : Promise.resolve([]);
        const savedPromise = currentUser?._id
          ? fetch(`${API_BASE_URL}/api/saved/${currentUser._id}`).then((res) => res.json())
          : Promise.resolve([]);

        const [internshipsData, applicationsData, savedData] = await Promise.all([
          internshipsPromise,
          applicationsPromise,
          savedPromise
        ]);

        setJobs(Array.isArray(internshipsData) ? internshipsData : []);
        setApplications(Array.isArray(applicationsData) ? applicationsData : []);
        setSavedInternshipIds(new Set((Array.isArray(savedData) ? savedData : []).map((item) => item.internshipId)));
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser?._id, currentUser?.role, navigate]);

  useEffect(() => {
    if (loading) return;
    const targetMap = {
      "#profile": "profile-settings",
      "#my-applications": "my-applications",
      "#saved": "saved-internships"
    };
    const sectionId = targetMap[location.hash];
    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [loading, location.hash]);

  const handleProfileInput = (e) => {
    setProfileForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!currentUser?._id) {
      alert("Please login first");
      navigate("/");
      return;
    }

    setIsSavingProfile(true);
    try {
      const payload = {
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
        phone: profileForm.phone.trim()
      };
      if (profileForm.password.trim()) {
        payload.password = profileForm.password.trim();
      }

      const response = await fetch(`${API_BASE_URL}/api/users/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update profile");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setCurrentUser(data.user);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Network error while updating profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleToggleSave = async (internshipId) => {
    if (!currentUser?._id) return;
    try {
      const isSaved = savedInternshipIds.has(internshipId);
      const endpoint = isSaved
        ? `${API_BASE_URL}/api/saved/${currentUser._id}/${internshipId}`
        : `${API_BASE_URL}/api/saved`;

      const response = await fetch(endpoint, {
        method: isSaved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: isSaved ? undefined : JSON.stringify({ userId: currentUser._id, internshipId })
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update saved internships");
        return;
      }

      setSavedInternshipIds((prev) => {
        const updated = new Set(prev);
        if (isSaved) updated.delete(internshipId);
        else updated.add(internshipId);
        return updated;
      });
    } catch (error) {
      console.error("Save internship error:", error);
      alert("Network error while saving internship");
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );
  const appliedInternshipIds = new Set(applications.map((item) => item.internshipId));
  const showAppliedOnly = location.hash === "#my-applications";
  const visibleJobs = showAppliedOnly
    ? filteredJobs.filter((job) => appliedInternshipIds.has(job._id))
    : filteredJobs;

  const savedJobs = useMemo(
    () => jobs.filter((job) => savedInternshipIds.has(job._id)),
    [jobs, savedInternshipIds]
  );

  if (loading) {
    return (
      <section className="container loading-shell">
        <h2>Loading internships...</h2>
      </section>
    );
  }

  return (
    <section className="container">
      <section id="profile-settings" className="applications-section profile-section">
        <h3>Edit Profile</h3>
        <form onSubmit={handleProfileUpdate} className="auth-form profile-form">
          <div className="profile-grid">
            <input
              type="text"
              name="name"
              className="input-field"
              placeholder="Full name"
              value={profileForm.name}
              onChange={handleProfileInput}
              required
            />
            <input
              type="email"
              name="email"
              className="input-field"
              placeholder="Email"
              value={profileForm.email}
              onChange={handleProfileInput}
              required
            />
            <input
              type="tel"
              name="phone"
              className="input-field"
              placeholder="Mobile number"
              value={profileForm.phone}
              onChange={handleProfileInput}
            />
          </div>
          <input
            type="password"
            name="password"
            className="input-field"
            placeholder="New password (leave blank to keep current)"
            value={profileForm.password}
            onChange={handleProfileInput}
          />
          <div className="button-row">
            <button type="submit" className="button-primary" disabled={isSavingProfile}>
              {isSavingProfile ? "Saving..." : "Save Profile"}
            </button>
            <button
              type="button"
              className="button-light"
              onClick={() =>
                setProfileForm({
                  name: currentUser?.name || "",
                  email: currentUser?.email || "",
                  phone: currentUser?.phone || "",
                  password: ""
                })
              }
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      <div className="dashboard-header">
        <div>
          <h2 className="page-title">Internship Opportunities</h2>
          <p className="page-subtitle">
            {showAppliedOnly
              ? "Showing only internships you have applied to."
              : "Search roles and open each listing for application details."}
          </p>
        </div>
        <span className="result-chip">{visibleJobs.length} results</span>
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

      <section id="saved-internships" className="applications-section">
        <h3>Saved Internships</h3>
        {savedJobs.length === 0 ? (
          <p className="muted-text">You have not saved internships yet.</p>
        ) : (
          <div className="dashboard-grid">
            {savedJobs.map((job) => (
              <article key={job._id} className="card job-card">
                <h3>{job.title}</h3>
                <p className="muted-text">{job.description}</p>
                <div className="meta-row">
                  <span className="meta-chip">{job.location}</span>
                </div>
                <div className="button-row">
                  <button className="button-light" onClick={() => handleToggleSave(job._id)}>
                    Remove Saved
                  </button>
                  <button className="button-primary" onClick={() => navigate(`/details/${job._id}`)}>
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {visibleJobs.length === 0 ? (
        <div className="empty-state">
          <h3>{showAppliedOnly ? "No applied internships found" : "No internships found"}</h3>
          <p>
            {showAppliedOnly
              ? "You have not applied to internships matching this search."
              : "Try a different keyword to see more opportunities."}
          </p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {visibleJobs.map((job) => (
            <article key={job._id} className="card job-card">
              <h3>{job.title}</h3>
              <p className="muted-text">{job.description}</p>
              <div className="meta-row">
                <span className="meta-chip">{job.location}</span>
                {appliedInternshipIds.has(job._id) && (
                  <span className="meta-chip applied-chip">Applied</span>
                )}
              </div>
              <div className="button-row">
                <button className="button-light" onClick={() => handleToggleSave(job._id)}>
                  {savedInternshipIds.has(job._id) ? "Saved" : "Save"}
                </button>
                <button className="button-primary" onClick={() => navigate(`/details/${job._id}`)}>
                  View Details
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default StudentDashboard;
