import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { AiFillLike } from 'react-icons/ai';
import { FaCommentDots } from 'react-icons/fa';
import axios from 'axios';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import Navigation from './Navbar';

function Homepage() {
    const [showPopover, setShowPopover] = useState(false);
    const [target, setTarget] = useState(null);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState('');
    const [specificComments, setSpecificComments] = useState('');
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [error, setError] = useState(null);
    const [userEmail, setUserEmail] = useState(localStorage.getItem('email'));
    const token = localStorage.getItem('token');
    const ref = useRef(null);

    const apiurl = process.env.REACT_APP_API_URL;
    // Fetch posts
    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get(`${apiurl}/posts`);
            setPosts(data.posts);
        } catch (err) {
            setError('Error fetching posts');
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // Handle like button click
    const handleLikeToggle = async (postId) => {
        try {
            const response = await fetch(`${apiurl}/posts/like/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ likedEmail: userEmail })
            });

            if (response.ok) {
                const data = await response.json();
                setPosts(data.Allpost);
            } else {
                console.error('Failed to like the post');
            }
        } catch (error) {
            console.error('Error liking the post:', error);
        }
    };

    // Handle comment submission
    const handleCommentSubmit = async () => {
        try {
            const response = await fetch(`${apiurl}/posts/comment/${selectedPostId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ comments, userEmail })
            });

            if (response.ok) {
                const data = await response.json();
                setSpecificComments(data.post.IsComments.map((comment, idx) => (
                    <p key={idx}>{comment.userEmail} : {comment.comments}</p>
                )));
                setComments(''); // Clear comment input
            } else {
                console.error('Failed to post comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    // Show comments in popover
    const showComments = (postId) => {
        const post = posts.find((p) => p._id === postId);
        if (post) {
            setSpecificComments(post.IsComments.map((comment, idx) => (
                <p key={idx}>{comment.usermail}: {comment.comments}</p>
            )));
        } else {
            setSpecificComments(<p>No comments found</p>);
        }
    };

    // Handle popover toggle
    const handlePopoverToggle = (event, postId) => {
        setSelectedPostId(postId);
        setShowPopover(!showPopover);
        setTarget(event.target);
        showComments(postId);
    };
    const [loginValue, setLoginValue] = useState(true)

    const renderHomePage = () => {
        setLoginValue(false)
    }

    return (
        <>
            <Navigation renderHomePage={renderHomePage} />
            {userEmail && <h5 style={{ marginLeft: '70%' }}>{userEmail}</h5>}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {posts.length > 0 ? posts.map((post) => (
                    <Card key={post._id} style={{ width: '18rem', margin: '20px' }}>
                        <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div
                                    style={{
                                        backgroundColor: 'red',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '1.5rem'
                                    }}>
                                    {post.title.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ marginLeft: '10px' }}>
                                    <strong>{post.title}</strong>
                                    <br />
                                    <span style={{ fontSize: '0.8rem', color: 'gray' }}>{new Date(post.postAt).toLocaleDateString() || 'Just Now'}</span>
                                </div>
                            </div>
                            <Button variant="light" size="sm">
                                <i className="bi bi-three-dots-vertical"></i>
                            </Button>
                        </Card.Header>

                        <Card.Img
                            variant="top"
                            src={`http://localhost:5000/${post.image}`}
                            alt={post.title}
                        />
                        <Card.Body>
                            <Card.Text>{post.content}</Card.Text>
                            {token && loginValue && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                    <button
                                        onClick={() => handleLikeToggle(post._id)}
                                        style={{ cursor: 'pointer', border: 'none', background: 'none' }}
                                    >
                                        {post.IsLiked.includes(userEmail) ? (
                                            <>
                                                <AiFillLike size={24} style={{ color: 'blue' }} />
                                                <span>{post.IsLiked.length}</span>
                                            </>
                                        ) : (
                                            <>
                                                <AiFillLike size={24} />
                                                <span>{post.IsLiked.length}</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={(e) => handlePopoverToggle(e, post._id)}
                                        style={{ cursor: 'pointer', border: 'none', background: 'none' }}
                                    >
                                        <FaCommentDots size={24} />
                                    </button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                )) : <p>Post is not available...</p>}
            </div>

            {showPopover && (
                <div ref={ref}>
                    <Overlay show={showPopover} target={target} placement="bottom" container={ref} containerPadding={20}>
                        <Popover id="popover-contained">
                            <Popover.Header as="h3">Comments Box</Popover.Header>
                            <Popover.Body style={{ maxHeight: '200px', minHeight: '100px', overflowY: 'auto' }}>
                                <input
                                    type="text"
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder="Add a comment"
                                />
                                <button onClick={handleCommentSubmit}>Post</button>
                                {specificComments}
                            </Popover.Body>
                        </Popover>
                    </Overlay>
                </div>
            )}
        </>
    );
}

export default Homepage;
