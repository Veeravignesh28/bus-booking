const BASE_URL = "http://localhost:8080";

export async function fetchApi(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    
    // Set headers
    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };

    // Attach JWT if available
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    const config = {
        ...options,
        headers
    };

    const res = await fetch(url, config);
    
    // For 204 No Content
    if (res.status === 204) {
        return null;
    }
    
    let data;
    try {
        data = await res.json();
    } catch (e) {
        data = null;
    }

    if (!res.ok) {
        console.error("API Error Response:", res.status, res.statusText, data);
        throw new Error((data && data.error) || "An error occurred");
    }

    return data;
}
