import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Webhook test" });
});

app.get("/webhook", (req, res) => {
  try {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    const myToken = "token";

    if (mode && token) {
      if (mode === "subscribe" && token === myToken) {
        console.log("WEBHOOK_VERIFIED");
        return res.status(200).send(challenge);
      } else {
        return res.sendStatus(403);
      }
    }
  } catch (err) {
    return res.status(400).json({ message: "error", webhook: req.body });
  }
});

app.post("/webhook", (req, res) => {
  try {
    let body = req.body;
    console.log(JSON.stringify(body));

    if (body.object === "page") {
      body.entry.forEach(function (entry) {
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
      });
      res.status(200).send("EVENT_RECEIVED");
    } else {
      res.sendStatus(404);
    }

    return res.status(200).json({ message: "success", webhook: req.body });
  } catch (err) {
    return res.status(400).json({ message: "error", webhook: req.body });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
