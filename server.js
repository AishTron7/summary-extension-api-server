require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("© Aishwary Shukla 2023");
});

app.get("/summarize", (req, res) => {
  res.send("© Aishwary Shukla 2023");
});

app.post("/summarize", async (req, res) => {
  try {
    const reviews = req.body.reviews.join("\n\n");
    const prompt = `Summarize the following product reviews in 5 numbered points and at last mention the percentage of negative reviews. If no reviews are provided then just say 'Lack of reviews, make sure you're on the right page' and don't provide any summary. Here are the reviews:\n\n${reviews}\n\nSummary:\n`;  

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo-16k",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that summarizes product reviews when they are given to you. If no reviews are provided, you just say: 'Lack of reviews, make sure you're on the right page' and don't provide any summary. Don't repeat your points while summarising. Never mention the total number of reviews.",   //GPT sometimes cannot detect separation of reviews and thus gives wrong total no. of reviews therefore I have instructed it to not mention total no. of reviews for the time being. I have verified through console.logs that all reviews (max 10 pages) are supplied to it.
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 200,
        n: 1,
        temperature: 0.4,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    console.log(response.data);

    const summary = response.data.choices[0].message.content;

    console.log(summary);

    res.json({ summary });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the summary." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server has started successfully");
});
