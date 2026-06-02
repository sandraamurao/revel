import { useApiState } from "../store/useStore";
import { AlertTriangle, XCircle, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import type { Issue } from "../utils/compareJson";
import DiffViewer from "./DiffViewer";
import { buildDataRows } from "../utils/buildDataRows";
import { flattenObject } from "../utils/flattenObject";

const COLOR_CODES = {
	"Naming mismatch": "border-[#ffee00]",
	"Missing field": "border-[#aa1e1e]",
	"Type mismatch": "border-[#ff9100]",
};

const safeFlatten = (json: string) => {
  try { return flattenObject(JSON.parse(json)) } 
  catch { return {} }
}

function getDisplayMessage(issue: Issue, sourceOfTruth: string) {
	if (issue.issue === "Naming mismatch")
		return `${sourceOfTruth} expects ${issue.expected}, but ${sourceOfTruth === "Response" ? "request" : "response"} uses ${issue.actual}`;
	if (issue.issue === "Missing field")
		return `Field exists in ${sourceOfTruth.toLowerCase()} but missing in ${sourceOfTruth === "Response" ? "request" : "response"}`;
	if (issue.issue === "Type mismatch")
		return `Expected ${issue.expected.toLowerCase()}, received ${issue.actual.toLowerCase()} in ${sourceOfTruth === "Response" ? "request" : "response"}`;
}

const getRowStatus = (status: string) => {
	if (status.includes("missing")) {
		return "missing";
	}
	if (status.includes("mismatch")) {
		return "mismatch";
	}
};

const getMappingBgColor = (status: string) => {
	if (status.includes("missing")) {
		return "bg-[#800000]/20";
	}
	if (status.includes("mismatch")) {
		return "bg-[#dd7703]/10";
	}
	if (status.includes("match")) {
		return "bg-[#3cff00]/10";
	}
};

const getMappingBorderColor = (status: string) => {
	if (status.includes("missing")) {
		return "border-[#bb0000]";
	}
	if (status.includes("mismatch")) {
		return "border-[#fc8600fb]";
	}
	if (status.includes("match")) {
		return "border-[#0ca821]";
	}
};

function AnalysisPanel() {
	const issues = useApiState((state) => state.issues);
	const error = useApiState((state) => state.error);
	const sourceOfTruth = useApiState((state) => state.sourceOfTruth);
	const isLoading = useApiState((state) => state.isLoading)

	const analyzedRequest = useApiState((state) => state.analyzedRequest);
	const analyzedResponse = useApiState((state) => state.analyzedResponse);
	const flatRequest = safeFlatten(analyzedRequest);
	const flatResponse = safeFlatten(analyzedResponse);

	const rows = buildDataRows(issues, flatRequest, flatResponse, sourceOfTruth);

	return (
		<div className="border border-[#474747] bg-[#0b426d]/15 rounded-[27px] p-6 mb-5 h-full">
			{/* Show loading message */}
			{isLoading && (
				<div className="flex flex-row items-center gap-3">
					<Loader2 className="w-8 h-8 animate-spin text-[#4d379c]" />
					<p className="text-gray-400">Analyzing...</p>
				</div>
			)}

			{!issues.length && !error && !isLoading && (
				<div className="flex flex-col justify-center items-center h-full">
					<AlertTriangle className="w-8 h-8 text-yellow-500" />
					<p className="text-center"> No analysis yet </p>
					<p className="text-center"> Enter API JSON and click Analyze </p>
				</div>
			)}

			{!issues.length && error && (
					<div className="flex flex-col justify-center items-center h-full">
							<XCircle className="w-8 h-8 text-[#db2020] mb-2" /> 
							<p className="font-bold">Invalid JSON!</p>
						<p className="mt-2"> Please double check your inputs!</p>
					</div>
				) 
			}

			{issues.length > 0 && !isLoading && (
				<>
					<h1 className="font-bold text-xl"> Analysis </h1>

					{/* DETECTED ISSUES */}
					<h3 className="mt-6 mb-4 flex flex-row items-center gap-2 font-bold">
						<AlertTriangle className="w-4 h-4 text-yellow-500" />
						Detected Issues
					</h3>
					<div>
						{issues.map((issue, index) => (
							<div key={index} className="mb-3">
								<div
									className={`flex flex-col border ${COLOR_CODES[issue.issue as keyof typeof COLOR_CODES]} rounded-lg p-3 bg-[#1a1f31]`}
								>
									<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
										<div className="flex flex-row items-center gap-4">
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
										</div>
										

										{/* Issue type */}
										<div className="bg-[#47536d]/40 pt-1.5 pb-1.5 pr-2.5 pl-2.5 text-[13px] text-[#96a4c2] rounded-lg">
											{issue.issue.toLowerCase()}
										</div>
									</div>

									{/* display message based on the issue */}
									<div className="pt-2"> {getDisplayMessage(issue, sourceOfTruth)} </div>
								</div>
							</div>
						))}
					</div>

					{/* JSON DIFF */}
					<h3 className="mt-7 mb-4 flex flex-row items-center gap-2 font-bold">
						<CheckCircle className="w-4 h-4 text-green-500" />
						JSON Diff
					</h3>

					<DiffViewer></DiffViewer>

					{/* Data Mapping */}
					<div className="mb-4 mt-7">
						<h3 className="font-bold flex flex-row items-center gap-2">
							<ArrowRight
								className="w-4 h-4 text-[#c70fd8]"
								strokeWidth={3}
							/>
							Data Mapping
						</h3>
					</div>

					{rows
						.filter((r) => r.status !== "extra")
						.map((key, i) => (
							<div
								key={i}
								className={`text-sm border rounded-xl mb-3 font-mono p-3 flex flex-row justify-between items-center ${getMappingBgColor(key.status)} ${getMappingBorderColor(key.status)}`}
							>
								<div>
									<span className="text-[#3d71ff]">
										{key.requestKey ?? "?"}
									</span>
									<span
										className={`${key.status.includes("mismatch") || key.status.includes("missing") ? "text-[#e00202]" : "text-[#3cff00]"}`}
									>
									&nbsp; → &nbsp;
									</span>
									<span className="text-[#e002e0]">
										{key.responseKey ?? "?"}
									</span>
								</div>
								<div
									className={`text-sm font-bold ${key.status.includes("mismatch") && "text-[#ff9129]"} ${key.status.includes("missing") && "text-[#f75050]"}`}
								>
									{getRowStatus(key.status)}
								</div>
							</div>
						))}
				</>
			)}
		</div>
	);
}

export default AnalysisPanel;
