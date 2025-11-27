# aws-weather-web-app
Serverless weather app using AWS Lambda, API Gateway, CloudFront, and S3
# 🌦️ AWS Serverless Weather App

This is a fully serverless weather application built using **AWS CloudFront, S3, Lambda, and API Gateway**.  
The app fetches real-time weather data for any city and displays it on a custom-built website hosted on AWS.

---

## 🚀 Project Overview

This project includes:

### ✔️ **Frontend (Static Website)**
- Hosted on **Amazon S3**
- Delivered securely over **HTTPS** via **CloudFront**
- Calls backend API to fetch live weather data
- Users can type any city name and instantly get:
  - Temperature (°C)
  - Feels-like temperature
  - Weather description (clear sky, rain, etc.)
  - City name

### ✔️ **Backend (Weather API)**
Built using AWS serverless services:

- **AWS Lambda** (Node.js)
- **AWS API Gateway** (HTTP API)
- **OpenWeatherMap API** (external weather source)
- **Environment variable** for API key security

The endpoint returns clean JSON data:

```json
{
  "city": "Berlin",
  "temp": 3.17,
  "feels_like": -0.91,
  "description": "clear sky"
}
```

---

## 🏗️ Architecture Diagram

```
User
 │
 ▼
CloudFront (HTTPS + CDN)
 │
 ▼
S3 Static Website (Frontend)
 │
 ▼
API Gateway  →  Lambda Function  →  OpenWeather API
```

---

## 📁 Project Structure

```
aws-weather-app/
│
├── index.html          # Main website UI
├── style.css           # Styling (optional)
├── script.js           # API call logic (optional)
│
├── lambda/
│   └── index.js        # Weather Lambda function
│
└── README.md
```

---

## 🔧 Lambda Function Code (index.js)

```javascript
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

export const handler = async (event) => {
  try {
    const query = event.queryStringParameters || {};
    const city = query.city || "London";

    const apiKey = process.env.WEATHER_API_KEY;

    const url = `${baseUrl}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    const res = await fetch(url);
    const data = await res.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        city: data.name,
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        description: data.weather[0].description
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message })
    };
  }
};
```

---

## 🔑 Environment Variables

Go to:

**Lambda → Configuration → Environment variables**

Add:

| Key              | Value                           |
|------------------|---------------------------------|
| WEATHER_API_KEY  | Your OpenWeatherMap API key     |

---

## 🌐 API Endpoint Example

After deploying via API Gateway:

```
https://your-api-id.execute-api.eu-north-1.amazonaws.com/weather-api?city=Berlin
```

You can replace the city:

```
?city=London
?city=Tokyo
?city=Paris
```

---

## 🌍 Hosting via CloudFront (HTTPS)

The static website is distributed globally with:

- Free HTTPS (TLS certificate managed by CloudFront)
- Global caching
- Fast delivery

The final website is accessible using a CloudFront domain like:

```
https://dxxxxxxxxxxx.cloudfront.net/
```

(No custom domain required.)

---

## 🧪 Sample Frontend Code

Add this to your `index.html` to call the weather API:

```html
<script>
const API_URL = "https://your-cloudfront-or-api-url/weather-api";

async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const response = await fetch(`${API_URL}?city=${city}`);
  const data = await response.json();
  document.getElementById("result").innerText = JSON.stringify(data, null, 2);
}
</script>
```

---

## 🛠️ AWS Services Used

- **Amazon S3** — Static website hosting  
- **Amazon CloudFront** — HTTPS + CDN  
- **AWS Lambda** — Serverless compute  
- **Amazon API Gateway** — Secure API endpoint  
- **AWS Certificate Manager** — Managed SSL  
- **OpenWeather API** — Weather data source  

---

## 📜 License

This project is licensed under the MIT License.  
Feel free to use or modify it for your own learning.

---

## 👤 Author

**Sanuth**  
Serverless Weather Application — AWS Cloud Project  
