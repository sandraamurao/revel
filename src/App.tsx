import './App.css'
import NavBar from './components/NavBar'
import JsonInput from './components/JsonInput'

function App() {

  return (
    <>
      <NavBar></NavBar>

      <div className="grid md:grid-cols-2 gap-[2rem] m-8"> 
        <JsonInput></JsonInput>
        <div> Analysis </div>
      </div>
      
    </>
  )
}

export default App