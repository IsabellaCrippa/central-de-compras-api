export default function Sidebar({ current, setCurrent }) {
  return (
    <div style={{ width: "200px", padding: "20px", background: "#eee", height: "100vh" }}>
      <h2>Dashboard</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {["users", "suppliers", "products", "orders", "stores", "campaigns"].map((tab) => (
          <li
            key={tab}
            style={{
              padding: "10px",
              cursor: "pointer",
              background: current === tab ? "#ddd" : "transparent"
            }}
            onClick={() => setCurrent(tab)}
          >
            {tab.toUpperCase()}
          </li>
        ))}
      </ul>
    </div>
  );
}
