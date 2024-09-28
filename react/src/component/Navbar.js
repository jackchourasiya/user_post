import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link,useNavigate  } from 'react-router-dom';
import '../App.css';

function Navigation({renderHomePage}) {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Post</Navbar.Brand>
          <Nav className="me-auto">
            <Link className="nav-link" to="/">Home</Link>

            {!token ? (
              <>
                <Link to="/Login" className="nav-link">Login</Link>
              </>
            ) : (
              <>
                <Link to="/Newpost" className="nav-link">NewPost</Link>
                <Link to="#" className="nav-link" onClick={handleLogout}>Logout</Link>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );

  function handleLogout() {
    localStorage.removeItem('token'); 
    setToken(null);
    navigate('/Login');
    renderHomePage()
  }
}

export default Navigation;
