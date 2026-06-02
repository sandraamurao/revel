import { useState } from "react";
import { useApiState } from "../store/useStore";
import { ChevronDown, ChevronUp, Settings } from "lucide-react";
import { buildDataRows } from "../utils/buildDataRows";
import { flattenObject } from "../utils/flattenObject";
import { DiffCell } from "./DiffCell";

const safeFlatten = (json: string) => {
  try { return flattenObject(JSON.parse(json)) }
  catch { return {} }
}

function DiffViewer() {
	const [isOpen, setIsOpen] = useState(true);

	const analyzedRequest = useApiState((state) => state.analyzedRequest);
	const analyzedResponse = useApiState((state) => state.analyzedResponse);
	
	const flatRequest = safeFlatten(analyzedRequest)
	const flatResponse = safeFlatten(analyzedResponse)

	const truth = useApiState((state) => state.sourceOfTruth);
	const issues = useApiState((state) => state.issues);

	const rows = buildDataRows(issues, flatRequest, flatResponse, truth);
	const numMismatches = rows.filter(r => r.status.includes("mismatch")).length
	const numMissing = rows.filter(r => r.status.includes("missing")).length
	const numMatches = rows.filter(r => r.status === "match").length

	// prevents rendering and JSON.parse crash before user clicks Analyze:
	if (!issues.length) return null;

	return (
		<div className="text-sm">
			<div className="flex flex-col sm:flex-row justify-between gap-3 pr-7 pl-7 pt-3 pb-3 outline outline-[#474747] rounded-t-2xl font-mono bg-[#1a1f31]">
				<div className="flex flex-row gap-4 justify-center items-center">
					<span className="text-[#928b8b]"><Settings className="w-4 h-4"  /></span>
					<span className="text-[13px] ">diff</span>
					<span className="text-[13px] bg-[#c27209]/20 pr-3 pl-3 rounded-2xl border border-[#e0710a]">
						{numMismatches} <span className="hidden md:inline"> mismatches</span>
					</span>
					<span className="text-[13px]  bg-[#eb0c0c]/30 pr-3 pl-3 rounded-2xl border border-[#c93232]">
						{numMissing} <span className="hidden md:inline">missing</span>
					</span>
					<span className="text-[13px]  bg-[#11b126]/20 pr-3 pl-3 rounded-2xl border border-[#11b126]">
						{numMatches} <span className="hidden md:inline">matches</span>
					</span>
				</div>

				<button onClick={() => setIsOpen(!isOpen)} className="flex justify-center border border-[#857e7e]/50 p-1.25 rounded-lg hover:bg-[#857e7e]/50">
					
					{isOpen ? (
						<ChevronDown className="w-4 h-4" />
					) : (
						<ChevronUp className="w-4 h-4" />
					)}
				</button>
			</div>
			<div
				className={`grid grid-cols-2 outline outline-[#474747] ${!isOpen ? "rounded-b-2xl" : ""} font-mono bg-[#121622]`}
			>
				<div className="p-2 border-r-[0.5px] border-r-[#474747] text-[14px]">
					
					🔴 REQUEST
				</div>
				<div className="p-2 text-[14px]"> 🟢 RESPONSE </div>
			</div>

			{isOpen && (
				<div>
					{rows.map((row, i) => (
						<div key={i} className="grid grid-cols-2 font-mono">
							<DiffCell lineNumber={i + 1} fieldKey={row.requestKey} value={row.requestValue} status={row.status} side="request" truth={truth} />
							<DiffCell lineNumber={i + 1} fieldKey={row.responseKey} value={row.responseValue} status={row.status} side="response" truth={truth} />
						</div>
						))}
				</div>
			)}
		</div>
	);
}

export default DiffViewer;
