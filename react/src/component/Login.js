import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Navigation from './Navbar';

function Login() {
  const navigate                = useNavigate(); 
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState('');
  const [errors, setErrors]     = useState([]);
  const apiurl = process.env.REACT_APP_API_URL;


  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        `${apiurl}/login`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.userinfo.email);
      setErrors([]);
      setMessage(response.data.msg);
      setTimeout(() => {
        navigate('/');        
      }, 2000); 

    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setMessage(error.response.data.msg || 'Invalid credentials');
          setErrors([{ msg: error.response.data.msg || 'Invalid credentials' }]);
        } else {
          setMessage('An unexpected error occurred');
          setErrors([{ msg: 'An unexpected error occurred' }]);
        }
      } else {
        setMessage('Network error, please try again later');
        setErrors([{ msg: 'Network error, please try again later' }]);
      }
    }
  };

  return (
    <>
      <Navigation/>
      <div style={{ marginRight: '35%', marginLeft: '35%',marginTop: '10%' }}>
          <h1>Login</h1>
          <Form >
              <Form.Group className="mb-3" controlId="formBasicusername">
                  <Form.Control type="text"  placeholder="Username" onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Control type="text" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
              </Form.Group>
              <Button variant="primary" onClick={handleLogin}>
                Login
              </Button>
              <p>For signup, click <Link to="/signup">here</Link>.</p>
          </Form>

          {errors && errors.length > 0 && (
          <div>
            {/* <ul> */}
              {errors.map((error, index) => (
                <li key={index}>{error.msg}</li>
              ))}
            {/* </ul> */}
          </div>
        )} 

        {/* Display message if no errors */}
        {message && errors.length === 0 && (
          <Alert key="primary" variant="primary">
            {message}
          </Alert>
        )}         
      </div>
    </>
  );
}

export default Login;
