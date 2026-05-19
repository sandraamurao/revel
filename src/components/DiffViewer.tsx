import { useState } from "react";
import { useApiState } from "../store/useStore";
import { ChevronDown, ChevronUp } from "lucide-react";
import { flattenObject } from "../utils/flattenObject";

interface DataMapRow {
	requestKey: string | null;
	responseKey: string | null;
	requestValue: unknown;
	responseValue: unknown;
	status:
		| "match"
		| "type-mismatch"
		| "naming-mismatch"
		| "missing-request"
		| "missing-response"
		| "missing"
		| "extra";
}

function DiffViewer() {
	const [isOpen, setIsOpen] = useState(true);

	const requestJson = useApiState((state) => state.requestJson);
	const responseJson = useApiState((state) => state.responseJson);
	const request = JSON.parse(requestJson);
	const response = JSON.parse(responseJson);
	const statuses = getStatus(request, response);
	const issues = useApiState((state) => state.issues);
	const truth = useApiState((state) => state.sourceOfTruth);
	const flatRequest = flattenObject(JSON.parse(requestJson));
	const flatResponse = flattenObject(JSON.parse(responseJson));

	// prevents rendering and JSON.parse crash before user clicks Analyze:
	if (!issues.length) return null;

	const isReqTruth = truth === "Request";

	const getReqKey = (expected: string, actual: string) =>
		isReqTruth ? expected : actual;
	const getResKey = (expected: string, actual: string) =>
		isReqTruth ? actual : expected;

	const issueActuals = issues.map(i => i.actual)
	const allKeys = [...new Set([
	...Object.keys(isReqTruth ? flatRequest : flatResponse),
	...Object.keys(isReqTruth ? flatResponse : flatRequest)
	])].filter(key => !issueActuals.includes(key))

	// Map rows for each property line of request and response
	const rows: DataMapRow[] = allKeys.map((key) => {
		const issue = issues.find((i) => i.field === key);
		const inTruth = key in (isReqTruth ? flatRequest : flatResponse)

		// if key is not in source of truth, it's an "extra key"
		if (!inTruth) return {
			requestKey: isReqTruth ? null : key,
			responseKey: isReqTruth ? key : null,
			requestValue: isReqTruth ? null : flatRequest[key],
			responseValue: isReqTruth ? flatResponse[key] : null,
			status: "extra" as DataMapRow["status"]
		}

		if (!issue || issue.issue === "Type mismatch")
			return {
				requestKey: key,
				responseKey: key,
				requestValue: flatRequest[key],
				responseValue: flatResponse[key],
				status: !issue ? "match" : "type-mismatch",
			};

		if (issue.issue === "Naming mismatch")
			return {
				requestKey: getReqKey(issue.expected, issue.actual),
				responseKey: getResKey(issue.expected, issue.actual),
				requestValue: flatRequest[getReqKey(issue.expected, issue.actual)],
				responseValue: flatResponse[getResKey(issue.expected, issue.actual)],
				status: "naming-mismatch",
			};

		if (issue.issue === "Missing field")
			return {
				requestKey: isReqTruth ? key : null,
				responseKey: isReqTruth ? null : key,
				requestValue: isReqTruth ? flatRequest[key] : null,
				responseValue: isReqTruth ? null : flatResponse[key],
				status: isReqTruth ? "missing-response" : "missing-request",
			};

		
	});

	function getStatus(
		request: Record<string, unknown>,
		response: Record<string, unknown>,
	) {
		const allKeys = [
			...new Set([...Object.keys(request), ...Object.keys(response)]),
		];

		return allKeys.map((k) => {
			const reqVal = request[k];
			const resVal = response[k];
			const inRequest = k in request;
			const inResponse = k in response;

			let status: string;

			if (!inResponse) status = "missing-response";
			else if (!inRequest) status = "missing-request";
			else if (JSON.stringify(reqVal) !== JSON.stringify(resVal))
				status = "mismatch";
			else status = "match";

			return { key: k, status };
		});
	}

	function setRowColor(status: string) {
		if (status === "match" || status === "extra") return "bg-[#379737]/40";

		if (
			status === "missing-response" ||
			status === "missing-request" ||
			status === "naming-mismatch" ||
			status === "type-mismatch"
		)
			return "bg-[#9b2b2b]/50";
	}

	return (
		<div>
			<div className="flex flex-row justify-between gap-3 pr-7 pl-7 pt-3 pb-3 border rounded-t-2xl font-mono bg-[#1a1f31]">
				<div className="flex flex-row gap-4 justify-center items-center">
					<span className="text-[13px] ">diff</span>
					<span className="text-[13px] bg-[#c27209]/20 pr-3 pl-3 rounded-2xl border border-[#e0710a]">
						{statuses.filter((r) => r.status === "mismatch").length} mismatches
					</span>
					<span className="text-[13px]  bg-[#eb0c0c]/30 pr-3 pl-3 rounded-2xl border border-[#c93232]">
						{statuses.filter((r) => r.status.includes("missing")).length}{" "}
						missing
					</span>
					<span className="text-[13px]  bg-[#11b126]/20 pr-3 pl-3 rounded-2xl border border-[#11b126]">
						{statuses.filter((r) => r.status === "match").length} matches
					</span>
				</div>

				<button onClick={() => setIsOpen(!isOpen)}>
					{" "}
					{isOpen ? (
						<ChevronDown className="w-4 h-4" />
					) : (
						<ChevronUp className="w-4 h-4" />
					)}{" "}
				</button>
			</div>
			<div
				className={`grid grid-cols-2 border ${!isOpen ? "rounded-b-2xl" : ""} font-mono  bg-[#121622]`}
			>
				<div className="p-2 border-r text-[14px]"> 🔴 REQUEST </div>
				<div className="p-2 text-[14px]"> 🟢 RESPONSE </div>
			</div>

			{isOpen && (
				<div>
					{rows.map((row, i) => (
						<div key={i} className="grid grid-cols-2 font-mono ">
							<div className={`border ${setRowColor(row.status)} p-2 flex flex-row`}>
								<div className="text-[#746f6f]">
									{i + 1}
									{"\u00A0"}
									{"\u00A0"}
								</div>
								<div>
									{row.requestKey && (
										<>
											<span
												className={`${row.status === "naming-mismatch" ? "underline decoration-[#db1111] decoration-2 underline-offset-4" : ""}`}
											>
												{row.requestKey}
											</span>
											:{" "}
											<span
												className={`${row.status === "type-mismatch" ? "underline decoration-[#db1111] decoration-2 underline-offset-4" : ""}`}
											>
												{JSON.stringify(row.requestValue)}
											</span>
											
										</>
									)}
								</div>
								<div>
									{row.status === "missing-request" && (
										<div className="flex flex-row gap-2 ">
											<div className="border border-dashed border-[#c51616] rounded-md w-50"></div>{" "}
											<span className="">missing</span>{" "}
										</div>
									)}	
								</div>
							</div>
							<div className={`border ${setRowColor(row.status)} p-2 flex flex-row`}>
								<div className="text-[#746f6f]">
									{i + 1}
									{"\u00A0"}
									{"\u00A0"}
								</div>
								<div>
									{row.responseKey && (
										<>
											<span
												className={`${row.status === "naming-mismatch" ? "underline decoration-[#db1111] decoration-2 underline-offset-4" : ""}`}
											>
												{row.responseKey}
											</span>
											:{" "}
											<span
												className={`${row.status === "type-mismatch" ? "underline decoration-[#db1111] decoration-2 underline-offset-4" : ""}`}
											>
												{JSON.stringify(row.responseValue)}
											</span>
										</>
									)}
								</div>
								<div>
									{row.status === "missing-response" && (
										<div className="flex flex-row gap-2">
											<div className="border border-dashed border-[#c51616] rounded-md w-50 "></div>
											<span className="mr-3">missing</span>{" "}
										</div>
									)}
								</div>
								
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default DiffViewer;
