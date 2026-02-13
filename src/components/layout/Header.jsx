import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react'; // Added Menu icon
import './Header.css';

const Header = ({ title, onMenuToggle }) => {
    return (
        <header className="header">
            <div className="header-left">
                <button className="menu-btn mobile-only" onClick={onMenuToggle}>
                    <Menu size={24} />
                </button>
                <div>
                    <h2 className="header-title">{title}</h2>
                    <span className="header-date">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
            </div>

            <div className="header-actions">
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search patients, reports..." />
                </div>

                <button className="icon-btn">
                    <Bell size={20} />
                    <span className="badge">3</span>
                </button>

                <div className="user-profile">
                    <div className="avatar">
                        <User size={20} />
                    </div>
                    <div className="user-info">
                        <span className="user-name">Dr. Sharma</span>
                        <span className="user-role">Administrator</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
