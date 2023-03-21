require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const openai = require("openai");

openai.apiKey = process.env.OPENAI_API_KEY;

const app = express();

app.use(cors());
app.use(express.json());

app.post("/summarize", async (req, res) => {
  try {
    const reviews = req.body.reviews.join("\n\n");
    const prompt = `Summarize the following product reviews in 5 numbered points and at last mention the percentage of negative reviews. If reviews are less than or equal to 5 then just say 'A summary is not required due to lack of reviews'. Reviews:\n\n${reviews}\n\nSummary:\n`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that summarizes product reviews when the reviews given to you are more than 5, if they are less than or equal to 5 then you just say 'A summary is not required due to lack of reviews'",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 200,
        n: 1,
        stop: null,
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
