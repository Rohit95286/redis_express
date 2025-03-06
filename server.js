const express = require("express");
const app = express();
const axios = require("axios");
const port = process.env.PORT || 3000;
const redisClient = require("./redis.config");

async function cacheData(req, res, next) {
  const species = req.params.species;
  let results;
  let isCached = false;

  try {
    const cacheResults = await redisClient.hGet("fish", species);
    let allKeys = await redisClient.hGetAll("fish");
    console.log(allKeys, "allKeys");

    // await redisClient.get(species);
    if (cacheResults) {
      isCached = true;
      results = JSON.parse(cacheResults);
      res.send({
        fromCache: isCached,
        data: results,
      });
    } else {
      next();
    }
  } catch (error) {
    next();
  }
}

async function getSpeciesData(req, res) {
  const species = req.params.species;
  let results;
  let isCached = false;
  try {
    results = await fetchApiData(species);
    // await redisClient.set(species, JSON.stringify(results), {EX: 30});
    // await redisClient.hSet("fish", species, JSON.stringify(results));
    // await redisClient.expire("fish", 30);
    res.send({
      fromCache: isCached,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
}

app.get("/fish/:species", cacheData, getSpeciesData);

async function fetchApiData(species) {
  const apiResponse = await axios.get(
    `https://www.fishwatch.gov/api/species/${species}`
  );
  console.log("Request sent to the API");
  return apiResponse.data;
}

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// KEY TAKE AWAYS :

// PART 1 >
// await redisClient.set(species, JSON.stringify(results), {EX: 30});
// await redisClient.hSet("fish", species, JSON.stringify(results));
// await redisClient.expire("fish", 30);

// PART 2 >
// await redisClient.get(species);
//  const cacheResults = await redisClient.hGet("fish", species);
// let allKeys = await redisClient.hGetAll("fish");
