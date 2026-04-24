import { useApiState } from "../store/useStore";

function AnalysisPanel() {
	const issues = useApiState((state) => state.issues);
	const error = useApiState((state) => state.error);

	return (
		<>
		<div className="border border-[#474747] bg-[#0b426d]/15 rounded-[27px] p-6 mb-5 "> 
			<h1> Analysis </h1>

			{error != "" && <div> {error} </div>}

			<div> Issues </div>
			<div>
				{issues.map((issue, index) => (
					<div key={index}>
						<p> {issue.field} </p>
						<p> {issue.issue} </p>
						<p> Expected: {issue.expected} → Actual: {issue.actual} </p>{" "}
					</div>
				))}
			</div>
		</div>
			
		</>
	);
}

export default AnalysisPanel;
