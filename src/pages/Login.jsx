import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Mail, Lock, User, Phone, Stethoscope, ChevronRight } from 'lucide-react';
import './Login.css';

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [isDoctorRegister, setIsDoctorRegister] = useState(false);
    const { login, register, registerDoctor } = useAuth(); // Assuming registerDoctor is exposed in AuthContext
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
        specialty: '',
        hospital: '',
        experience: '',
        fee: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login({ email: formData.email, password: formData.password });
            } else {
                if (isDoctorRegister) {
                    await registerDoctor({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        specialty: formData.specialty,
                        hospital: formData.hospital,
                        experience: formData.experience,
                        fee: parseFloat(formData.fee),
                        role: 'DOCTOR',
                        image: `/images/doctor${Math.floor(Math.random() * 3) + 1}.png` // Assign random avatar for now
                    });
                } else {
                    await register({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        phone: formData.phone,
                        role: 'PATIENT'
                    });
                }
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-page">
            <div className="login-container">
                <div className="login-card glass-card">
                    <div className="login-header">
                        <Activity className="login-logo" size={40} />
                        <h1>
                            {isLogin
                                ? 'Welcome Back'
                                : isDoctorRegister ? 'Doctor Registration' : 'Patient Registration'}
                        </h1>
                        <p>
                            {isLogin
                                ? 'Enter your details to access your account'
                                : isDoctorRegister ? 'Join our network of healthcare professionals' : 'Join MediBook for better healthcare'}
                        </p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit} className="login-form">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="form-group-motion"
                                >
                                    <div className="form-group">
                                        <User size={18} />
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Full Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required={!isLogin}
                                        />
                                    </div>

                                    {isDoctorRegister ? (
                                        <>
                                            <div className="form-group">
                                                <Stethoscope size={18} />
                                                <input
                                                    type="text"
                                                    name="specialty"
                                                    placeholder="Specialty (e.g. Cardiology)"
                                                    value={formData.specialty}
                                                    onChange={handleChange}
                                                    required={!isLogin && isDoctorRegister}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <Activity size={18} />
                                                <input
                                                    type="text"
                                                    name="hospital"
                                                    placeholder="Hospital / Clinic Name"
                                                    value={formData.hospital}
                                                    onChange={handleChange}
                                                    required={!isLogin && isDoctorRegister}
                                                />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        name="experience"
                                                        placeholder="Experience (e.g. 5 yrs)"
                                                        value={formData.experience}
                                                        onChange={handleChange}
                                                        required={!isLogin && isDoctorRegister}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="number"
                                                        name="fee"
                                                        placeholder="Consultation Fee ($)"
                                                        value={formData.fee}
                                                        onChange={handleChange}
                                                        required={!isLogin && isDoctorRegister}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="form-group">
                                            <Phone size={18} />
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="Phone Number"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required={!isLogin}
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="form-group">
                            <Mail size={18} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <Lock size={18} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                            {loading ? (
                                <span className="loader"></span>
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Sign Up'}
                                    <ChevronRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>

                        {!isLogin && (
                            <div className="doctor-toggle-wrapper" style={{ marginTop: '1rem' }}>
                                <button
                                    className="toggle-btn-secondary"
                                    onClick={() => setIsDoctorRegister(!isDoctorRegister)}
                                    style={{ fontSize: '0.9rem', opacity: 0.8 }}
                                >
                                    {isDoctorRegister ? "Register as Patient instead" : "Are you a Doctor? Register here"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Login;
