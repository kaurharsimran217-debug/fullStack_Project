import { useEffect, useState } from "react";
import API from "../api/api";
import Sidebar from "../components/Sidebar";

export default function Books() {
  const [books, setBooks] = useState([]);

  const fetchBooks = () => {
  API.get("/books/")
    .then((res) => {
      console.log("BOOKS RESPONSE:", res.data);  

      if (Array.isArray(res.data)) {
        setBooks(res.data);
      } else {
        setBooks(res.data.results);
      }
    })
    .catch((err) => {
      console.log("BOOKS ERROR:", err);
    });
};

  useEffect(() => {
    fetchBooks();
  }, []);

  // 🔥 BORROW FUNCTION
  const borrowBook = async (id) => {
    try {
      await API.post("/borrow/", { book: id });
      alert("Book borrowed successfully");
      fetchBooks(); // ✅ refresh after borrow
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Unknown error";

      alert(message);
      console.log(err.response);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={{ marginLeft: "20px", width: "100%" }}>
        <h1>Books</h1>

        {books.length === 0 ? (
          <p>No books found</p>
        ) : (
          books.map((book) => (
            <div
              key={book.id}
              style={{
                border: "1px solid black",
                margin: "10px",
                padding: "10px",
              }}
            >
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <p>{book.category}</p>

              <p>
                {book.available_copies > 0
                  ? `Available: ${book.available_copies}`
                  : "Out of Stock"}
              </p>

              <button
                onClick={() => borrowBook(book.id)}
                disabled={book.available_copies === 0}
              >
                {book.available_copies === 0 ? "Out of Stock" : "Borrow"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}