import logo from './logo.svg';
import './App.css';
import Homepage from './component/Homepage';
import Navigation from './component/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './component/Signup';
import Login from './component/Login';
import Newpost from './component/Newpost';
import ProtectedRoute from './component/ProtectedRoute';

function App() {
  return (

    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={ <Homepage />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Newpost" element={<ProtectedRoute><Newpost /></ProtectedRoute>} />
        </Routes>
    </Router>
    </div>  
  );
}

export default App;
