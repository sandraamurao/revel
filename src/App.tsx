import "./App.css";
import NavBar from "./components/NavBar";
import JsonInput from "./components/JsonInput";
import AnalysisPanel from "./components/AnalysisPanel";
import { useApiState } from "./store/useStore";
import AIExplanationPanel from "./components/AIExplanationPanel";

function App() {
	const issues = useApiState((state) => state.issues);
	const aiExplanation = useApiState((state) => state.aiExplanation);

	return (
		<>
			<NavBar></NavBar>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 m-8">
				<div className="h-full">
					<JsonInput />
				</div>
				<div className="h-full">
					<AnalysisPanel />
				</div>
				{issues && aiExplanation && (
					<div className="xl:col-span-2 w-full">
						<AIExplanationPanel></AIExplanationPanel>
					</div>
				)}
			</div>
		</>
	);
}

export default App;
