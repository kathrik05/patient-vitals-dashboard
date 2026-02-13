import React from 'react';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <h2>Patient Vitals Dashboard</h2>
            </div>

            <nav className="sidebar-nav">
                <a href="#" className="nav-item active">
                    <span className="icon">♥</span> Patients
                </a>
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="avatar">DR</div>
                    <div className="user-info">
                        <span className="name">Dr. House</span>
                        <span className="role">Admin</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
