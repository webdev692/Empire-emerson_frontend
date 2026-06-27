import './App.css'
import Navbar from './Components/Umbrella/Navbar'
import HomePage from './Components/MainRender/EmpireLanding'
import Footer from './Components/Umbrella/Footer'

function App() {
  return (
    <div className="min-h-screen bg-[#050c1d] text-white">
      <Navbar />
      <HomePage />
      <Footer />
    </div>
  )
}

export default App
