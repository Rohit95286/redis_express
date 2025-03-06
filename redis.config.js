const redis = require("redis");
let redisClient;

(async () => {
  redisClient = redis?.createClient({
 socket: {
      host: "red-cv4llt0fnakc73bplbb0", // Remove "redis://"
      port: 6379, // Keep the port as is
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
