import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { useFormik } from 'formik';
import userValidationSchema from '../Validation/userValidationSchema';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema: userValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await axios.post(`${apiUrl}/register`, values, {
                    headers: { "Content-Type": "application/json" },
                });
                setLoading(false);
                if (response.status >= 200 && response.status < 300) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'You have signed up successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        navigate('/create-task');
                    });
                }
            } catch (error) {
                setLoading(false);
                if (error.response && error.response.status === 409) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Email already exists.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'An error occurred. Please try again later.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            }
        },
    });

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #c9d6ff, #e2e2e2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }}>
            <div style={{
                display: 'flex',
                maxWidth: '900px',
                width: '100%',
                background: '#fff',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    flex: '1',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '40px',
                    textAlign: 'center'
                }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Hello, Welcome!</h2>
                    <p style={{ marginBottom: '10px' }}>Already have an account?</p>
                    <Link to="/login" style={{
                        display: 'inline-block',
                        marginTop: '10px',
                        padding: '10px 20px',
                        border: '2px solid #fff',
                        borderRadius: '30px',
                        color: '#fff',
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}>Login here</Link>
                </div>

                <form onSubmit={formik.handleSubmit} style={{
                    flex: '1',
                    padding: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <h1 style={{
                        textAlign: 'center',
                        marginBottom: '20px',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#333'
                    }}>Sign Up</h1>

                    <div style={{ position: 'relative', marginBottom: '20px' }}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Username"
                            {...formik.getFieldProps('name')}
                            style={{
                                width: '100%',
                                padding: '12px 40px',
                                borderRadius: '30px',
                                backgroundColor: '#f0f0f0',
                                border: 'none',
                                outline: 'none'
                            }}
                        />
                        <FaUser style={{
                            position: 'absolute',
                            left: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#667eea'
                        }} />
                        {formik.touched.name && formik.errors.name && (
                            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formik.errors.name}</div>
                        )}
                    </div>

                    <div style={{ position: 'relative', marginBottom: '20px' }}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            {...formik.getFieldProps('email')}
                            style={{
                                width: '100%',
                                padding: '12px 40px',
                                borderRadius: '30px',
                                backgroundColor: '#f0f0f0',
                                border: 'none',
                                outline: 'none'
                            }}
                        />
                        <FaEnvelope style={{
                            position: 'absolute',
                            left: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#667eea'
                        }} />
                        {formik.touched.email && formik.errors.email && (
                            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formik.errors.email}</div>
                        )}
                    </div>

                    <div style={{ position: 'relative', marginBottom: '20px' }}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            {...formik.getFieldProps('password')}
                            style={{
                                width: '100%',
                                padding: '12px 40px',
                                borderRadius: '30px',
                                backgroundColor: '#f0f0f0',
                                border: 'none',
                                outline: 'none'
                            }}
                        />
                        <FaLock style={{
                            position: 'absolute',
                            left: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#667eea'
                        }} />
                        {formik.touched.password && formik.errors.password && (
                            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formik.errors.password}</div>
                        )}
                    </div>

                    <button type="submit" disabled={loading} style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '30px',
                        backgroundColor: '#667eea',
                        color: '#fff',
                        fontWeight: 'bold',
                        border: 'none',
                        marginTop: '10px',
                        cursor: 'pointer',
                        transition: '0.3s'
                    }}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>

                    <p style={{
                        marginTop: '20px',
                        marginBottom: '10px',
                        textAlign: 'center',
                        fontSize: '14px',
                        color: '#666'
                    }}>or sign up with</p>

<div style={{
    display: 'flex',
    justifyContent: 'center',
    gap: '15px'
}}>
    <a href="https://accounts.google.com/" target="_blank" rel="noopener noreferrer">
        <FaGoogle style={{ fontSize: '24px', cursor: 'pointer', color: '#667eea' }} />
    </a>
    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
        <FaFacebookF style={{ fontSize: '24px', cursor: 'pointer', color: '#667eea' }} />
    </a>
    <a href="https://github.com/Aniqasohail" target="_blank" rel="noopener noreferrer">
        <FaGithub style={{ fontSize: '24px', cursor: 'pointer', color: '#667eea' }} />
    </a>
    <a href="https://linkedin.com/in/Aniqasohail" target="_blank" rel="noopener noreferrer">
        <FaLinkedinIn style={{ fontSize: '24px', cursor: 'pointer', color: '#667eea' }} />
    </a>
</div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
