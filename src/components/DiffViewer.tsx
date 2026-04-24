import ReactDiffViewer from 'react-diff-viewer-continued'
import { useApiState } from '../store/useStore'

function DiffViewer() {
  const requestJson = useApiState((state) => state.requestJson);
  const responseJson = useApiState((state) => state.responseJson);

  return (
    <ReactDiffViewer
      oldValue={requestJson}
      newValue={responseJson}
      splitView={true}
      leftTitle="Request"
      rightTitle="Response"
    />
  )
}

export default DiffViewer