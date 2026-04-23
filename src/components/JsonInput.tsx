import { useState } from "react";
import { useApiState } from "../store/useStore";
import compareJson from "../utils/compareJson";
import { getAiExplanation } from "../services/api";

function JsonInput() {
	const [activeTextArea, setActiveTextArea] = useState("Request");

	// Set api states
	// set comparison mode
	const setSourceOfTruth = useApiState((state) => state.setSourceOfTruth);
	const sourceOfTruth = useApiState((state) => state.sourceOfTruth);

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

	const apiLabels = ["Request", "Response"]; // for displaying which api input textarea to show

	function handleOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		if (activeTextArea == "Request") {
			setRequest(e.target.value);
		} else {
			setResponse(e.target.value);
		}
	}

	function setMode(mode: string) {
		setSourceOfTruth(mode);
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
				const issues =
					sourceOfTruth === "Request"
						? compareJson(request, response, "")
						: compareJson(response, request, "");
				console.log("issues", issues);
				setIssues(issues);
				const explanation =
					sourceOfTruth === "Request"
						? await getAiExplanation(issues, request, response, sourceOfTruth)
						: await getAiExplanation(issues, response, request, sourceOfTruth);
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
					{apiLabels.map((filter) => (
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
						>
							{" "}
						</textarea>
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
						>
							{" "}
						</textarea>
					)}
				</div>

				<div>
					<div className="relative inline-flex items-start">
						<span>Source of truth:</span>
						<div className="relative group ml-1 -mt-1">
							<span className="cursor-pointer text-gray-400 text-xs">?</span>
							<div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded w-48 z-10 left-0 top-4">
								Choose which side is the expected object format to follow.
							</div>
						</div>
					</div>
					<div className="flex flex-row items-center gap-4">
						{apiLabels.map((filter) => (
							<button
								key={filter}
								onClick={() => setMode(filter)}
								className={`border  rounded-[7px] p-1.5 ${sourceOfTruth === filter ? "border border-[#088f25] bg-[#41aa57]/25" : "border-transparent"}`}
							>
								<div className=" flex flex-row items-center gap-2">
									{filter}
									{sourceOfTruth === filter && <div> ✅ </div>} {""}
								</div>
							</button>
						))}
					</div>
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
