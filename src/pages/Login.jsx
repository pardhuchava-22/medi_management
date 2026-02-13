import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowRight } from 'lucide-react';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate login
        navigate('/');
    };

    return (
        <div className="login-container">
            <div className="login-form-section">
                <div className="login-header">
                    <div className="logo">
                        <Activity size={28} className="logo-icon" />
                        <span>MediIntel.ai</span>
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Please enter your details to access your dashboard.</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                placeholder="doctor@hospital.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <div className="remember-me">
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>

                    <button type="submit" className="login-btn">
                        Sign In <ArrowRight size={18} />
                    </button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <a href="#">Contact Admin</a></p>
                </div>
            </div>

            <div className="login-banner-section">
                <div className="banner-content">
                    <h2>Transforming Healthcare with Data-Driven Decisions.</h2>
                    <p>Empowering administrators and medical professionals with real-time analytics to improve patient outcomes.</p>
                    <div className="feature-badges">
                        <span className="badge">AI Forecasting</span>
                        <span className="badge">Real-time Insights</span>
                        <span className="badge">Resource Optimization</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
