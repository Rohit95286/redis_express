

# 🚀 Redis-Powered API Caching with Node.js & Express  

This project demonstrates how to integrate **Redis** as a caching layer in a **Node.js & Express** application. It efficiently stores and retrieves fish species data using the [FishWatch API](https://www.fishwatch.gov/), reducing API response times and improving performance.  

---

## ✨ Features  
✨ Features
✅ 🚀 8x Faster API Responses – Reduces response time from 2 seconds to ~250ms ⚡
🐠 Efficient Caching – Stores fish species data in Redis to minimize redundant API calls
⏳ Time-Based Expiry – Ensures fresh data by expiring cached data every 30 seconds
⚡ Optimized Middleware – Implements caching as Express middleware for seamless integration

---

## 🛠 Tech Stack  

| Tech | Description |
|------|------------|
| ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) | JavaScript runtime for backend development |
| ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) | Fast and minimalist web framework for Node.js |
| ![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white) | In-memory caching for fast response times |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white) | HTTP client for API calls |

---

## 🚀 Getting Started 

### 1️⃣ Install Dependencies  
```sh
npm install express axios redis nodemon
```

### 2️⃣ Set Up Redis  
Ensure Redis is running on `localhost:6380`. Start Redis with:  
```sh
redis-server
```

---

### 3️⃣ Create Files and Paste the Code Below  

#### 📌 **Create `redis.config.js`**  
```javascript
const redis = require("redis");
let redisClient;

(async () => {
  redisClient = redis.createClient({
    socket: {
      host: "127.0.0.1",
      port: 6380, // Change port if needed
    },
  });

  redisClient.on("error", error => console.error(`❌ Redis Error: ${error}`));
  redisClient.on("connect", () => console.log("✅ Connected to Redis!"));

  try {
    await redisClient.connect();
  } catch (error) {
    console.error("❌ Redis Connection Error:", error);
  }
})();

module.exports = redisClient;
```

---

#### 📌 **Create `server.js`**  
```javascript
const express = require("express");
const axios = require("axios");
const redisClient = require("./redis.config");

const app = express();
const port = process.env.PORT || 3000;

async function cacheData(req, res, next) {
  const species = req.params.species;

  try {
    const cacheResults = await redisClient.hGet("fish", species);
    if (cacheResults) {
      return res.json({
        fromCache: true,
        data: JSON.parse(cacheResults),
      });
    }
    next();
  } catch (error) {
    next();
  }
}

async function getSpeciesData(req, res) {
  const species = req.params.species;
  try {
    const results = await fetchApiData(species);
    await redisClient.hSet("fish", species, JSON.stringify(results));
    await redisClient.expire("fish", 30);

    res.json({
      fromCache: false,
      data: results,
    });
  } catch (error) {
    console.error("❌ API Fetch Error:", error);
    res.status(404).send("❌ Data unavailable");
  }
}

app.get("/fish/:species", cacheData, getSpeciesData);

async function fetchApiData(species) {
  const apiResponse = await axios.get(
    `https://www.fishwatch.gov/api/species/${species}`
  );
  console.log("🌍 Request sent to the API");
  return apiResponse.data;
}

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
```

---

### 4️⃣ Run the Server  
Start the project using:  
```sh
node server.js
# OR use nodemon for auto-restarts
nodemon server.js
```

---

### 5️⃣ Test the API  

Fetch species data from Redis-powered API:  
```sh
curl http://localhost:3000/fish/tuna
```
✅ **First request** fetches data from API  
♻️ **Subsequent requests** retrieve cached data from Redis  

---

## 📌 Key Redis Commands Used  
```javascript
await redisClient.hSet("fish", species, JSON.stringify(results)); // Store in Redis
await redisClient.expire("fish", 30); // Set expiration time
const cacheResults = await redisClient.hGet("fish", species); // Retrieve from Redis
```

---

## 📊 Flow Diagram  

### **How Redis Caching Works in This Project**  
![Redis API Caching Diagram](https://www.enterprisedb.com/sites/default/files/inline-images/Redis.png)  

1️⃣ **User Requests Data** → Server checks Redis cache  
2️⃣ **Cache Hit?** → If yes ✅, return cached data  
3️⃣ **Cache Miss?** → If no ❌, fetch data from the API  
4️⃣ **Store in Redis** → Data is cached for 30 seconds  
5️⃣ **Return Response** → Cached data improves performance  

---

## 🛠 Troubleshooting  
❌ **Redis not running?** Start Redis with:  
```sh
redis-server
```
🔄 **Want auto-restart for development?** Use:  
```sh
nodemon server.js
```

---

## 📢 Contributions & Issues  
Feel free to open an issue or submit a pull request for improvements! 🚀🔥  

---

### ✅ **Now You Have a Complete Setup with Redis Caching!** 🚀  
