const redis = require("redis");
let redisClient;

(async () => {
  redisClient = redis?.createClient({
     url: "redis://red-cv4llt0fnakc73bplbb0:6379"
  });

  redisClient.on("error", error => console.error(`Error: ${error}`));
  redisClient.on("connect", () => console.error(`Connected to redis!!!`));

  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Redis Connection Error:", error);
  }
})();

module.exports = redisClient;
