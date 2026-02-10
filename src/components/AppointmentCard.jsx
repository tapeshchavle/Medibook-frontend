import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import './AppointmentCard.css';

function AppointmentCard({ appointment, index = 0, role }) {
    const isDoctor = role === 'DOCTOR';

    // Display info logic
    const displayName = isDoctor ? appointment.patient?.name : appointment.doctor?.name;
    const displayImage = isDoctor ? '/images/patient-default.png' : (appointment.doctor?.image || '/images/doctor1.png');
    const displaySubtext = isDoctor ? 'Patient' : appointment.doctor?.specialty;

    return (
        <motion.div
            className="glass-card appointment-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
        >
            <img
                src={displayImage}
                alt={displayName}
                className="appointment-card-avatar"
                onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + displayName + '&background=0D8ABC&color=fff'; }}
            />
            <div className="appointment-card-info">
                <h4>{displayName}</h4>
                <span className="appointment-specialty">{displaySubtext}</span>
                <div className="appointment-card-meta">
                    <span><Calendar size={12} /> {appointment.date}</span>
                    <span><Clock size={12} /> {appointment.time}</span>
                </div>
            </div>
            <span className={`appointment-status ${appointment.status}`}>
                {appointment.status}
            </span>
        </motion.div>
    );
}

export default AppointmentCard;
