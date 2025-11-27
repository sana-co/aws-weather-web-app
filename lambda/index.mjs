const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

export const handler = async (event) => {
  try {
    const query = event.queryStringParameters || {};
    const city = query.city || "London"; // default

    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      throw new Error("No WEATHER_API_KEY set");
    }

    const url = `${baseUrl}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Weather API error: ${res.status}`);
    }
    const data = await res.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",       
        "Access-Control-Allow-Methods": "GET"
      },
      body: JSON.stringify({
        city: data.name,
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        description: data.weather[0].description
      })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: err.message })
    };
  }
};