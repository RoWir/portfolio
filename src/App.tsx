import './App.css'
import Terminal from './components/terminal/Terminal'
import { CommandPrefixProvider } from './components/terminal/TerminalContext'

function App() {

  return (
    <>
      <h1>TERMINAL</h1>
      <CommandPrefixProvider>
        <Terminal />
      </CommandPrefixProvider>
    </>
  )
}

export default App
