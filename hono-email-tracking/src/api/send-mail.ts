import { Hono } from "hono";
import { v4 as uuid } from "uuid";
import Track from "../model/track.model";
import { sendMail } from "../utils/send-mail";

const app = new Hono();

app.post("/send-mail", async (c) => {
  const { emails, password } = await c.req.json();

  // form validation
  if (!emails || !password)
    return c.json({ error: "Emails and password are required" });

  // password validation
  if (password !== Bun.env.PASSWORD) return c.json({ error: "Password wrong" });

  // tracking id, data store => db
  const trackingId = uuid();

  try {
    await Track.create({ trackingId });
    // mail sending...
    await sendMail(emails, trackingId);

    return c.json({
      trackingId: trackingId,
      message: "Email send successfully",
    });
  } catch (error) {
    console.log(error);
    return c.json({ error: "Failed to send email" });
  }
});

export default app;
