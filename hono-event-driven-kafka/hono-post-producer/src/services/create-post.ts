import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import kafkaConfig from "../config/kafka";

const app = new Hono();

app.post(
  "/create-post",
  zValidator(
    "json",
    z.object({
      title: z.string(),
      content: z.string(),
    }),
  ),
  async (c) => {
    const { title, content } = c.req.valid("json");

    try {
      await kafkaConfig.sendTopic("post", JSON.stringify({ title, content }));
    } catch (error) {
      console.error("Error sending message:", error);
      return c.json({ error: `Error sending message` }, 500);
    }
  },
);

export default app;
