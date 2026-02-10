import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import './TestimonialCard.css';

function TestimonialCard({ testimonial, index = 0 }) {
    return (
        <motion.div
            className="glass-card testimonial-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
        >
            <div className="testimonial-card-header">
                <div className="testimonial-avatar">{testimonial.avatar}</div>
                <div className="testimonial-info">
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.role}</span>
                </div>
            </div>
            <div className="testimonial-stars">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                ))}
            </div>
            <p className="testimonial-text">"{testimonial.text}"</p>
        </motion.div>
    );
}

export default TestimonialCard;
