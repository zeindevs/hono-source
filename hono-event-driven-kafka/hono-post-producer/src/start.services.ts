import kafkaConfig from "./config/kafka";

export const init = async () => {
  try {
    await kafkaConfig.connect();
    await kafkaConfig.createTopic("post");
  } catch (error) {
    console.log("Error initializing services:", error);
    process.exit(1);
  }
};
