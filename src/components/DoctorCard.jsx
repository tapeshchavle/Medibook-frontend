import { Link } from 'react-router-dom';
import { Star, Clock, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import './DoctorCard.css';

function DoctorCard({ doctor, index = 0 }) {
    return (
        <motion.div
            className="glass-card doctor-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <div className="doctor-card-header">
                <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="doctor-card-avatar"
                />
                <div className="doctor-card-info">
                    <h3>{doctor.name}</h3>
                    <span className="doctor-card-specialty">{doctor.specialty}</span>
                    <div className="doctor-card-rating">
                        <Star size={14} fill="currentColor" />
                        {doctor.rating}
                        <span>({doctor.reviews} reviews)</span>
                    </div>
                </div>
            </div>

            <div className="doctor-card-details">
                <div className="doctor-card-detail">
                    <Clock size={14} />
                    {doctor.experience}
                </div>
                <div className="doctor-card-detail">
                    <Calendar size={14} />
                    {doctor.availability}
                </div>
                <div className="doctor-card-detail">
                    <MapPin size={14} />
                    {doctor.hospital}
                </div>
            </div>

            <div className="doctor-card-footer">
                <div className="doctor-card-fee">
                    ₹{doctor.fee} <span>/ visit</span>
                </div>
                <span className="doctor-card-slot">{doctor.nextSlot}</span>
            </div>

            <Link to={`/booking?doctor=${doctor.id}`} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                Book Appointment
            </Link>
        </motion.div>
    );
}

export default DoctorCard;
