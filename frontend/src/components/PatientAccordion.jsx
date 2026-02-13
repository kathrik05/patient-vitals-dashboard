import React, { useState } from 'react';
import VitalCard from './VitalCard';

const PatientAccordion = ({ patient, onUpdateVitals, onViewHistory }) => {
    const [isOpen, setIsOpen] = useState(true);
    const { latestVital, name, createdAt } = patient;

    // Format Date for "Events" style left block
    // Use recordedAt if avail, else createdAt
    const dateObj = new Date(latestVital?.recordedAt || createdAt);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
    const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const getVitalSummary = () => {
        if (!latestVital) return "No Data";
        return `HR: ${latestVital.heartRate} | SpO₂: ${latestVital.spo2}% | Temp: ${latestVital.temperature}°C`;
    };

    // Helper function to determine vital status (safe, warning, danger)
    const getVitalStatus = (type, value) => {
        switch (type) {
            case 'heartRate':
                if (value >= 60 && value <= 100) return 'safe';
                if ((value >= 50 && value < 60) || (value > 100 && value <= 110)) return 'warning';
                return 'danger';
            case 'spo2':
                if (value >= 95) return 'safe';
                if (value >= 90 && value < 95) return 'warning';
                return 'danger';
            case 'temperature':
                if (value >= 36.1 && value <= 37.2) return 'safe';
                if ((value >= 35.5 && value < 36.1) || (value > 37.2 && value <= 38)) return 'warning';
                return 'danger';
            default:
                return 'safe';
        }
    };

    return (
        <div className={`patient-card ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
            <div className="card-left">
                <div className="date-block">
                    <span className="date-month">{month}</span>
                    <span className="date-day">{day}</span>
                </div>
                <span className="date-time">{time}</span>
            </div>

            <div className="card-middle">
                <h3 className="patient-name">{name}</h3>
                <p className="vital-summary-text">
                    {latestVital ? "Latest Vitals Recorded" : "No Vitals Recorded"}
                    <br />
                    <span className="vital-values-preview">
                        {getVitalSummary()}
                    </span>
                </p>
            </div>

            <div className="card-right">
                <button
                    className="action-btn update-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onUpdateVitals(patient);
                    }}
                >
                    + Update
                </button>
                <button
                    className="action-btn history-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewHistory(patient._id);
                    }}
                >
                    History
                </button>
            </div>

            {isOpen && (
                <div className="card-expansion" onClick={(e) => e.stopPropagation()}>
                    <div className="expansion-content">
                        {latestVital ? (
                            <div className="vitals-grid-small">
                                <div className={`vital-box ${getVitalStatus('heartRate', latestVital.heartRate)}`}>
                                    <span className="lbl">Heart Rate</span>
                                    <span className="val">{latestVital.heartRate} <small>bpm</small></span>
                                    <span className="status-indicator"></span>
                                </div>
                                <div className={`vital-box ${getVitalStatus('spo2', latestVital.spo2)}`}>
                                    <span className="lbl">SpO₂</span>
                                    <span className="val">{latestVital.spo2} <small>%</small></span>
                                    <span className="status-indicator"></span>
                                </div>
                                <div className={`vital-box ${getVitalStatus('temperature', latestVital.temperature)}`}>
                                    <span className="lbl">Temp</span>
                                    <span className="val">{latestVital.temperature} <small>°C</small></span>
                                    <span className="status-indicator"></span>
                                </div>
                            </div>
                        ) : (
                            <p>No details available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientAccordion;
