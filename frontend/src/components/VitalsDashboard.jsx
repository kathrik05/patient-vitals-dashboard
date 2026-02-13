import React from 'react';
import VitalCard from './VitalCard';

const VitalsDashboard = ({ vitals, loading, error, onViewHistory }) => {
    if (loading) {
        return <div className="dashboard-message">Loading vitals...</div>;
    }

    if (error) {
        return <div className="dashboard-message error">{error}</div>;
    }

    if (!vitals) {
        return <div className="dashboard-message">No vitals data available for this patient.</div>;
    }

    const { heartRate, spo2, temperature } = vitals;

    return (
        <div className="vitals-dashboard" onClick={onViewHistory} style={{ cursor: 'pointer' }} title="Click to view history">
            <div className="dashboard-header">
                <h2>Vitals Dashboard</h2>
                <span className="history-hint">View History ⟳</span>
            </div>
            <div className="vitals-grid">
                <VitalCard
                    label="Heart Rate"
                    value={heartRate}
                    unit="bpm"
                />
                <VitalCard
                    label="SpO₂"
                    value={spo2}
                    unit="%"
                />
                <VitalCard
                    label="Temperature"
                    value={temperature}
                    unit="°C"
                />
            </div>
            <div className="last-updated">
                Last updated: {new Date(vitals.recordedAt).toLocaleString()}
            </div>
        </div>
    );
};

export default VitalsDashboard;
