import { useApiState } from "../store/useStore"
import ReactMarkdown from 'react-markdown'

function AIExplanationPanel() {
    const aiExplanation = useApiState((state) => state.aiExplanation);

    return (
        <div>
            {
                aiExplanation && <div>
                    <div> AI Explanation </div>
                    <div>
                        <ReactMarkdown>{aiExplanation}</ReactMarkdown>
                    </div>
                </div> 
            }
            
        </div>
    )
}

export default AIExplanationPanel