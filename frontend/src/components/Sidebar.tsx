import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{ width: "200px", background: "#eee", padding: "10px" }}>
      <h3>Library</h3>

      <Link to="/">Books</Link><br />
      <Link to="/my-books">My Books</Link><br />

      <button onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }}>
        Logout
      </button>
    </div>
  );
}