import { useState } from "react";
import { useApiState } from "../store/useStore";
import compareJson from "../utils/compareJson";
import { getAiExplanation } from "../services/api";
import { Trash2, X } from "lucide-react";
import { flattenObject } from "../utils/flattenObject";

function JsonInput() {
	const [activeTextArea, setActiveTextArea] = useState("Request");

	// Loading states
	const setIsLoading = useApiState((state) => state.setIsLoading);

	// Set api states
	// set comparison mode
	const setSourceOfTruth = useApiState((state) => state.setSourceOfTruth);
	const sourceOfTruth = useApiState((state) => state.sourceOfTruth);

	// request and response
	const setRequest = useApiState((state) => state.setRequest);
	const setResponse = useApiState((state) => state.setResponse);
	const requestJson = useApiState((state) => state.requestJson);
	const responseJson = useApiState((state) => state.responseJson);
	const setAnalyzedRequest = useApiState((state) => state.setAnalyzedRequest);
	const setAnalyzedResponse = useApiState((state) => state.setAnalyzedResponse);

	// set issues and error from api comparisons as states
	const setIssues = useApiState((state) => state.setIssues);
	const error = useApiState((state) => state.error);
	const setError = useApiState((state) => state.setError);
	const issues = useApiState((state) => state.issues);

	// set ai explanation
	const setAiExplanation = useApiState((state) => state.setAiExplanation);

	const apiLabels = ["Request", "Response"]; // for displaying which api input textarea to show

	function handleOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		if (issues.length > 0) {
			setIssues([]);
			setError("");
			setAiExplanation("");
		}

		if (activeTextArea == "Request") {
			setRequest(e.target.value);
		} else {
			setResponse(e.target.value);
		}
	}

	function clearAllTextArea() {
		setRequest("");
		setResponse("");
		setIssues([]);
		setAiExplanation("");
	}
	
	function clearActiveTextArea() {
		if (activeTextArea === "Request")
			setRequest("");
		else
			setResponse("");

		setIssues([]);
		setAiExplanation("");
	}

	function setMode(mode: string) {
		// clear previous analysis when mode switches
		// this way, analysispanel won't show the wrong, unexpected issues
		// and user should be prompted to click "Analyze" again
		setIssues([]);
		setError("");
		setAiExplanation("");

		// set the source of truth
		setSourceOfTruth(mode);
	}

	function loadExample() {
		const request = {
			userId: 42,
			firstName: "Alice",
			emailAddress: "alice@email.com",
			isActive: true,
			createdAt: "2026-04-15",
			order: {
				orderId: "ORD-001",
				amount: 99.99,
				items: 3,
			},
		};

		const response = {
			user_id: 42,
			firstName: "Alice",
			email_address: "alice@email.com",
			isActive: "true",
			order: {
				orderId: "ORD-001",
				amount: 99.99,
			},
			status: "active",
		};

		setRequest(JSON.stringify(request, null, 2));
		setResponse(JSON.stringify(response, null, 2));
	}

	async function handleAnalyze() {
		if (error.length) setError("") // reset previous error (when user re-analyzes due to an error on their previous input)
		setIsLoading(true);
		let request, response;
		let errors = [];

		try { request = JSON.parse(requestJson) } 
		catch (e) { if (e instanceof SyntaxError) errors.push(`Request: ${e.message}\n`) }

		try { response = JSON.parse(responseJson) } 
		catch (e) { if (e instanceof SyntaxError) errors.push(`Response: ${e.message}\n`) }

		if (errors.length) {
			console.log(errors)
			setError(errors.join("\n"))
			setIsLoading(false)
			return
		} else {
			const flatRequest = flattenObject(request);
			const flatResponse = flattenObject(response);

			// Save the request and response right when user clicks "Analyze"
			setAnalyzedRequest(requestJson)
			setAnalyzedResponse(responseJson)

			try {
				if (
					typeof request === "object" &&
					request !== null &&
					typeof response === "object" &&
					response !== null
				) {
					const issues =
						sourceOfTruth === "Request"
							? compareJson(flatRequest, flatResponse, "")
							: compareJson(flatResponse, flatRequest, "");
					setIssues(issues);

					const explanation =
						sourceOfTruth === "Request"
							? await getAiExplanation(issues, request, response, sourceOfTruth)
							: await getAiExplanation(issues, response, request, sourceOfTruth);

					if (explanation) setAiExplanation(explanation);
				}
			} catch (e) { 
				console.log(e) 
				setError(`Error on getting an AI explanation: ${e}`) 
			} finally { setIsLoading(false) }
		}
	}

	return (
		<>
			<div
				id="api-input-container"
				className="h-full flex flex-col border border-[#474747] bg-[#0b426d]/15 rounded-[27px] p-6"
			>
				<div
					id="api-input-header"
					className="flex flex-row justify-between mb-6"
				>
					<h1 className="font-bold text-xl"> API Input </h1>
					<button
						onClick={loadExample}
						className="border border-[#4d379c] bg-[#20348a]/40 pr-3 pl-3 pt-2 pb-2 rounded-2xl font-mono hover:bg-[#20348a]"
					>
						
						Load example
					</button>
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

				<div id="textarea-input" className="mb-4 flex-1 relative">
					<button
						onClick={clearActiveTextArea}
						className="absolute top-2 right-2 bg-[#1a1f31] border border-[#474747] rounded-lg px-2 py-1 text-xs hover:bg-red-900/30 hover:border-red-500"
					>
						<X className="w-4 h-4 text-red-500" />
					</button>
					<textarea
						onChange={handleOnChange}
						name={sourceOfTruth}
						placeholder='{ "userId": 123, "data": {...} }'
						className="font-mono w-full h-full min-h-112.5 p-3 border border-[#474747] focus:border-blue-500 outline-none rounded-2xl resize-none"
						value={activeTextArea === "Request" ? requestJson : responseJson}
					>
					</textarea>
				</div>
				
				{/* Display Error message */}
				{error && (
					<div className=" mb-4 text-red-500"> 
						{error.split('\n').map((e, i) => ( 
							<p key={i}>{e}</p>	
						))}
 					</div>
				)}

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
					<button
						onClick={clearAllTextArea}
						className="flex-1 border-[0.5px] border-[#836fb9] rounded-lg pt-2 pb-2 hover:bg-[#b91010] hover:border-[#eb5959]"
					>
						<span className=" flex flex-row items-center justify-center-safe gap-2">
							<Trash2 className="w-5 h-5" />
							<span className="hidden min-[450px]:inline">Clear All</span>
						</span>
					</button>
				</div>
			</div>
		</>
	);
}

export default JsonInput;
