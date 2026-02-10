import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import { getDoctors } from '../services/api';
import './Doctors.css';

function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [specialties, setSpecialties] = useState(['All']);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await getDoctors();
                setDoctors(data);

                // Extract unique specialties
                const distinctSpecialties = ['All', ...new Set(data.map(d => d.specialty))];
                setSpecialties(distinctSpecialties);
            } catch (error) {
                console.error("Failed to fetch doctors", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const filtered = doctors.filter(doc => {
        const matchesSearch =
            doc.name.toLowerCase().includes(search.toLowerCase()) ||
            doc.specialty.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
            activeFilter === 'All' || doc.specialty === activeFilter;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <main className="doctors-page">
            <motion.div
                className="doctors-page-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>Find Your Specialist</h1>
                <p>Browse our network of certified medical professionals</p>
            </motion.div>

            <div className="doctors-controls">
                <div className="doctors-search">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search doctors by name or specialty..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className="filter-pills">
                    {specialties.map(spec => (
                        <button
                            key={spec}
                            className={`filter-pill ${activeFilter === spec ? 'active' : ''}`}
                            onClick={() => setActiveFilter(spec)}
                        >
                            {spec}
                        </button>
                    ))}
                </div>
            </div>

            <div className="doctors-grid">
                {filtered.length > 0 ? (
                    filtered.map((doc, i) => (
                        <DoctorCard key={doc.id} doctor={doc} index={i} />
                    ))
                ) : (
                    <p className="no-results">No doctors found matching your search.</p>
                )}
            </div>
        </main>
    );
}

export default Doctors;
