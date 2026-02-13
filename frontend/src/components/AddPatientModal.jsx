import React, { useState } from 'react';

const AddPatientModal = ({ isOpen, onClose, onPatientAdded }) => {
    const [name, setName] = useState('');
    const [vitals, setVitals] = useState({
        heartRate: '',
        spo2: '',
        temperature: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleVitalChange = (e) => {
        const { name, value } = e.target;
        setVitals(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Patient name is required');
            return;
        }

        // Optional: Check if vitals are provided (as per brief: "ask their vitals")
        // We will treat them as required for the "Add Patient" flow now.
        if (!vitals.heartRate || !vitals.spo2 || !vitals.temperature) {
            setError('Please enter initial vitals');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 1. Create Patient
            const patientRes = await fetch('http://localhost:5000/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (!patientRes.ok) throw new Error('Failed to add patient');
            const newPatient = await patientRes.json();

            // 2. Add Vitals
            const vitalsPayload = {
                patientId: newPatient._id,
                heartRate: Number(vitals.heartRate),
                spo2: Number(vitals.spo2),
                temperature: Number(vitals.temperature),
                recordedAt: new Date().toISOString()
            };

            const vitalsRes = await fetch('http://localhost:5000/api/vitals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vitalsPayload),
            });

            if (!vitalsRes.ok) throw new Error('Failed to add initial vitals');
            const newVital = await vitalsRes.json();

            // 3. Combine for frontend update
            const patientWithVital = {
                ...newPatient,
                latestVital: newVital
            };

            onPatientAdded(patientWithVital);

            // Reset & Close
            setName('');
            setVitals({ heartRate: '', spo2: '', temperature: '' });
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add New Patient</h2>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>

                {error && <p className="error-text">{error}</p>}

                <form onSubmit={handleSubmit} className="add-patient-form">
                    <div className="form-group">
                        <label>Patient Name</label>
                        <input
                            type="text"
                            placeholder="e.g. John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="vitals-inputs-row">
                        <div className="form-group">
                            <label>Heart Rate</label>
                            <input
                                type="number"
                                name="heartRate"
                                placeholder="bpm"
                                value={vitals.heartRate}
                                onChange={handleVitalChange}
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>SpO₂</label>
                            <input
                                type="number"
                                name="spo2"
                                placeholder="%"
                                value={vitals.spo2}
                                onChange={handleVitalChange}
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Temp</label>
                            <input
                                type="number"
                                name="temperature"
                                placeholder="°C"
                                value={vitals.temperature}
                                onChange={handleVitalChange}
                                step="0.1"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} disabled={loading}>Cancel</button>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Patient & Vitals'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPatientModal;
