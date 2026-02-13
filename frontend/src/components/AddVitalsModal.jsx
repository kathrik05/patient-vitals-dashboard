import React, { useState } from 'react';

const AddVitalsModal = ({ isOpen, onClose, patientId, onVitalsAdded }) => {
    const [formData, setFormData] = useState({
        heartRate: '',
        spo2: '',
        temperature: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic client-side validation
        if (!formData.heartRate || !formData.spo2 || !formData.temperature) {
            setError('All fields are required');
            setLoading(false);
            return;
        }

        try {
            const payload = {
                patientId,
                heartRate: Number(formData.heartRate),
                spo2: Number(formData.spo2),
                temperature: Number(formData.temperature),
                recordedAt: new Date().toISOString()
            };

            console.log("Submitting vitals payload:", payload);

            const response = await fetch('http://localhost:5000/api/vitals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to add vitals');
            }

            const newVital = await response.json();
            console.log("Successfully saved vital:", newVital);
            onVitalsAdded(newVital);
            setFormData({ heartRate: '', spo2: '', temperature: '' });
            onClose();
        } catch (err) {
            console.error("Error saving vitals:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add Vitals</h2>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>

                {error && <p className="error-text">{error}</p>}

                <form onSubmit={handleSubmit} className="vitals-form">
                    <div className="form-group">
                        <label>Heart Rate (bpm)</label>
                        <input
                            type="number"
                            name="heartRate"
                            value={formData.heartRate}
                            onChange={handleChange}
                            placeholder="e.g. 72"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>SpO₂ (%)</label>
                        <input
                            type="number"
                            name="spo2"
                            value={formData.spo2}
                            onChange={handleChange}
                            placeholder="e.g. 98"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Temperature (°C)</label>
                        <input
                            type="number"
                            name="temperature"
                            value={formData.temperature}
                            onChange={handleChange}
                            placeholder="e.g. 36.5"
                            step="0.1"
                            disabled={loading}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} disabled={loading}>Cancel</button>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Vitals'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVitalsModal;
