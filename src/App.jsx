import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from './Home'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='background'>
      <Home/>
    </div>
  )
}

export default App
