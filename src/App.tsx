import { useState } from "react"
import Editor from "./components/editor"

function App() {

  const update = (val: string) => {
    console.log(val)
  }

  const [vim, setVim] = useState(false);

  return (
    <>
      <main className="flex flex-col justify-center items-center h-screen">
        <header className="m-4 bg-primary px-6">
          <h1 className="text-4xl text-base font-semibold">CODLE</h1>
        </header>
        <div className="w-1/2 h-96 rounded-2xl overflow-hidden border border-secondary p-8 shadow-xl">
          <Editor
            onChange={update}
            vim={vim}
          />
        </div>
        <div className="flex items-center justify-center gap-8 mt-4 w-1/2">
          <button className="bg-accent text-base px-4 py-2 rounded-md cursor-pointer font-semibold text-xl hover:brightness-80"><i className="bi bi-play-fill"></i>Run</button>

          <div className="flex items-center gap-2">
            <i className="devicon-vim-plain text-4xl text-accent"></i>
            <input type="checkbox" name="vim" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" checked={vim} onChange={() => setVim(!vim)} />
          </div>
        </div>
      </main>
    </>
  )
}

export default App
