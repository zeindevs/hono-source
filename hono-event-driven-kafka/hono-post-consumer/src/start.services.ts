import { connectDb } from "./config/db.config";
import kafkaConfig from "./config/kafka";
import { postConsumer } from "./services/post.consumer";

export const init = async () => {
  try {
    await connectDb();
    await kafkaConfig.connect();
    await postConsumer()
  } catch (error) {
    console.error("Failed initializing services:", error);
    process.exit(1);
  }
};
