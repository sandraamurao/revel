import { useApiState } from "../store/useStore"
import ReactMarkdown from 'react-markdown'

function AIExplanationPanel() {
    const aiExplanation = useApiState((state) => state.aiExplanation);

    return (
        <div>
            <div> AI Explanation </div>
            <div> 
                {aiExplanation && 
                    <ReactMarkdown>{aiExplanation}</ReactMarkdown>
                }
            </div>
        </div>
    )
}

export default AIExplanationPanel