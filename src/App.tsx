import './App.css'
import Terminal from './components/terminal/Terminal'
import { FileSystemProvider } from './components/terminal/FileSystemContext'

function App() {

  return (
    <>
      <h1>TERMINAL</h1>
      <FileSystemProvider>
        <Terminal />
      </FileSystemProvider>
    </>
  )
}

export default App
