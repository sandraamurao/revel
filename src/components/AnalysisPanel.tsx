import { useApiState } from "../store/useStore";

function AnalysisPanel() {
	const issues = useApiState((state) => state.issues);
	const error = useApiState((state) => state.error);
	const sourceOfTruth = useApiState((state) => state.sourceOfTruth);

	const issueConfig = {
		"Naming mismatch": { icon: "⚠️", color: "yellow" },
		"Missing field": { icon: "❌", color: "#a71010" },
		"Type mismatch": { icon: "⚠️", color: "orange" },
	};

	console.log("issues ", issues);
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
									{issue.issue === "Naming mismatch" && (
										<>
											{" "}
											<div
												className={`flex flex-col border rounded-lg p-3 bg-[#1a1f31]`}
												style={{
													borderColor: issueConfig["Naming mismatch"].color,
												}}
											>
												<div className="flex flex-row  items-center gap-3 ">
													<div> {issueConfig["Naming mismatch"].icon} </div>
													<div className="text-[#5280ff] font-mono"> {issue.field} </div>
													<div className="bg-[#7c7676] p-[6px] text-[10px] font-bold rounded-lg">
														{" "}
														{issue.issue.toLowerCase()}{" "}
													</div>
												</div>
												<div>
													{sourceOfTruth} expects {issue.expected}, but
													{sourceOfTruth === "Response" && <> request </>}
													{sourceOfTruth === "Request" && <> response </>} uses {issue.actual}
												</div>
											</div>
										</>
									)}
									{issue.issue === "Missing field" && (
										<>
											<div
												className={`flex flex-col gap-2 border rounded-lg p-2 bg-[#1a1f31]`}
												style={{
													borderColor: issueConfig["Missing field"].color,
												}}
											>
												<div className="flex flex-row  items-center gap-3">
													<div> {issueConfig["Missing field"].icon} </div>
													<div className="text-[#5280ff] font-mono"> {issue.field} </div>
													<div className="bg-[#7c7676] p-[6px] text-[10px] font-bold rounded-lg">
														{issue.issue.toLowerCase()}
													</div>
												</div>

												<div>
													Field exists in {sourceOfTruth.toLowerCase()} but missing in
													{sourceOfTruth === "Response" && <> request </>}
													{sourceOfTruth === "Request" && <> response </>}
												</div>
											</div>
										</>
									)}
									{issue.issue === "Type mismatch" && (
										<div
											className={`flex flex-col gap-2 border rounded-lg p-2 bg-[#1a1f31]`}
											style={{
												borderColor: issueConfig["Type mismatch"].color,
											}}
										>
											<div className="flex flex-row items-center gap-3">
												<div> {issueConfig["Type mismatch"].icon} </div>
												<div className="text-[#5280ff] font-mono"> {issue.field} </div>
												<div className="bg-[#7c7676] p-[6px] text-[10px] font-bold rounded-lg">
													{issue.issue.toLowerCase()}
												</div>
											</div>
											<div>
												Expected {issue.expected.toLowerCase()}, received{" "}
												{issue.actual.toLowerCase()} in
												{sourceOfTruth === "Response" && <> request </>}
												{sourceOfTruth === "Request" && <> response </>}
											</div>
										</div>
									)}
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
