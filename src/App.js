import "./styles.css";
import useBookSearch from "./useBookSearch";
import { useState, useRef, useCallback } from "react";

export default function App() {
  const [query, setQuery] = useState(""),
    [pageNumber, setPageNumber] = useState(1);

  const observer = useRef();
  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);
  const lastBookElementRef = useCallback(
    (node) => {
      /**Dont trigger infinite scrolling while loading */
      if (loading) return;
      /**Disconnect the observer from the previous element */
      if (observer.current) observer.current.disconnect();
      /**entries will have eveything the observer is watching */
      observer.current = new IntersectionObserver((entries) => {
        /**if the last element present on the page and more records present */
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      /**If last element present, observer should watch it */
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <>
      <input type="text" value={query} onChange={handleSearch} />
      {books.map((book, index) => {
        /**Check for last book */
        if (books.length === index + 1) {
          return (
            <div ref={lastBookElementRef} key={book}>
              {book}
            </div>
          );
        } else {
          return <div key={book}>{book}</div>;
        }
      })}
      <div>{loading && "Loading..."}</div>
      <div>{error && Error}</div>
    </>
  );
}
