import React from 'react';

const PatientSelector = ({ patients, selectedPatientId, onSelect, loading }) => {
    return (
        <div className="patient-selector">
            <label htmlFor="patient-select">Select Patient:</label>
            <select
                id="patient-select"
                value={selectedPatientId}
                onChange={(e) => onSelect(e.target.value)}
                disabled={loading}
            >
                <option value="">-- Select a Patient --</option>
                {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                        {patient.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default PatientSelector;
