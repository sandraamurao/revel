//import { useApiState } from "../store/useStore";
import { useState } from "react";
import { useApiState } from "../store/useStore";

function JsonInput() {
	const [activeTextArea, setActiveTextArea] = useState("Request");
	const setRequest = useApiState((state) => state.setRequest);
	const setResponse = useApiState((state) => state.setResponse);
	const apiTabs = ["Request", "Response"];

	function handleOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		if (activeTextArea == "Request") {
			setRequest(e.target.value);
		}
		else {
			setResponse(e.target.value);
		}
	}

	return (
		<>
			<div id="api-input-container" className="border border-[#474747] p-5">
				<div id="api-input-header" className="flex flex-row justify-between mb-4">
					<h1> API Input </h1>
					<div> Load example </div>
				</div>
				<div id="api-btn-container" className="flex flex-row gap-4 mb-2">
					{apiTabs.map((filter) => (
						<button
							key={filter}
							onClick={() => setActiveTextArea(filter)}
							className={`${activeTextArea === filter ? "bg-[#6f379c] rounded-[7px] p-1.5" : ""}`}
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
						>
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
						>
						</textarea>
					)}
				</div>

				<div id="btns-container" className="flex flex-row gap-6">
					<button className="flex-2 border"> Analyze </button>
					<button className="flex-1 border"> Clear </button>
				</div>
			</div>
		</>
	);
}

export default JsonInput;
