import { useApiState } from "../store/useStore";
import { AlertTriangle, XCircle } from "lucide-react";
import type { Issue } from "../utils/compareJson";

function AnalysisPanel() {
	const issues = useApiState((state) => state.issues);
	const error = useApiState((state) => state.error);
	const sourceOfTruth = useApiState((state) => state.sourceOfTruth);

	const colorCodes = {
		"Naming mismatch": "border-[#ffee00]",
		"Missing field": "border-[#aa1e1e]",
		"Type mismatch": "border-[#ff9100]",
	};

	function getDisplayMessage(issue: Issue) {
		if (issue.issue === "Naming mismatch")
			return `${sourceOfTruth} expects ${issue.expected}, but ${sourceOfTruth === "Response" ? "request" : "response"} uses ${issue.actual}`;
		if (issue.issue === "Missing field")
			return `Field exists in ${sourceOfTruth.toLowerCase()} but missing in ${sourceOfTruth === "Response" ? "request" : "response"}`;
		if (issue.issue === "Type mismatch")
			return `Expected ${issue.expected.toLowerCase()}, received ${issue.actual.toLowerCase()} in ${sourceOfTruth === "Response" ? "request" : "response"}`;
	}

	return (
		<>
			<div className="border border-[#474747] bg-[#0b426d]/15 rounded-[27px] p-6 mb-5">
				{
					!issues.length && error && (
						<div> {error} </div>
					) /* Displays "Invalid JSON" message */
				}

				{issues.length > 0 && (
					<>
						<h1> Analysis </h1>

						<div className="mt-3 mb-4"> ⚠️ Detected Issues </div>
						<div>
							{issues.map((issue, index) => (
								<div key={index} className="mb-3">
									<div
										className={`flex flex-col border ${colorCodes[issue.issue as keyof typeof colorCodes]} rounded-lg p-3 bg-[#1a1f31]`}
									>
										<div className="flex flex-row items-center gap-3">
											{/* Icons */}
											{issue.issue == "Naming mismatch" ||
											issue.issue == "Type mismatch" ? (
												<AlertTriangle className="w-4 h-4 text-yellow-500" />
											) : (
												<XCircle className="w-4 h-4 text-[#db2020]" />
											)}

											{/* Issue.field */}
											<div className="text-[#5280ff] font-mono">
												{issue.field}
											</div>

											{/* Issue meassage */}
											<div className="bg-[#7c7676] p-[6px] ml-2 text-[10px] font-bold rounded-lg">
												{issue.issue.toLowerCase()}
											</div>
										</div>

										{/* display message based on the issue */}
										<div> {getDisplayMessage(issue)} </div>
									</div>
								</div>
							))}
						</div>
					</>
				)}

				{!issues.length && !error && (
					<div className="flex flex-col justify-center items-center h-full">
						<p className="text-center"> No analysis yet </p>
						<p className="text-center"> Enter JSON and click Analyze </p>
					</div>
				)}
			</div>
		</>
	);
}

export default AnalysisPanel;
