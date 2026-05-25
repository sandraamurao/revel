import { useState } from "react";
import { useApiState } from "../store/useStore";
import { ChevronDown, ChevronUp } from "lucide-react";
import { buildDataRows } from "../utils/buildDataRows";
import { flattenObject } from "../utils/flattenObject";

function DiffViewer() {
	const [isOpen, setIsOpen] = useState(true);

	const requestJson = useApiState((state) => state.requestJson);
	const responseJson = useApiState((state) => state.responseJson);
	const flatRequest = flattenObject(JSON.parse(requestJson));
	const flatResponse = flattenObject(JSON.parse(responseJson));

	const truth = useApiState((state) => state.sourceOfTruth);
	const statuses = getStatus(JSON.parse(requestJson), JSON.parse(responseJson));
	const issues = useApiState((state) => state.issues);

	const rows = buildDataRows(issues, flatRequest, flatResponse, truth);

	// prevents rendering and JSON.parse crash before user clicks Analyze:
	if (!issues.length) return null;

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

	function setCellStyle(status: string) {
		if (status === "match" || status === "extra") return "bg-[#379737]/30 border-l-[#12e42e]";

		if (status === "naming-mismatch" || status === "type-mismatch")
			return "bg-[#9b2b2b]/30 border-l-[#ce1010]";
		
		if (status.includes("missing"))
			return "border-l-[#ce1010]";
	}

	return (
		<div className="text-sm">
			<div className="flex flex-row justify-between gap-3 pr-7 pl-7 pt-3 pb-3 outline outline-[#474747] rounded-t-2xl font-mono bg-[#1a1f31]">
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
				className={`grid grid-cols-2 outline outline-[#474747] ${!isOpen ? "rounded-b-2xl" : ""} font-mono bg-[#121622]`}
			>
				<div className="p-2 border-r-[0.5px] border-r-[#474747] text-[14px]">
					{" "}
					🔴 REQUEST{" "}
				</div>
				<div className="p-2 text-[14px]"> 🟢 RESPONSE </div>
			</div>

			{isOpen && (
				<div>
					{rows.map((row, i) => (
						<div key={i} className={`grid grid-cols-2 font-mono`}>
							<div
								className={`border-l-[2px] border-b-[0.5px] border-b-[#474747] ${setCellStyle(row.status)} p-2 flex flex-row ${truth === "Request" && row.status === "missing-response" && "bg-[#9b2b2b]/30"}`}
							>
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
											<div className="border border-dashed border-[#928282] rounded-md w-50  bg-[#928282]/15"></div>{" "}
											<span className="text-[#bbaeae]">missing</span>{" "}
										</div>
									)}
								</div>
							</div>
							<div
								className={`border-l-[2px] border-b-[0.5px] border-b-[#474747] ${setCellStyle(row.status)} p-2 flex flex-row ${truth === "Response" && row.status === "missing-request" && "bg-[#9b2b2b]/40"}`}
							>
								<div className="text-[#746f6f]">
									{i + 1}
									{"\u00A0"}
									{"\u00A0"}
								</div>
								<div
									className={`${truth === "Request" && row.status === "missing-request" && "bg-[#d83b3b]"}`}
								>
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
											<div className="border border-dashed border-[#928282] rounded-md w-50 bg-[#928282]/15"></div>
											<span className="text-[#bbaeae]">missing</span>{" "}
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
