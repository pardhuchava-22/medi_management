import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Get page title from route
    const getPageTitle = (pathname) => {
        switch (pathname) {
            case '/': return 'Hospital Operations Center';
            case '/predictive': return 'Predictive Analytics';
            case '/resources': return 'Resource Optimization';
            case '/alerts': return 'Alerts & Crisis Center';
            case '/insights': return 'AI Insights';
            case '/reports': return 'Report Generation';
            default: return 'Dashboard';
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="app-layout">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="main-content">
                <Header
                    title={getPageTitle(location.pathname)}
                    onMenuToggle={toggleSidebar}
                />
                <main className="page-container">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
