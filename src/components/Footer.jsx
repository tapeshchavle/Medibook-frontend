import { Link } from 'react-router-dom';
import { Activity, Github, Twitter, Linkedin } from 'lucide-react';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <span className="logo-icon"><Activity size={18} /></span>
                        <span>MediBook</span>
                    </div>
                    <p>
                        Revolutionizing healthcare with AI-powered appointment booking,
                        connecting you with world-class specialists instantly.
                    </p>
                </div>

                <div className="footer-column">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/doctors">Find Doctors</Link></li>
                        <li><Link to="/booking">Book Appointment</Link></li>
                        <li><Link to="/dashboard">My Dashboard</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Services</h4>
                    <ul>
                        <li><a href="#">General Checkup</a></li>
                        <li><a href="#">Cardiac Care</a></li>
                        <li><a href="#">Neural Scanning</a></li>
                        <li><a href="#">Genomic Analysis</a></li>
                    </ul>
                </div>

                <div className="footer-newsletter">
                    <h4>Stay Updated</h4>
                    <p>Subscribe for health tips and platform updates.</p>
                    <div className="newsletter-input">
                        <input type="email" placeholder="your@email.com" />
                        <button>Subscribe</button>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <span>© 2026 MediBook. All rights reserved.</span>
                <div className="footer-socials">
                    <a href="#" aria-label="Twitter"><Twitter size={16} /></a>
                    <a href="#" aria-label="LinkedIn"><Linkedin size={16} /></a>
                    <a href="#" aria-label="GitHub"><Github size={16} /></a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
