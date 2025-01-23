import axios from "axios";

export async function getMedicines(apiUrl, userId) {
  let url = `${apiUrl}/get-meds`;
  return await axios
    .get(url, {
      params: {
        userId: userId,
      },
    })
    .then((res) => {
      return res.data?.medicines;
    })
    .catch((err) => {
      console.log("error in getMedicines -------------------> ", err);
    });
}

// fetch daily quotes:

export const fetchDailyQuote = async () => {
  return await axios
    .get("https://affirmations.dev")
    .then((res) => res.data.affirmation)
    .catch((err) => console.log("quote api ->", err));
};
