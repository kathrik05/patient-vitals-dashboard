import React from 'react';

const VitalCard = ({ label, value, unit, status }) => {
    // Parsing value to float to ensure correct comparison
    const numValue = parseFloat(value);
    let isAbnormal = false;

    if (label === 'Heart Rate') {
        isAbnormal = numValue < 60 || numValue > 100;
    } else if (label === 'SpO₂') {
        isAbnormal = numValue < 95;
    } else if (label === 'Temperature') {
        isAbnormal = numValue > 37.5;
    }

    // Fallback if status prop is explicitly passed
    if (status === 'abnormal') isAbnormal = true;

    return (
        <div className={`vital-card ${isAbnormal ? 'abnormal' : 'normal'}`}>
            <div className="vital-label">{label}</div>
            <div className="vital-value">
                {value} <span className="vital-unit">{unit}</span>
            </div>
            <div className="vital-status">
                {isAbnormal ? '⚠️ Abnormal' : 'Normal'}
            </div>
        </div>
    );
};

export default VitalCard;
