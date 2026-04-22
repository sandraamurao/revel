const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
	const { issues } = req.body;
	const prompt = `You are a senior software engineer. Analyze these API issues and for each:
            1. Identify the issues
            2. Explain root cause
            3. Suggest fixes
            
            Here are the API Issues:
            ${JSON.stringify(issues, null, 2)}`;

	try {
		const response = await fetch(
			"https://router.huggingface.co/v1/chat/completions",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${process.env.HF_API_KEY}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					model: "meta-llama/Llama-3.1-8B-Instruct",
					messages: [{ role: "user", content: prompt }],
					max_tokens: 500,
				}),
			},
		);
		console.log("response ai: ", response);
		const data = await response.json();
		res.json({ explanation: data.choices[0].message.content });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "AI request failed" });
	}
});

app.listen(3000, () => console.log("Server running on port 3000"));
