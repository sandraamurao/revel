import { useApiState } from "../store/useStore";
import ReactMarkdown from "react-markdown";

function AIExplanationPanel() {
	const aiExplanation = useApiState((state) => state.aiExplanation);

	return (
		<div className="border border-[#474747] bg-[#0b426d]/15 rounded-[27px] p-6 mb-5 ">
			<div> AI Explanation </div>
			<div>
				<ReactMarkdown>{aiExplanation}</ReactMarkdown>
			</div>
		</div>
	);
}

export default AIExplanationPanel;
