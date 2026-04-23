const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
	const { issues, expectedApiInput, actualApiInput, sourceOfTruth } = req.body;

	const request =
		sourceOfTruth === "Request" ? expectedApiInput : actualApiInput;
	const response =
		sourceOfTruth === "Response" ? expectedApiInput : actualApiInput;
	const truth = sourceOfTruth === "Request" ? "Request" : "Response";
	const shouldChange = sourceOfTruth === "Request" ? "Response" : "Request";

	const prompt = `You are a senior software engineer reviewing an API mismatch by using the analysis (analyzed issues) and, looking at the full JSON request and response.
			Each Issue is just an object with 4 properties:
			field — where the problem is. e.g. "userId" or "address.zip" for nested fields
			issue — what type of problem it is. e.g. "Missing field" or "Type mismatch"
			expected — what the source of truth (mode) has. e.g. "userId" or "number"
			actual — what the other side has (opposite of mode). e.g. "user_id" or "string" or "undefined"

			Here are the analyzed issues:
			${JSON.stringify(issues, null, 2)}
			
			Be concise. You need to do:
			1. A summary paragraph explaining the problems. Start directly with the explanation. NO heading, NO label, NO bold title before it. Just the paragraph text of the explanation immediately.
			2. After the summary, write "Suggested Fixes" as a heading, followed by a bulleted list of exact fixes only. No extra explanation in the bullets, just the fix.

			Request JSON:
			${JSON.stringify(request, null, 2)}

			Response JSON:
			${JSON.stringify(response, null, 2)}

			Mode: ${truth}
			Mode is for following which json object should be expected. 
			The ${truth} JSON is the source of truth. 
			The ${shouldChange} JSON must be updated to match it.
			Explain what the ${shouldChange} is doing wrong.
			Suggested fixes should tell the developer what to change in the ${shouldChange}.
			NOTE: DO NOT MENTION ANYTHING ABOUT THE MODE! Never include any info about this mode in the explanation!

			Keep the total response under or maximum of 200 words.`;

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
					model: "meta-llama/Llama-3.1-8B-Instruct:cerebras",
					messages: [{ role: "user", content: prompt }],
					max_tokens: 1500,
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
