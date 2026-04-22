import { useEffect, useState } from "react";
import API from "../api/api";

export default function MyBooks() {
  const [books, setBooks] = useState([]);

  const fetchBooks = () => {
    API.get("/borrow/my_books/")
      .then(res => setBooks(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const returnBook = async (id) => {
    try {
      await API.post(`/borrow/${id}/return_book/`);
      alert("Returned successfully");
      fetchBooks();
    } catch (err) {
      alert("Error returning");
    }
  };

  return (
    <div>
      <h2>My Books</h2>

      {books.map((b) => (
        <div key={b.id}>
          <p>Book ID: {b.book}</p>
          <p>Status: {b.status}</p>

          {b.status === "borrowed" && (
            <button onClick={() => returnBook(b.id)}>
              Return
            </button>
          )}
        </div>
      ))}
    </div>
  );
}