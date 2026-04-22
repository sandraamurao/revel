import './App.css'
import NavBar from './components/NavBar'
import JsonInput from './components/JsonInput'
import AnalysisPanel from './components/AnalysisPanel'

function App() {

  return (
    <>
      <NavBar></NavBar>

      <div className="grid md:grid-cols-2 gap-8 m-8"> 
        <JsonInput></JsonInput>
        <AnalysisPanel></AnalysisPanel>
      </div>
      
    </>
  )
}

export default App