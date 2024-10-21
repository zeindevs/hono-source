import { Admin, Kafka, logLevel, Consumer } from "kafkajs";

class KafkaConfig {
  private kafka: Kafka;
  private consumer: Consumer;
  private admin: Admin;
  private brokers: string;

  constructor() {
    this.brokers = process.env.KAFKA_BROKERS || ":9091";
    this.kafka = new Kafka({
      clientId: `post-producer`,
      brokers: [this.brokers],
      logLevel: logLevel.ERROR,
    });
    this.consumer = this.kafka.consumer({
      groupId: "post-consumer",
    });
    this.admin = this.kafka.admin();
  }

  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      await this.admin.connect();
      console.log("Kafka connected");
    } catch (error) {
      console.error("Error connecting to Kafka:", error);
    }
  }

  async subscribeTopic(topic: string): Promise<void> {
    try {
      await this.consumer.subscribe({
        topic,
        fromBeginning: true,
      });
      console.log("Subscribed to topic:", topic);
    } catch (error) {
      console.error("Error subscribing to topic:", error);
    }
  }

  async consume(callback: (message: any) => void): Promise<void> {
    try {
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log("Message received:", {
            topic,
            partition,
            value: message.value?.toString(),
          });
          callback(JSON.parse(message?.value?.toString()!));
        },
      });
    } catch (error) {
      console.error("Error consuming message:", error);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.consumer.disconnect();
      console.log("Kafka disconnected");
    } catch (error) {
      console.error("Error disconnecting from Kafka:", error);
    }
  }
}

export default new KafkaConfig();
