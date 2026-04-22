import "./App.css";
import NavBar from "./components/NavBar";
import JsonInput from "./components/JsonInput";
import AnalysisPanel from "./components/AnalysisPanel";
import { useApiState } from "./store/useStore";
import AIExplanationPanel from "./components/AIExplanationPanel";

function App() {
	const issues = useApiState((state) => state.issues);

	return (
		<>
			<NavBar></NavBar>

			<div className="grid md:grid-cols-2 gap-8 m-8">
				<JsonInput></JsonInput>
				<AnalysisPanel></AnalysisPanel>
				{issues && (
					<div>
						<AIExplanationPanel></AIExplanationPanel>
					</div>
				)}
			</div>
		</>
	);
}

export default App;
