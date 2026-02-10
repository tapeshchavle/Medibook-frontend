import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import './ServiceCard.css';

function ServiceCard({ service, index = 0 }) {
    const IconComponent = Icons[service.icon] || Icons.Activity;

    return (
        <motion.div
            className="glass-card service-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <div className="service-card-icon">
                <IconComponent size={28} />
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
        </motion.div>
    );
}

export default ServiceCard;
