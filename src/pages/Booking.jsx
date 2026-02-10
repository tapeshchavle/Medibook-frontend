import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CalendarCheck, ArrowLeft, ArrowRight, Loader } from 'lucide-react';
import { getDoctors, bookAppointment, createOrder, verifyPayment } from '../services/api';
import { timeSlots } from '../data/data';
import { useAuth } from '../context/AuthContext';
import './Booking.css';

const stepLabels = ['Select Doctor', 'Date & Time', 'Confirm'];

function Booking() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [step, setStep] = useState(0);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTime, setSelectedTime] = useState('');
    const [booked, setBooked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await getDoctors();
                setDoctors(data);

                const doctorId = searchParams.get('doctor');
                if (doctorId) {
                    const doc = data.find(d => d.id === parseInt(doctorId));
                    if (doc) {
                        setSelectedDoctor(doc);
                        setStep(1);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch doctors", error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchDoctors();
        } else {
            // If not authenticated, we can still show/fetch doctors, 
            // but we might want to redirect to login eventually using a protected route wrapper.
            // For now, let's fetch doctors so the page works, but block the final step.
            fetchDoctors();
        }
    }, [searchParams, isAuthenticated]);

    const handleConfirm = async () => {
        if (!isAuthenticated) {
            // Enhanced: Redirect to login with return URL or just alert for now
            alert("You must be logged in to confirm an appointment.");
            navigate('/login');
            return;
        }

        setSubmitting(true);
        setError('');

        // Double check date validaton
        if (new Date(selectedDate) < new Date().setHours(0, 0, 0, 0)) {
            setError('Please select a valid future date.');
            setSubmitting(false);
            return;
        }

        try {
            // 1. Create Order
            const orderData = await createOrder(selectedDoctor.fee);
            // const orderData = JSON.parse(order); // API returns object, no need to parse

            const options = {
                key: "rzp_test_fIHdXKFZG9UZ0w", // Updated to match backend configuration
                amount: orderData.amount,
                currency: orderData.currency,
                name: "MediBook Healthcare",
                description: `Consultation with ${selectedDoctor.name}`,
                image: "/images/logo.png", // Ensure this exists or use placeholder
                order_id: orderData.id,
                handler: async function (response) {
                    try {
                        // 2. Verify Payment
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        // 3. Book Appointment
                        await bookAppointment({
                            patientId: user.id,
                            doctorId: selectedDoctor.id,
                            date: selectedDate,
                            time: selectedTime,
                            status: 'UPCOMING',
                            paymentId: response.razorpay_payment_id
                        });
                        setBooked(true);
                    } catch (err) {
                        console.error("Payment verification or booking failed", err);
                        setError('Payment successful but booking failed. Please contact support.');
                    } finally {
                        setSubmitting(false);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone
                },
                theme: {
                    color: "#00e5ff"
                },
                modal: {
                    ondismiss: function () {
                        setSubmitting(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("Booking initiation failed", err);
            setError('Failed to initiate booking. Please try again.');
            setSubmitting(false);
        }
    };

    const canProceed = () => {
        if (step === 0) return selectedDoctor !== null;
        if (step === 1) return selectedDate !== '' && selectedTime !== '';
        return true;
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
            </div>
        );
    }

    if (booked) {
        return (
            <main className="booking-page">
                <motion.div
                    className="booking-success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="success-icon">
                        <CalendarCheck size={36} />
                    </div>
                    <h2>Appointment Booked!</h2>
                    <p>
                        Your appointment with {selectedDoctor?.name} has been confirmed
                        for {selectedDate} at {selectedTime}.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/dashboard" className="btn btn-primary">
                            View Dashboard
                        </Link>
                        <Link to="/doctors" className="btn btn-secondary">
                            Book Another
                        </Link>
                    </div>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="booking-page">
            <motion.div
                className="booking-page-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>Book Appointment</h1>
                <p>Schedule your visit in just a few simple steps</p>
            </motion.div>

            {!isAuthenticated && (
                <div className="auth-warning">
                    <p>Please <Link to="/login">login</Link> to book an appointment.</p>
                </div>
            )}

            {/* Progress Steps */}
            <div className="booking-steps">
                {stepLabels.map((label, i) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                            className={`booking-step ${i === step ? 'active' : i < step ? 'completed' : ''
                                }`}
                        >
                            <span className="booking-step-num">
                                {i < step ? <Check size={14} /> : i + 1}
                            </span>
                            {label}
                        </div>
                        {i < stepLabels.length - 1 && (
                            <div className={`step-connector ${i < step ? 'active' : ''}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    className="booking-step-content"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Step 1: Select Doctor */}
                    {step === 0 && (
                        <div className="doctor-select-grid">
                            {doctors.map(doc => (
                                <div
                                    key={doc.id}
                                    className={`doctor-select-item ${selectedDoctor?.id === doc.id ? 'selected' : ''
                                        }`}
                                    onClick={() => setSelectedDoctor(doc)}
                                >
                                    <img src={doc.image} alt={doc.name} />
                                    <div>
                                        <h4>{doc.name}</h4>
                                        <span>{doc.specialty}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Step 2: Date & Time */}
                    {step === 1 && (
                        <div className="datetime-grid">
                            <div className="date-picker-wrapper">
                                <h3>Select Date</h3>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={e => {
                                        const date = e.target.value;
                                        if (new Date(date) < new Date().setHours(0, 0, 0, 0)) {
                                            alert("Please select a future date.");
                                            return;
                                        }
                                        setSelectedDate(date);
                                    }}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div className="time-picker-wrapper">
                                <h3>Select Time</h3>
                                <div className="time-slots-grid">
                                    {timeSlots.map(slot => {
                                        const isAvailable = (() => {
                                            if (!selectedDate) return true;
                                            const today = new Date();
                                            const selected = new Date(selectedDate);
                                            const currentDataString = today.toISOString().split('T')[0];

                                            if (selectedDate === currentDataString) {
                                                const [time, modifier] = slot.split(' ');
                                                let [hours, minutes] = time.split(':');
                                                hours = parseInt(hours, 10);
                                                if (modifier === 'PM' && hours < 12) hours += 12;
                                                if (modifier === 'AM' && hours === 12) hours = 0;

                                                const slotDate = new Date();
                                                slotDate.setHours(hours, parseInt(minutes, 10), 0, 0);
                                                return slotDate > new Date();
                                            }
                                            return true;
                                        })();

                                        return (
                                            <button
                                                key={slot}
                                                className={`time-slot ${selectedTime === slot ? 'selected' : ''}`}
                                                onClick={() => isAvailable && setSelectedTime(slot)}
                                                disabled={!isAvailable}
                                                style={{
                                                    opacity: isAvailable ? 1 : 0.5,
                                                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                                                    backgroundColor: !isAvailable ? '#e0e0e0' : undefined,
                                                    color: !isAvailable ? '#999' : undefined,
                                                    border: !isAvailable ? '1px solid #ccc' : undefined
                                                }}
                                            >
                                                {slot}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirm */}
                    {step === 2 && (
                        <div className="glass-card confirmation-card">
                            <h3>Confirm Your Appointment</h3>
                            <div className="confirm-detail">
                                <span className="label">Doctor</span>
                                <span className="value">{selectedDoctor?.name}</span>
                            </div>
                            <div className="confirm-detail">
                                <span className="label">Specialty</span>
                                <span className="value">{selectedDoctor?.specialty}</span>
                            </div>
                            <div className="confirm-detail">
                                <span className="label">Date</span>
                                <span className="value">{selectedDate}</span>
                            </div>
                            <div className="confirm-detail">
                                <span className="label">Time</span>
                                <span className="value">{selectedTime}</span>
                            </div>
                            <div className="confirm-detail">
                                <span className="label">Fee</span>
                                <span className="value">₹{selectedDoctor?.fee}</span>
                            </div>
                            <div className="confirm-detail">
                                <span className="label">Hospital</span>
                                <span className="value">{selectedDoctor?.hospital}</span>
                            </div>
                            {error && <p className="error-text" style={{ color: '#f87171', marginTop: '1rem' }}>{error}</p>}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Nav Buttons */}
            <div className="booking-nav">
                {step > 0 ? (
                    <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)} disabled={submitting}>
                        <ArrowLeft size={16} /> Back
                    </button>
                ) : (
                    <div />
                )}
                {step < 2 ? (
                    <button
                        className="btn btn-primary"
                        onClick={() => setStep(s => s + 1)}
                        disabled={!canProceed()}
                        style={{ opacity: canProceed() ? 1 : 0.5 }}
                    >
                        Next <ArrowRight size={16} />
                    </button>
                ) : (
                    <button
                        className="btn btn-primary"
                        onClick={handleConfirm}
                        disabled={submitting || !isAuthenticated}
                        style={{ opacity: (!submitting && isAuthenticated) ? 1 : 0.5 }}
                    >
                        {submitting ? (
                            <>Processing...</>
                        ) : (
                            <>
                                <CalendarCheck size={16} />
                                {isAuthenticated ? 'Pay & Confirm' : 'Login to Book'}
                            </>
                        )}
                    </button>
                )}
            </div>
        </main >
    );
}

export default Booking;
