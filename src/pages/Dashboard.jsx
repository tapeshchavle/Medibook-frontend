import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calendar, Clock, Activity, Users,
    Plus, Search, FileText, HeartPulse
} from 'lucide-react';
import AppointmentCard from '../components/AppointmentCard';
import { getPatientAppointments, getDoctorAppointments } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

function Dashboard() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchAppointments = async () => {
            if (user?.id) {
                try {
                    let data;
                    if (user.role === 'DOCTOR') {
                        data = await getDoctorAppointments(user.id);
                    } else {
                        data = await getPatientAppointments(user.id);
                    }
                    setAppointments(data);
                } catch (error) {
                    console.error("Failed to fetch appointments", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (isAuthenticated) {
            fetchAppointments();
        }
    }, [user, isAuthenticated, authLoading, navigate]);

    if (authLoading || loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
            </div>
        );
    }

    const isDoctor = user?.role === 'DOCTOR';

    // Calculate dynamic stats
    const upcomingCount = appointments.filter(a => a.status === 'UPCOMING').length;
    const completedCount = appointments.filter(a => a.status === 'COMPLETED').length;

    let uniqueInteractionCount = 0;
    if (isDoctor) {
        // Unique patients for doctor
        uniqueInteractionCount = new Set(appointments.map(a => a.patient.id)).size;
    } else {
        // Unique doctors for patient
        uniqueInteractionCount = new Set(appointments.map(a => a.doctor.id)).size;
    }

    const dashStats = isDoctor ? [
        { icon: Calendar, label: 'Upcoming Appts', value: upcomingCount, color: 'cyan' },
        { icon: Clock, label: 'Completed', value: completedCount, color: 'emerald' },
        { icon: Users, label: 'Unique Patients', value: uniqueInteractionCount, color: 'violet' },
        { icon: Activity, label: 'Rating', value: '4.9', color: 'amber' }, // Hardcoded for now
    ] : [
        { icon: Calendar, label: 'Upcoming', value: upcomingCount, color: 'cyan' },
        { icon: Clock, label: 'Completed', value: completedCount, color: 'emerald' },
        { icon: Users, label: 'Doctors Visited', value: uniqueInteractionCount, color: 'violet' },
        { icon: Activity, label: 'Health Score', value: '94%', color: 'amber' },
    ];

    return (
        <main className="dashboard-page">
            <motion.div
                className="dashboard-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>Welcome back, <span>{user?.name?.split(' ')[0]}</span></h1>
                <p>
                    {isDoctor
                        ? "Manage your appointments and patient records"
                        : "Here's an overview of your healthcare journey"}
                </p>
            </motion.div>

            {/* Stats */}
            <div className="dashboard-stats">
                {dashStats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        className="glass-card dash-stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                        <div className={`dash-stat-icon ${stat.color}`}>
                            <stat.icon size={22} />
                        </div>
                        <div className="dash-stat-info">
                            <h3>{stat.value}</h3>
                            <span>{stat.label}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Grid */}
            <div className="dashboard-grid">
                <div className="dashboard-section">
                    <h2>{isDoctor ? "Upcoming Appointments" : "Your Appointments"}</h2>
                    <div className="appointments-list">
                        {appointments.length > 0 ? (
                            appointments.map((apt, i) => (
                                <AppointmentCard
                                    key={apt.id}
                                    appointment={apt}
                                    index={i}
                                    role={user?.role} // Pass role to card
                                />
                            ))
                        ) : (
                            <p className="no-appointments">No appointments yet.</p>
                        )}
                    </div>
                </div>

                <div className="dashboard-section">
                    <h2>Quick Actions</h2>
                    <div className="quick-actions">
                        {!isDoctor && (
                            <Link to="/booking" className="quick-action-btn">
                                <Plus size={18} />
                                Book New Appointment
                            </Link>
                        )}
                        {!isDoctor && (
                            <Link to="/doctors" className="quick-action-btn">
                                <Search size={18} />
                                Find a Specialist
                            </Link>
                        )}
                        {isDoctor && (
                            <button className="quick-action-btn">
                                <FileText size={18} />
                                View Patient Records
                            </button>
                        )}
                        {isDoctor && (
                            <button className="quick-action-btn">
                                <Activity size={18} />
                                Manage Availability
                            </button>
                        )}
                        <button className="quick-action-btn">
                            {isDoctor ? <Users size={18} /> : <FileText size={18} />}
                            {isDoctor ? "My Patients" : "View Medical Records"}
                        </button>
                    </div>

                    <div className="health-tip">
                        <h4>💡 {isDoctor ? "Doctor's Note" : "Health Tip of the Day"}</h4>
                        <p>
                            {isDoctor
                                ? "Remember to review patient history before each consultation to ensure personalized care."
                                : "Regular physical activity for at least 30 minutes a day can significantly reduce the risk of chronic diseases and improve mental well-being."}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Dashboard;
