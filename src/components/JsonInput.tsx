import { useState } from "react";
import { useApiState } from "../store/useStore";
import compareJson from "../utils/compareJson";
import { getAiExplanation } from "../services/api";
import { Trash2 } from "lucide-react";

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
				setIssues(issues);

				const explanation =
					sourceOfTruth === "Request"
						? await getAiExplanation(issues, request, response, sourceOfTruth)
						: await getAiExplanation(issues, response, request, sourceOfTruth);

				if (explanation) setAiExplanation(explanation);
			}
			return null;
		} catch (err) {
			setError("Invalid JSON");
		}
	}

	return (
		<>
			<div
				id="api-input-container"
				className="border border-[#474747] bg-[#0b426d]/15 rounded-[27px] p-6 mb-5 "
			>
				<div
					id="api-input-header"
					className="flex flex-row justify-between mb-4"
				>
					<h1> API Input </h1>
					<div> Load example </div>
				</div>
				<div
					id="api-btn-container"
					className="flex flex-row max-[400px]:flex-col gap-6 max-[400px]:gap-4 mb-5"
				>
					{apiLabels.map((filter) => (
						<button
							key={filter}
							onClick={() => setActiveTextArea(filter)}
							className={`border border-transparent rounded-[7px] pl-3 pr-3 pt-1.5 pb-1.5 ${activeTextArea === filter ? "bg-[#4d379c]" : ""} hover:bg-[#1e2ba0]/35 hover:border-[#4d379c] `}
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
							className="w-full h-100 p-3 border border-[#474747] focus:border-blue-500 outline-none rounded-2xl overflow-auto"
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
							className="w-full h-100 p-3 border border-[#474747] focus:border-blue-500 outline-none rounded-2xl overflow-auto"
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
							<span className="cursor-pointer text-gray-400 text-s">?</span>
							<div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded w-48 z-10 left-0 top-4">
								Choose which side is the expected object format to follow.
							</div>
						</div>
					</div>
					<div className="flex flex-row items-center gap-4 max-[400px]:flex-col max-[400px]:gap-2 mb-5 mt-2">
						{apiLabels.map((filter) => (
							<button
								key={filter}
								onClick={() => setMode(filter)}
								className={`border rounded-[7px] pt-1.5 pb-1.5 pl-3 pr-3 ${sourceOfTruth === filter ? "border border-[#088f25] bg-[#41aa57]/25" : "border-transparent"} hover:bg-[#2e663a]/20 hover:border-[#21532c]`}
							>
								<div className=" flex flex-row items-center gap-2">
									{sourceOfTruth === filter && <div> ✅ </div>}
									{filter}
								</div>
							</button>
						))}
					</div>
				</div>

				<div id="btns-container" className="flex flex-row gap-6">
					<button
						className="flex-2 rounded-lg pt-2 pb-2 bg-[#4d379c] hover:bg-[#5857a5]"
						onClick={handleAnalyze}
					>
						Analyze
					</button>
					<button className="flex-1 border-[0.5px] border-[#836fb9] rounded-lg pt-2 pb-2 hover:bg-[#b91010] hover:border-[#eb5959]">
						<span className=" flex flex-row items-center justify-center-safe gap-2">
							<Trash2 className="w-5 h-5" />{" "}
							<span className="hidden min-[450px]:inline">Clear</span>
						</span>
					</button>
				</div>
			</div>
		</>
	);
}

export default JsonInput;
