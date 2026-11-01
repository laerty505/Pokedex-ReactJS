import { useState } from 'react'
import Header from './components/Header'


function App() {
  const [search, setSearch] = useState("")



  
  

  return (
    <div className='min-h-screen bg-slate-900'>
      <Header search={search} onSearchChange={setSearch}/>

    </div>
  )
} 

export default App
