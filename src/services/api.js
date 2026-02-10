import axios from 'axios';

const API_URL = import.meta.env.PROD
    ? 'https://medibook-api-b4g2f9ewh2g7anax.centralindia-01.azurewebsites.net'
    : '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth Services
export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const registerDoctor = async (doctorData) => {
    const response = await api.post('/auth/register/doctor', doctorData);
    return response.data;
};

export const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

// Data Services
export const getDoctors = async () => {
    const response = await api.get('/doctors');
    return response.data;
};

export const getServices = async () => {
    const response = await api.get('/services');
    return response.data;
};

export const getTestimonials = async () => {
    const response = await api.get('/testimonials');
    return response.data;
};

// Appointment Services
export const bookAppointment = async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
};

export const getPatientAppointments = async (patientId) => {
    const response = await api.get(`/appointments/patient/${patientId}`);
    return response.data;
};

export const getDoctorAppointments = async (doctorId) => {
    const response = await api.get(`/appointments/doctor/${doctorId}`);
    return response.data;
};

// Payment Services
export const createOrder = async (amount) => {
    const response = await api.post('/payment/create-order', { amount });
    return response.data;
};

export const verifyPayment = async (paymentData) => {
    const response = await api.post('/payment/verify', paymentData);
    return response.data;
};

export default api;
