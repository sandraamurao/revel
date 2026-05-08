import { useState } from "react";
import { useApiState } from "../store/useStore";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MergeView } from "@codemirror/merge";
import { EditorState } from "@codemirror/state";
import { useEffect, useRef } from "react";

function DiffViewer() {
	const [isOpen, setIsOpen] = useState(true);

	const requestJson = useApiState((state) => state.requestJson);
	const responseJson = useApiState((state) => state.responseJson);
	const request = JSON.parse(requestJson);
	const response = JSON.parse(responseJson);
	const statuses = getStatus(request, response);
	const issues = useApiState((state) => state.issues);

	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!ref.current || !issues.length) return;

		ref.current.innerHTML = "";

		new MergeView({
			a: {
				doc: requestJson,
				extensions: [EditorState.readOnly.of(true)],
			},
			b: {
				doc: responseJson,
				extensions: [EditorState.readOnly.of(true)],
			},
			parent: ref.current,
		});
	}, [requestJson, responseJson, issues]);

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

			<div
				ref={ref}
				className={`w-full ${isOpen ? "block" : "hidden"} border bg-[#1a1a24]`}
			/>
		</div>
	);
}

export default DiffViewer;
