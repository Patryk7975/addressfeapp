import axios from "axios";

const baseUrl = "https://localhost:7266/";

export const GetCities = async (city: string | null, postalCode: string | null) => {
  const url = `${baseUrl}addresses/find-cities`;

  try {
    const response = await axios.post<string[]>(url, {
      city,
      postalCode,
    }, { headers: { "Content-Type": "application/json" } }
);

    console.log("Odpowiedź:", response.data);
    return response.data; 
  } catch (error) {
    console.error("Błąd podczas pobierania miast:", error);
    throw error;
  }
};

export const GetStreets = async (city: string | null, street: string | null, postalCode: string | null) => {
  const url = `${baseUrl}addresses/find-streets`;

  try {
    const response = await axios.post<string[]>(url, {
      city,
      street,
      postalCode,
    }, { headers: { "Content-Type": "application/json" } }
);

    console.log("Odpowiedź:", response.data);
    return response.data; 
  } catch (error) {
    console.error("Błąd podczas pobierania ulic:", error);
    throw error;
  }
};

export const GetPostalCodes = async (city: string | null, street: string | null, postalCode: string | null) => {
  const url = `${baseUrl}addresses/find-postal-codes`;

  try {
    const response = await axios.post<string[]>(url, {
      city,
      street,
      postalCode,
    }, { headers: { "Content-Type": "application/json" } }
);

    console.log("Odpowiedź:", response.data);
    return response.data; 
  } catch (error) {
    console.error("Błąd podczas pobierania kodow pocztowych:", error);
    throw error;
  }
};