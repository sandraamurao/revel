interface DiffCellProps {
  lineNumber: number
  fieldKey: string | null
  value: unknown
  status: string
  side: "request" | "response"
  truth: string
}

function setCellStyle(status: string) {
	if (status === "match" || status === "extra") return "bg-[#379737]/30 border-l-[#12e42e]";

	if (status === "naming-mismatch" || status === "type-mismatch")
		return "bg-[#9b2b2b]/30 border-l-[#ce1010]";
	
	if (status.includes("missing"))
		return "border-l-[#ce1010]";
}

export function DiffCell({ lineNumber, fieldKey, value, status, side, truth }: DiffCellProps) {
  const isMissingThisSide = side === "request" 
    ? status === "missing-request"
    : status === "missing-response"

  const extraBg = side === "request" && truth === "Request" && status === "missing-response"
    ? "bg-[#9b2b2b]/30"
    : side === "response" && truth === "Response" && status === "missing-request"
    ? "bg-[#9b2b2b]/40"
    : ""

  return (
    <div className={`overflow-hidden border-l-2 border-b-[0.5px] border-b-[#474747] ${setCellStyle(status)} p-2 flex flex-row ${extraBg}`}>
      <div className="text-[#746f6f] pr-3">{lineNumber}</div>
      <div>
        {fieldKey && (
          <>
            <span className={status === "naming-mismatch" ? "underline decoration-[#db1111] decoration-2 underline-offset-4" : ""}>
              {fieldKey}
            </span>
            :&nbsp;
            <span className={status === "type-mismatch" ? "underline decoration-[#db1111] decoration-2 underline-offset-4" : ""}>
              {JSON.stringify(value)}
            </span>
          </>
        )}
      </div>
      
      {isMissingThisSide && (
        <div className="flex flex-col md:flex-row gap-2 w-full">
          <div className="border border-dashed border-[#928282] rounded-md w-full h-6 bg-[#928282]/15"></div>
          <span className="text-[#bbaeae]">missing</span>
        </div>
      )}
    </div>
  )
}