import { useEffect, useState } from "react";
import axios from "axios";

const useBookSearch = (query, pageNumber) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(true);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);

    let cancel;
    axios({
      method: "GET",
      url: "https://openlibrary.org/search.json",
      params: { q: query, page: pageNumber },
      // cancel token will cancel all the axios request
      // and send only one requets
      cancelToken: new axios.CancelToken((token) => (cancel = token))
    })
      .then((res) => {
        setBooks((prevBooks) => {
          //books can have multiple titles and we need unique values
          return [
            ...new Set([
              ...prevBooks,
              ...res.data.docs.map((book) => book.title)
            ])
          ];
        });
        setHasMore(res.data.docs.length > 0);
        setLoading(false);
      })
      .catch((error) => {
        if (axios.isCancel(error)) return;
        setError(true);
      });

    return () => cancel();
  }, [query, pageNumber]);

  return { loading, error, books, hasMore };
};

export default useBookSearch;
