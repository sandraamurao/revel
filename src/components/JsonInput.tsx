import { useState } from "react";
import { useApiState } from "../store/useStore";
import compareJson from "../utils/compareJson";
import { getAiExplanation } from "../services/api";

function JsonInput() {
	const [activeTextArea, setActiveTextArea] = useState("Request");

	// Set api states
	// request and response
	const setRequest = useApiState((state) => state.setRequest);
	const setResponse = useApiState((state) => state.setResponse);
	const requestJson = useApiState((state) => state.requestJson);
	const responseJson = useApiState((state) => state.responseJson);
	
	// set issues and error from api comparisons as states
	const setIssues = useApiState((state) => state.setIssues);
	const setError = useApiState((state) => state.setError);

	// set ai explanation
	const setAiExplanation = useApiState((state) => state.setAiExplanation);

	const apiTabs = ["Request", "Response"]; // for displaying which api input textarea to show 

	function handleOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		if (activeTextArea == "Request") {
			setRequest(e.target.value);
		} else {
			setResponse(e.target.value);
		}
	}

	async function handleAnalyze() {
		console.log("requestJson", requestJson);
		console.log("responseJson", responseJson);
		try {
			const request = JSON.parse(requestJson);
			const response = JSON.parse(responseJson);

			if (
				typeof request === "object" &&
				request !== null &&
				typeof response === "object" &&
				response !== null
			) {
				const issues = compareJson(request, response, "");
				console.log("issues", issues);
				setIssues(issues);
				const explanation = await getAiExplanation(issues);
				if (explanation) setAiExplanation(explanation);
			}
			return null;
		} catch (err) {
			console.log("error: ", err);
			setError("Invalid JSON");
		}
	}

	return (
		<>
			<div id="api-input-container" className="border border-[#474747] p-5">
				<div
					id="api-input-header"
					className="flex flex-row justify-between mb-4"
				>
					<h1> API Input </h1>
					<div> Load example </div>
				</div>
				<div id="api-btn-container" className="flex flex-row gap-7 mb-2">
					{apiTabs.map((filter) => (
						<button
							key={filter}
							onClick={() => setActiveTextArea(filter)}
							className={`border border-transparent rounded-[7px] p-1.5 ${activeTextArea === filter ? "bg-[#6f379c]" : ""}`}
						>
							{filter}
						</button>
					))}
				</div>

				<div id="request-textarea">
					{activeTextArea == "Request" && (
						<textarea
							onChange={handleOnChange}
							name="request"
							placeholder='{ "userId": 123, "data": {...} }'
							className="w-full p-3 border border-[#474747] focus:border-blue-500 outline-none"
							value={requestJson}
						> </textarea>
					)}
				</div>

				<div id="response-textarea" className="mb-4">
					{activeTextArea == "Response" && (
						<textarea
							onChange={handleOnChange}
							name="response"
							placeholder='{ "user_id": 123, "action": "fetch_data" }'
							className="w-full p-3 border border-[#474747] focus:border-blue-500 outline-none"
							value={responseJson}
						> </textarea>
					)}
				</div>

				<div id="btns-container" className="flex flex-row gap-6">
					<button className="flex-2 border" onClick={handleAnalyze}>
						{" "}
						Analyze{" "}
					</button>
					<button className="flex-1 border"> Clear </button>
				</div>
			</div>
		</>
	);
}

export default JsonInput;
