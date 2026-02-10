import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Menu, X, Sun, Moon, Home, Users, Calendar, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [location, mobileOpen]);

    const navLinks = [
        { to: '/', label: 'Home', icon: Home },
        { to: '/doctors', label: 'Doctors', icon: Users },
        { to: '/booking', label: 'Book Now', icon: Calendar },
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="navbar-content">
                    <Link to="/" className="navbar-logo">
                        <span className="logo-icon"><Activity size={20} /></span>
                        <span>Medi<span className="logo-text-gradient">Book</span></span>
                    </Link>

                    {/* Desktop Links - Hidden on Mobile */}
                    <ul className="navbar-links desktop-only">
                        {navLinks.map(link => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className={location.pathname === link.to ? 'active' : ''}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="navbar-cta">
                        <button
                            onClick={toggleTheme}
                            className="theme-toggle desktop-only"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {isAuthenticated ? (
                            <div className="nav-user-menu desktop-only">
                                <span className="nav-username">Hi, {user?.name?.split(' ')[0]}</span>
                                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="nav-auth-buttons desktop-only">
                                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                                <Link to="/booking" className="btn btn-primary btn-sm">
                                    Get Started
                                </Link>
                            </div>
                        )}

                        <button
                            className="mobile-toggle"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Sheet / Drawer Overlay */}
            <div
                className={`mobile-overlay ${mobileOpen ? 'open' : ''}`}
                onClick={() => setMobileOpen(false)}
            />

            {/* Mobile Sheet Content */}
            <div className={`mobile-sheet ${mobileOpen ? 'open' : ''}`}>
                <div className="sheet-header">
                    <div className="sheet-logo">
                        <span className="logo-icon"><Activity size={18} /></span>
                        <span>MediBook</span>
                    </div>
                    <button
                        className="sheet-close"
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="sheet-content">
                    <ul className="sheet-links">
                        {navLinks.map(link => {
                            const Icon = link.icon;
                            return (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className={`sheet-link ${location.pathname === link.to ? 'active' : ''}`}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <Icon size={18} />
                                        {link.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="sheet-footer">
                        <button onClick={toggleTheme} className="sheet-link theme-switch">
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </button>

                        <div className="sheet-separator" />

                        {isAuthenticated ? (
                            <div className="sheet-user">
                                <div className="user-info">
                                    <div className="user-avatar">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="user-details">
                                        <span className="user-name">{user?.name}</span>
                                        <span className="user-email">{user?.email}</span>
                                    </div>
                                </div>
                                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="btn btn-secondary btn-full">
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="sheet-auth">
                                <Link to="/login" className="btn btn-secondary btn-full" onClick={() => setMobileOpen(false)}>Login</Link>
                                <Link to="/booking" className="btn btn-primary btn-full" onClick={() => setMobileOpen(false)}>Get Started</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;
