import { useState } from "react";
import "./SearchForm.css";

function SearchForm({ onSearch }) {
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [type, setType] = useState("Movie");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ title, year, type });
    };

    return (
        <div className="search-wrapper">
            <form className="search-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Movie title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <input
                    type="number"
                    placeholder="Year (optional)"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    min={1888}
                    max={new Date().getFullYear()}
                />

                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="Movie">Movie</option>
                    <option value="Series">Series</option>
                </select>

                <button type="submit">Search</button>
            </form>
        </div>

    );
}

export default SearchForm;
