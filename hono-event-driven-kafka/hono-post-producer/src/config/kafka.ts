import { Admin, Kafka, logLevel, Producer } from "kafkajs";

class KafkaConfig {
  private kafka: Kafka;
  private producer: Producer;
  private admin: Admin;
  private brokers: string;

  constructor() {
    this.brokers = process.env.KAFKA_BROKERS || ":9091";
    this.kafka = new Kafka({
      clientId: `post-producer`,
      brokers: [this.brokers],
      logLevel: logLevel.ERROR,
    });
    this.producer = this.kafka.producer();
    this.admin = this.kafka.admin();
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      await this.admin.connect();
      console.log("Kafka connected");
    } catch (error) {
      console.error("Error connecting to Kafaka:", error);
    }
  }

  async createTopic(topic: string): Promise<void> {
    try {
      await this.admin.createTopics({
        topics: [{ topic, numPartitions: 1 }],
      });
      console.log("Topic created:", topic);
    } catch (error) {
      console.error("Error creating topic:", error);
    }
  }

  async sendTopic(topic: string, messages: string): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: messages }],
      });
      console.log("Message sent to topic:", topic);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
}

export default new KafkaConfig();
