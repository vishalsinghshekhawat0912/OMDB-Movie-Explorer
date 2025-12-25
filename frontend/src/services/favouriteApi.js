const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

if(!API_BASE_URL){
    throw new Error("No backend url present");
}

const handleResponse = async (res) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Something went wrong");
  }
  return res.json();
};

export const addFavourite = async (movie) => {
  try {
    const res = await fetch(`${API_BASE_URL}favourites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movie),
    });

    await handleResponse(res);
    return true;
  } catch (error) {
    console.error("Add favourite failed:", error.message);
    throw error;
  }
};

export const getFavourites = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}favourites`);
    const result = await handleResponse(res);
    return result.data || result;
  } catch (error) {
    console.error("Fetch favourites failed:", error.message);
    return []; // safe fallback
  }
};

export const getFavouriteDetails = async (title, year, type) => {
  try {
    const params = new URLSearchParams({ title, year, type });
    const res = await fetch(`${API_BASE_URL}favourites?${params}`);
    const result = await handleResponse(res);
    return result.data || result;
  } catch (error) {
    console.error("Fetch favourite details failed:", error.message);
    throw error;
  }
};
