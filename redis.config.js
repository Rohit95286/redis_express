const redis = require("redis");
let redisClient;

(async () => {
  redisClient = redis?.createClient({
    socket: {
      host: process.env.REDIS_CLOUD,
      port: 6379, // Change port if needed

    },
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
