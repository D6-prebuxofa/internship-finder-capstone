import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";

const initialForm = {
  title: "",
  location: "",
  description: ""
};

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "company") {
      navigate("/");
    }
  }, [navigate, user]);

  const fetchCompanyData = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const internshipsPromise = fetch(`${API_BASE_URL}/api/company/${user._id}/internships`).then((res) => res.json());
      const applicationsPromise = fetch(`${API_BASE_URL}/api/company/${user._id}/applications`).then((res) => res.json());
      const notificationsPromise = fetch(`${API_BASE_URL}/api/company/${user._id}/notifications`).then((res) => res.json());
      const [internshipsData, applicationsData, notificationsData] = await Promise.all([
        internshipsPromise,
        applicationsPromise,
        notificationsPromise
      ]);

      setInternships(Array.isArray(internshipsData) ? internshipsData : []);
      setApplications(Array.isArray(applicationsData) ? applicationsData : []);
      setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
    } catch (error) {
      console.error("Company dashboard fetch error:", error);
      alert("Failed to load company data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [user?._id]);

  useEffect(() => {
    const targetMap = {
      "#post": "post-internship",
      "#listings": "my-listings",
      "#applications": "manage-applications"
    };
    const sectionId = targetMap[location.hash];
    if (!sectionId) return;
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash, loading]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleSubmitInternship = async (e) => {
    e.preventDefault();
    try {
      const endpoint = editingId ? `${API_BASE_URL}/api/internships/${editingId}` : `${API_BASE_URL}/api/internships`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          companyId: user._id,
          companyName: user.name
        })
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to save internship");
        return;
      }

      alert(editingId ? "Internship updated successfully" : "Internship posted successfully");
      resetForm();
      fetchCompanyData();
    } catch (error) {
      console.error("Internship submit error:", error);
      alert("Network error while saving internship");
    }
  };

  const handleEdit = (internship) => {
    setEditingId(internship._id);
    setFormData({
      title: internship.title,
      location: internship.location,
      description: internship.description
    });
    navigate("/company/dashboard#post");
  };

  const handleDelete = async (internshipId) => {
    const ok = window.confirm("Delete this internship? This will also remove related applications.");
    if (!ok) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/internships/${internshipId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId: user._id })
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete internship");
        return;
      }

      alert("Internship deleted successfully");
      fetchCompanyData();
    } catch (error) {
      console.error("Delete internship error:", error);
      alert("Network error while deleting internship");
    }
  };

  const handleStatusChange = async (applicationId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/${applicationId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId: user._id, status })
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update status");
        return;
      }

      fetchCompanyData();
    } catch (error) {
      console.error("Update application status error:", error);
      alert("Network error while updating status");
    }
  };

  const handleMarkNotificationsRead = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/company/${user._id}/notifications/read`, {
        method: "PUT"
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to mark notifications");
        return;
      }
      fetchCompanyData();
    } catch (error) {
      console.error("Mark notifications error:", error);
      alert("Network error while marking notifications");
    }
  };

  if (!user || user.role !== "company") {
    return null;
  }

  if (loading) {
    return (
      <section className="container loading-shell">
        <h2>Loading company dashboard...</h2>
      </section>
    );
  }

  return (
    <section className="container">
      <section className="applications-section">
        <div className="dashboard-header">
          <h3>Application Notifications</h3>
          {notifications.some((item) => !item.isRead) && (
            <button className="button-light" onClick={handleMarkNotificationsRead}>
              Mark all as read
            </button>
          )}
        </div>
        {notifications.length === 0 ? (
          <p className="muted-text">No new notifications.</p>
        ) : (
          <div className="applications-grid">
            {notifications.slice(0, 6).map((notification) => (
              <article key={notification._id} className="application-card">
                <p className="application-meta">{notification.message}</p>
                <p className="application-meta">
                  Status: <strong>{notification.isRead ? "Read" : "New"}</strong>
                </p>
                <p className="application-meta">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="post-internship" className="applications-section profile-section">
        <h3>{editingId ? "Edit Internship" : "Post Internship"}</h3>
        <form onSubmit={handleSubmitInternship} className="auth-form profile-form">
          <input
            type="text"
            name="title"
            className="input-field"
            placeholder="Internship title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="location"
            className="input-field"
            placeholder="Location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            className="input-field"
            placeholder="Internship description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            required
          />
          <div className="button-row">
            <button type="submit" className="button-primary">
              {editingId ? "Update Internship" : "Post Internship"}
            </button>
            {editingId && (
              <button type="button" className="button-light" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section id="my-listings" className="applications-section">
        <h3>My Internship Listings</h3>
        {internships.length === 0 ? (
          <p className="muted-text">No internships posted yet.</p>
        ) : (
          <div className="dashboard-grid">
            {internships.map((internship) => (
              <article key={internship._id} className="card job-card">
                <h3>{internship.title}</h3>
                <p className="muted-text">{internship.description}</p>
                <div className="meta-row">
                  <span className="meta-chip">{internship.location}</span>
                </div>
                <div className="button-row">
                  <button className="button-light" onClick={() => handleEdit(internship)}>
                    Edit
                  </button>
                  <button className="button-primary" onClick={() => handleDelete(internship._id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="manage-applications" className="applications-section">
        <h3>Manage Applications</h3>
        {applications.length === 0 ? (
          <p className="muted-text">No applications received yet.</p>
        ) : (
          <div className="applications-grid">
            {applications.map((application) => (
              <article key={application._id} className="application-card">
                <p className="application-role">{application.internshipTitle}</p>
                <p className="application-meta">Applicant: {application.applicantName}</p>
                <p className="application-meta">Email: {application.applicantEmail}</p>
                <p className="application-meta">Phone: {application.phone || "-"}</p>
                <p className="application-meta">
                  Applied: {new Date(application.appliedAt).toLocaleDateString()}
                </p>
                <select
                  value={application.status || "Pending"}
                  onChange={(e) => handleStatusChange(application._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
};

export default CompanyDashboard;
