import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Activity,
    BedDouble,
    AlertTriangle,
    BrainCircuit,
    FileText,
    LogOut,
    X // Close icon
} from 'lucide-react';
import clsx from 'clsx';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/predictive', icon: Activity, label: 'Predictive Analytics' },
        { to: '/resources', icon: BedDouble, label: 'Resources' },
        { to: '/alerts', icon: AlertTriangle, label: 'Alerts Center' },
        { to: '/insights', icon: BrainCircuit, label: 'AI Insights' },
        { to: '/reports', icon: FileText, label: 'Reports' },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-brand">
                        <Activity className="logo-icon" size={24} />
                        <h1>MediIntel.ai</h1>
                    </div>
                    <button className="close-btn mobile-only" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="nav-links">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => clsx('nav-item', { active: isActive })}
                            onClick={() => onClose()} // Close sidebar on navigate (mobile)
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="avatar">DS</div>
                        <div className="user-info">
                            <span className="user-name">Dr. Sharma</span>
                            <span className="user-role">Chief Medical Officer</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
