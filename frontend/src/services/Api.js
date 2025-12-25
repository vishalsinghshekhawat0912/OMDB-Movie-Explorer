const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

if(!API_BASE_URL){
    throw new Error("No backend url present");
}

export const getMovieDetails = async ({ title, year, type }) => {
  if (!title) {
    throw new Error("Title is required");
  }

  const params = new URLSearchParams();
  params.append("title", title);

  if (year) params.append("year", year);
  if (type) params.append("type", type);

  const url = `${API_BASE_URL}movie?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    console.log(response);
    throw new Error(`HTTP Error: ${response.status}`);
  }

  const result = await response.json();

  if (!result.status) {
    throw new Error(result.message || "Failed to fetch movie");
  }

  return result.data;
};

