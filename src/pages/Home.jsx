import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Shield, CalendarCheck } from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import ServiceCard from '../components/ServiceCard';
import TestimonialCard from '../components/TestimonialCard';
import { getDoctors, getServices, getTestimonials } from '../services/api';
import { stats } from '../data/data';
import './Home.css';

function Home() {
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [docsData, servsData, testsData] = await Promise.all([
                    getDoctors(),
                    getServices(),
                    getTestimonials()
                ]);
                setDoctors(docsData);
                setServices(servsData);
                setTestimonials(testsData);
            } catch (error) {
                console.error("Failed to fetch home data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <main>
            {/* ===== Hero Section ===== */}
            <section className="hero">
                <div className="hero-bg">
                    <img src="/images/hero.png" alt="Futuristic medical technology" />
                    <div className="hero-overlay" />
                    <div className="hero-radial" />
                </div>

                <div className="hero-content">
                    <motion.div
                        className="hero-text"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="hero-badge">
                            <span className="pulse-dot" />
                            AI-Powered Healthcare Platform
                        </div>
                        <h1>
                            The Future of
                            <br />
                            <span className="gradient-text">Healthcare Booking</span>
                        </h1>
                        <p>
                            Experience next-generation medical care with instant AI diagnostics,
                            seamless appointment scheduling, and access to 200+ world-class
                            specialists — all from one unified platform.
                        </p>
                        <div className="hero-actions">
                            <Link to="/booking" className="btn btn-primary">
                                Book Appointment
                            </Link>
                            <Link to="/doctors" className="btn btn-secondary">
                                Explore Doctors
                            </Link>
                        </div>

                        <div className="hero-stats-row">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    className="hero-stat"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                                >
                                    <div className="stat-value">{stat.value}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-visual"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <div className="hero-image-wrapper">
                            <img src="/images/hero.png" alt="Advanced medical interface" />
                            <div className="hero-floating-card card-1">
                                <span className="fc-icon cyan"><Zap size={16} /></span>
                                <span>AI Diagnosis Ready</span>
                            </div>
                            <div className="hero-floating-card card-2">
                                <span className="fc-icon emerald"><Shield size={16} /></span>
                                <span>99.9% Accuracy</span>
                            </div>
                            <div className="hero-floating-card card-3">
                                <span className="fc-icon violet"><CalendarCheck size={16} /></span>
                                <span>Instant Booking</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== Services Section ===== */}
            <section className="section" id="services">
                <h2 className="section-title">Our Services</h2>
                <p className="section-subtitle">
                    Cutting-edge medical services powered by advanced technology and expert care
                </p>
                <div className="services-grid container">
                    {services.map((service, i) => (
                        <ServiceCard key={service.id} service={service} index={i} />
                    ))}
                </div>
            </section>

            {/* ===== Featured Doctors ===== */}
            <section className="section" id="doctors">
                <h2 className="section-title">Featured Specialists</h2>
                <p className="section-subtitle">
                    Meet our top-rated medical professionals with years of expertise
                </p>
                <div className="doctors-preview container">
                    {doctors.slice(0, 3).map((doctor, i) => (
                        <DoctorCard key={doctor.id} doctor={doctor} index={i} />
                    ))}
                </div>
                <div className="section-cta">
                    <Link to="/doctors" className="btn btn-secondary">
                        View All Doctors
                    </Link>
                </div>
            </section>

            {/* ===== Stats ===== */}
            <section className="section stats-section">
                <div className="stats-grid container">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            className="glass-card stat-item"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <div className="stat-number">{stat.value}</div>
                            <div className="stat-text">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ===== Testimonials ===== */}
            <section className="section">
                <h2 className="section-title">What Patients Say</h2>
                <p className="section-subtitle">
                    Real stories from patients who trust MediBook for their healthcare needs
                </p>
                <div className="testimonials-grid container">
                    {testimonials.map((t, i) => (
                        <TestimonialCard key={t.id} testimonial={t} index={i} />
                    ))}
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="section cta-section">
                <motion.div
                    className="cta-inner"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2>Ready to Experience the Future?</h2>
                    <p>
                        Join 50,000+ patients already using MediBook for smarter, faster healthcare.
                    </p>
                    <Link to="/booking" className="btn btn-primary">
                        Get Started Now
                    </Link>
                </motion.div>
            </section>
        </main>
    );
}

export default Home;
