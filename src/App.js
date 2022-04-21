import React from 'react';
import { 
 BrowserRouter as Router,
 Route, 
 Routes,
} from 'react-router-dom';

//components
import Navbar from './Components/Navbar.jsx';
import Footer from './Components/Footer.jsx';
import Header from './Components/Header.jsx';
import './App.css';
import './Form.css'

//screens
import Home from './Screens/Home';
import Profile from './Screens/Profile';
import Login from './Screens/Login';
import Register from './Screens/Register';








function App() {
  
    return (
<div className="App">
      <Router>
        <Header/>
  
          <main className="main">
            <div className="content">
                <Routes>
                  <Route exact path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />


                </Routes>
            </div>
          </main>  
    
      <Footer />
      </Router>
</div>
    
    );
  }
  
  export default App;
  