import { useApiState } from "../store/useStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Info, Sparkles } from "lucide-react";

function AIExplanationPanel() {
	const aiExplanation = useApiState((state) => state.aiExplanation);

	return (
		<div className="border border-[#474747] bg-[#0b426d]/15 rounded-[27px] p-6 mb-5 ">
			<div className="flex flex-row items-center gap-3 font-bold mb-4 text-xl"> <Info className="w-5 h-5 text-blue-400" /> AI Explanation </div>
			<div>
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					components={{
						p: ({ children }) => (
							<p className="text-[#d1d1d1] text-sm leading-relaxed mb-3">
								{children}
							</p>
						),
						ul: ({ children }) => (
							<ul className="mt-2 space-y-1">{children}</ul>
						),
						li: ({ children }) => (
							<li className="flex flex-row items-start gap-3 text-sm text-[#d1d1d1]">
								<span className="text-blue-400">•</span>
								<span>{children}</span>
							</li>
						),
						strong: ({ children }) => (
							<strong className="text-white font-semibold">{children}</strong>
						),
						h3: ({ children }) => (
							<h3 className="text-white font-semibold mt-4 mb-2 flex flex-row items-center gap-3"><Sparkles className="w-5 h-5 text-[#ffee00]" />{children}</h3>
						),
					}}
				>
					{aiExplanation}
				</ReactMarkdown>
			</div>
		</div>
	);
}

export default AIExplanationPanel;
