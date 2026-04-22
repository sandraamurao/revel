import type { Issue } from "../utils/compareJson";

export async function getAiExplanation(issues: Issue[]) {
	try {
		const response = await fetch(
			"http://localhost:3000/analyze ", 
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ issues }),
			},
		);
		console.log("response ai: ", response);
		const data = await response.json();
		console.log("data ai: ", data);
		return data.explanation; 
	} catch (e) {
		console.error(e);
	}
}
