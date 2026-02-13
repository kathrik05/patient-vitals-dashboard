import React from 'react';

const PatientHistoryModal = ({ isOpen, onClose, patient, history, loading }) => {
    if (!isOpen || !patient) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content history-modal">
                <div className="modal-header">
                    <h2>History: {patient.name}</h2>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>

                {loading ? (
                    <p>Loading history...</p>
                ) : history.length === 0 ? (
                    <p>No history available.</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date/Time</th>
                                    <th>Heart Rate</th>
                                    <th>SpO₂</th>
                                    <th>Temp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((record) => (
                                    <tr key={record._id}>
                                        <td>{new Date(record.recordedAt).toLocaleString()}</td>
                                        <td className={record.heartRate < 60 || record.heartRate > 100 ? 'abnormal-text' : ''}>
                                            {record.heartRate} bpm
                                        </td>
                                        <td className={record.spo2 < 95 ? 'abnormal-text' : ''}>
                                            {record.spo2}%
                                        </td>
                                        <td className={record.temperature > 37.5 ? 'abnormal-text' : ''}>
                                            {record.temperature}°C
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientHistoryModal;
