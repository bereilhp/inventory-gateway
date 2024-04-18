import express from "express";
import { connectToDatabase, closeDatabase } from "./db.js";
import "dotenv/config";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(morgan("dev"));

app.post("/api/submit", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("inventory");
    const data = req.body;

    const existingData = await collection.findOne(data);
    if (existingData) {
      res.status(200).send(true);
    } else {
      await collection.insertOne(data);
      res.status(201).send(false);
    }
  } catch (error) {
    console.error("Database operation failed:", error);
    res.status(500).send(error.message);
  }
});

app.post("/api/check-inventory", async (req, res) => {
  try {
    const { checkResult } = req.body;

    if (typeof checkResult !== "boolean") {
      return res
        .status(400)
        .send("Invalid input: checkResult must be a boolean value.");
    }

    const db = await connectToDatabase();
    const collection = db.collection("inventoryCheck");
    const newTimestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });

    const document = {
      timestamp: new Date(),
      checkResult,
    };

    await collection.insertOne(document);
    res.status(201).send("Inventory check recorded successfully.");
  } catch (error) {
    console.error("Database operation failed:", error);
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Server Address is http://localhost:3456/");
});

process.on("SIGINT", async () => {
  console.log(" Closing the database connection.");
  await closeDatabase();
  process.exit(0);
});
