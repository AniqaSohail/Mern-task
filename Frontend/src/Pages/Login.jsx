import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { useFormik } from 'formik';
import userLoginValidationSchema from '../Validation/userLoginValidationSchema';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { login } from '../store/authSlice.mjs';
import { useDispatch } from 'react-redux';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [resetPassword, setResetPassword] = useState('');
    const [resetId, setResetId] = useState('');
    const [resetToken, setResetToken] = useState('');

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        const token = params.get('token');
        if (id && token) {
            setResetId(id);
            setResetToken(token);
            setShowResetPassword(true);
        }
    }, [location]);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: userLoginValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await axios.post(`${apiUrl}/login`, {
                    email: values.email,
                    password: values.password
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });

                setLoading(false);

                if (response.status >= 200 && response.status < 300) {
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("userID", response.data.user.id);
                    dispatch(login({
                        token: response.data.token,
                        userID: response.data.user.id
                    }));
                    Swal.fire({
                        title: 'Success!',
                        text: 'You have logged in successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        navigate('/create-task');
                    });
                }
            } catch (error) {
                console.error('Login error:', error);
                setLoading(false);
                Swal.fire({
                    title: 'Error!',
                    text: error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        },
    });

    const handleForgotPassword = async () => {
        if (!forgotPasswordEmail) {
            Swal.fire({
                title: 'Error!',
                text: 'Please enter your email address',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${apiUrl}/forget`, {
                email: forgotPasswordEmail
            });
            setLoading(false);
            if (response.status >= 200 && response.status < 300) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Password reset link sent!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                setShowForgotPassword(false);
            }
        } catch (error) {
            setLoading(false);
            Swal.fire({
                title: 'Error!',
                text: error?.response?.data?.message || error?.message || 'Failed to send reset link.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleResetPassword = async () => {
        if (!resetPassword) {
            Swal.fire({
                title: 'Error!',
                text: 'Please enter a new password',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${apiUrl}/resetpassword/${resetId}/${resetToken}`, {
                password: resetPassword
            });
            setLoading(false);
            if (response.status >= 200 && response.status < 300) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Password reset successful!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                setShowResetPassword(false);
            }
        } catch (error) {
            setLoading(false);
            Swal.fire({
                title: 'Error!',
                text: error?.response?.data?.message || error?.message || 'Failed to reset password.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div style={styles.authContainer}>
            <form onSubmit={formik.handleSubmit} style={styles.authForm}>
                <div style={styles.authWelcomeSection}>
                    <div>
                        <h2 style={styles.welcomeHeading}>Hello, Welcome!</h2>
                        <p>Don't have an account?</p>
                        <Link to="/" style={styles.authLinkButton}>Sign up here</Link>
                    </div>
                </div>

                <div style={styles.authFormSection}>
                    {!showForgotPassword && !showResetPassword && <h1 style={styles.formHeading}>Login</h1>}

                    {showForgotPassword ? (
                        <>
                            <h3 style={styles.formHeading}>Forgot Password</h3>
                            <p>Enter your email to reset your password</p>
                            <div style={styles.inputField}>
                                <FaEnvelope style={styles.inputIcon} />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={forgotPasswordEmail}
                                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                    style={styles.input}
                                />
                            </div>
                            <button type="button" style={styles.authButton} onClick={handleForgotPassword} disabled={loading}>
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                            <button type="button" style={styles.textButton} onClick={() => setShowForgotPassword(false)}>
                                Back to Login
                            </button>
                        </>
                    ) : showResetPassword ? (
                        <>
                            <h3 style={styles.formHeading}>Reset Password</h3>
                            <p>Set your new password below</p>
                            <div style={styles.inputField}>
                                <FaLock style={styles.inputIcon} />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={resetPassword}
                                    onChange={(e) => setResetPassword(e.target.value)}
                                    style={styles.input}
                                />
                            </div>
                            <button type="button" style={styles.authButton} onClick={handleResetPassword} disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                            <button type="button" style={styles.textButton} onClick={() => setShowResetPassword(false)}>
                                Back to Login
                            </button>
                        </>
                    ) : (
                        <>
                            <div style={styles.inputField}>
                                <FaEnvelope style={styles.inputIcon} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    {...formik.getFieldProps('email')}
                                    style={styles.input}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <div style={styles.errorMessage}>{formik.errors.email}</div>
                                )}
                            </div>

                            <div style={styles.inputField}>
                                <FaLock style={styles.inputIcon} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    {...formik.getFieldProps('password')}
                                    style={styles.input}
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <div style={styles.errorMessage}>{formik.errors.password}</div>
                                )}
                            </div>

                            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                                <button type="button" style={styles.textButton} onClick={() => setShowForgotPassword(true)}>
                                    Forgot Password?
                                </button>
                            </div>

                            <button type="submit" style={styles.authButton} disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>

                            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                                <span>or login with</span>
                            </div>

                            <div style={styles.socialAuth}>
                                <button type="button" style={styles.socialButton}><FaGoogle /></button>
                                <button type="button" style={styles.socialButton}><FaFacebookF /></button>
                                <button type="button" style={styles.socialButton}><FaGithub /></button>
                                <button type="button" style={styles.socialButton}><FaLinkedinIn /></button>
                            </div>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
};

const styles = {
    authContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
        padding: '20px',
    },
    authForm: {
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
        display: 'flex',
        overflow: 'hidden',
        maxWidth: '1000px',
        width: '100%',
    },
    authWelcomeSection: {
        background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
        flex: 1,
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '40px 30px',
    },
    authFormSection: {
        flex: 1,
        padding: '40px 30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    welcomeHeading: {
        fontSize: '32px',
        marginBottom: '15px',
    },
    authLinkButton: {
        backgroundColor: 'transparent',
        border: '2px solid white',
        padding: '10px 20px',
        borderRadius: '30px',
        color: 'white',
        textDecoration: 'none',
        transition: '0.3s',
        marginTop: '10px',
    },
    formHeading: {
        fontSize: '28px',
        marginBottom: '20px',
        fontWeight: 'bold',
        color: '#333',
    },
    inputField: {
        position: 'relative',
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        padding: '12px 12px 12px 40px',
        borderRadius: '30px',
        border: '1px solid #ccc',
        fontSize: '16px',
        outline: 'none',
    },
    inputIcon: {
        position: 'absolute',
        top: '50%',
        left: '15px',
        transform: 'translateY(-50%)',
        color: '#aaa',
    },
    authButton: {
        backgroundColor: '#6e8efb',
        color: '#fff',
        padding: '12px',
        border: 'none',
        borderRadius: '30px',
        fontSize: '16px',
        cursor: 'pointer',
        width: '100%',
        marginTop: '10px',
    },
    textButton: {
        background: 'none',
        border: 'none',
        color: '#6e8efb',
        textDecoration: 'underline',
        fontSize: '14px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    socialAuth: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
    },
    socialButton: {
        background: '#eee',
        border: 'none',
        padding: '10px',
        borderRadius: '50%',
        fontSize: '18px',
        cursor: 'pointer',
    },
    errorMessage: {
        fontSize: '12px',
        color: 'red',
        marginTop: '5px',
    },
};

export default Login;
