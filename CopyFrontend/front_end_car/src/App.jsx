import Start from './components/Start'
import Login from './components/Login'
import SignUp from './components/SignUp'
import HUD from './components/HUD'
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
function App() {

  return (
    <>
    
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route 
        path="/hud" 
        element={
          <PrivateRoute>
            <HUD />
          </PrivateRoute>
        } 
      />
    </Routes>
    
    

    </>
  )
}

export default App