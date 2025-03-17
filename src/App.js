import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash"; // Import Lodash for Debounce
import "./index.css"; // Import CSS

const App = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [docId, setDocId] = useState("");
  const [content, setContent] = useState("");
  const BACKEND_URL = process.env.URL || "http://localhost:8080";

  // 🔹 API Call - Search
  const handleSearch = async () => {
    try {
      console.log("Searching for:", query);
      const response = await axios.get(`${BACKEND_URL}/search/query?query=${query}`);
      console.log("Search API Response:", response.data);
      setResults([...new Set(response.data)]);
    } catch (error) {
      console.error("Error fetching search results:", error);
      alert("Error fetching search results!");
    }
  };

  // 🔹 Fetch Suggestions (Debounced)
  const fetchSuggestions = _.debounce(async (prefix) => {
    if (!prefix) {
      setSuggestions([]);
      return;
    }
    try {
      console.log("Fetching suggestions for:", prefix);
      const response = await axios.get(`${BACKEND_URL}/search/suggestions?prefix=${prefix}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, 300); // Debounce time: 300ms

  // 🔹 Fetch suggestions when query changes
  useEffect(() => {
    fetchSuggestions(query);
  }, [query]);

  const indexDocument = async () => {
    try {
      console.log("Sending request to backend...");
      const response = await axios.post(`${BACKEND_URL}/search/index`, null, {
        params: { docId, content },
      });
      console.log("Response:", response);
      alert("Document Indexed!");
    } catch (error) {
      console.error("Error indexing document:", error.message);
      alert("Failed to index document!");
    }
  };
  

  return (
    <div className="container">
      <h2>🔍 Document Search</h2>

      {/* ✅ Search Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter search query"
        className="input-field"
      />
      <button onClick={handleSearch} className="button">Search</button>

      {/* ✅ Suggestions */}
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s, index) => (
            <li key={index}>{s}</li>
          ))}
        </ul>
      )}

      {/* ✅ Search Results */}
      <h3>Results:</h3>
      <ul className="results">
        {results.length === 0 ? (
          <li>No results found</li>
        ) : (
          results.map((r, index) => <li key={index}>{r}</li>)
        )}
      </ul>

      {/* ✅ Index New Document */}
      <h2>📑 Index New Document</h2>
      <input
        type="text"
        placeholder="Document ID"
        value={docId}
        onChange={(e) => setDocId(e.target.value)}
        className="input-field"
      />
      <textarea
        placeholder="Document Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="textarea-field"
      />
      <button onClick={indexDocument} className="button">✅ Index Document</button>
    </div>
  );
};

export default App;
