import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navsection from './Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Navigation from './Navbar';

function Newpost() {
  const navigate              = useNavigate();
  const [title, setTitle]     = useState('');
  const [image, setImage]     = useState(null); // Store image file
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors]   = useState([]);
  const apiurl                = process.env.REACT_APP_API_URL;
  const handleblog = async (e) => {
    e.preventDefault();
    const tokens = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('email', email); 
    formData.append('image', image); 

    console.log('formdata-',formData)

    if(!title || !content || !image){
        setErrors([{msg:'All feilds are required'}]);
        return false;
    }

    try {
      const response = await axios.post(`${apiurl}/createpost`, formData, {
        headers: {
          'Authorization': `Bearer ${tokens}`,
          'Content-Type': 'multipart/form-data', 
        },
      });
      console.log('response-',response)
      setErrors([]);
      setMessage(response.data.msg);
      navigate('/');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setMessage(error.response.data.msg);
          setErrors([{ msg: error.response.data.msg }]);
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
      <div style={{ marginRight: '32%', marginLeft: '30%', marginTop: '10%' }}>
        <h1>Create Post...</h1>
        <Form>
          <Form.Group className="mb-3" controlId="formBasictitle">
            <Form.Control
              type="text"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicimage">
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicblog">
            <Form.Control
              type="text"
              placeholder="Content"
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" onClick={handleblog}>
            Create
          </Button>
        </Form>

        {/* Display Errors */}
        {errors && errors.length > 0 && (
          <div>
              {errors.map((error, index) => (
                <li key={index}>{error.msg}</li>
              ))}
          </div>
        )}

        {/* Display success message */}
        {message && errors.length === 0 && (
          <Alert key="primary" variant="primary">
            {message}
          </Alert>
        )}
      </div>
    </>
  );
}

export default Newpost;
