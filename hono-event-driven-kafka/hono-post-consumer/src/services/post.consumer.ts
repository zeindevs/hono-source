import kafkaConfig from "../config/kafka";
import PostModel from "../model/posts";

export const postConsumer = async () => {
  const messages: any[] = [];
  let processing = false;

  try {
    await kafkaConfig.subscribeTopic("post");
    await kafkaConfig.consume(async (message) => {
      messages.push(message);
      console.log("Message received:", message);

      if (message.length > 100) {
        //TODO: save into database : bulk insertion
        processMessages();
      }

      setInterval(processMessages, 5000); // run every 5 seconds
    });
  } catch (error) {
    console.error("Error consuming message:", error);
  }

  async function processMessages() {
    if (messages.length > 0 && !processing) {
      processing = true;
      const batchToProcess = [...messages];
      messages.length = 0;

      try {
        await PostModel.insertMany(batchToProcess, { ordered: false });
        console.log("Bulk insertion completed");
      } catch (error) {
        console.log("Error inserting messages:", error);
        messages.push(...batchToProcess);
      } finally {
        processing = false;
      }
    }
  }
};
