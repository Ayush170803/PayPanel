import React from "react";
import "./GrafanaDashboard.css"; // Optional external styling

const GrafanaDashboard = () => {
  const panels = [
    {
      id: 1,
      title: "📊 Request Count",
      src: "http://localhost:3001/d-solo/bfbc534f-0120-4bc4-994a-3562ec1218dc/dashboard-1?orgId=1&from=now-1h&to=now&theme=dark&panelId=1",
    },
    {
      id: 2,
      title: "⏱️ Request Duration",
      src: "http://localhost:3001/d-solo/bfbc534f-0120-4bc4-994a-3562ec1218dc/dashboard-1?orgId=1&from=now-1h&to=now&theme=dark&panelId=2",
    },
{
  id: 3,
  title: "📈 Total HTTP Requests",
  src: "http://localhost:3001/d-solo/bfbc534f-0120-4bc4-994a-3562ec1218dc/dashboard-1?orgId=1&from=now-1h&to=now&theme=dark&panelId=3",
},
{
  id: 4,
  title: "🛣️ Top Routes by Request Load",
  src: "http://localhost:3001/d-solo/bfbc534f-0120-4bc4-994a-3562ec1218dc/dashboard-1?orgId=1&from=now-1h&to=now&theme=dark&panelId=4",
},
{
  id: 5,
  title: "🔁 Request Rate (per second)",
  src: "http://localhost:3001/d-solo/bfbc534f-0120-4bc4-994a-3562ec1218dc/dashboard-1?orgId=1&from=now-1h&to=now&theme=dark&panelId=5",
},
{
  id: 6,
  title: "👥 Active Users",
  src: "http://localhost:3001/d-solo/bfbc534f-0120-4bc4-994a-3562ec1218dc/dashboard-1?orgId=1&from=now-1h&to=now&theme=dark&panelId=6",
}
  ];

  return (
    <div className="grafana-wrapper">
      <h2 className="grafana-heading">📈 Server Monitoring Dashboard</h2>
      <div className="grafana-grid">
        {panels.map((panel) => (
          <div className="grafana-card" key={panel.id}>
            <h3 className="grafana-title">{panel.title}</h3>
            <iframe src={panel.src} width="100%" height="250" frameBorder="0" title={panel.title}></iframe>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrafanaDashboard;
