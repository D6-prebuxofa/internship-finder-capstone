function InternshipDetails() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          maxWidth: "400px",
          width: "100%",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: "600" }}>
          Frontend Developer Intern
        </h2>

        <p style={{ marginTop: "8px", color: "#6b7280" }}>
         Toronto
        </p>

        {/* Job Description */}
        <h3 style={{ marginTop: "20px", fontSize: "16px", fontWeight: "600" }}>
          Job Description
        </h3>

        <ul style={{ marginTop: "10px", lineHeight: "1.6", fontSize: "14px" }}>
          <li>Design and build web applications using React and TypeScript.</li>
          <li>Convert UI/UX designs into responsive interfaces.</li>
          <li>Write clean, maintainable frontend code.</li>
          <li>Participate in agile workflows and code reviews.</li>
          <li>Ensure strong performance and cross-browser compatibility.</li>
          <li>Debug and optimize user experience.</li>
          <li>Communicate technical concepts clearly.</li>
        </ul>

        {/* Requirements */}
        <h3 style={{ marginTop: "20px", fontSize: "16px", fontWeight: "600" }}>
          Requirements
        </h3>

        <ul style={{ marginTop: "10px", lineHeight: "1.6", fontSize: "14px" }}>
          <li>Strong experience with React and TypeScript.</li>
          <li>Build scalable, maintainable web apps.</li>
          <li>Experience with React Web and React Native.</li>
          <li>Understanding of responsive & accessible UI.</li>
          <li>Knowledge of REST APIs and state management.</li>
          <li>Familiar with Git and agile workflows.</li>
          <li>Strong communication skills.</li>
        </ul>

        <button
          style={{
            width: "100%",
            marginTop: "25px",
            padding: "12px",
            backgroundColor: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = "#4f46e5")
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = "#6366f1")
          }
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default InternshipDetails;
