import React from 'react';
import { FileText, Clock, Download, Plus } from 'lucide-react';
import './Reports.css';

const TEMPLATES = [
    { id: 1, title: 'Daily Operations', desc: 'Summary of current day metrics including patient flow, admissions, and discharges.', icon: FileText, color: 'blue' },
    { id: 2, title: 'Monthly Performance', desc: 'Comprehensive analysis of departmental KPIs, revenue cycle, and staff efficiency.', icon: FileText, color: 'purple' },
    { id: 3, title: 'Capacity Planning', desc: 'Bed & resource utilization forecast based on historical admission trends.', icon: FileText, color: 'green' },
    { id: 4, title: 'Financial Audit', desc: 'Detailed breakdown of billing, insurance claims status, and outstanding payments.', icon: FileText, color: 'orange' },
];

const HISTORY = [
    { id: 101, name: 'Monthly Performance (Oct)', date: '2 hours ago', generatedBy: 'Dr. A. Sharma' },
    { id: 102, name: 'Daily Operations Review', date: 'Yesterday, 6:00 PM', generatedBy: 'Admin' },
    { id: 103, name: 'ICU Capacity Report', date: 'Oct 24, 2025', generatedBy: 'System' },
];

const Reports = () => {
    return (
        <div className="reports-container">
            <div className="section-header">
                <h2>Choose a Report Template</h2>
                <button className="btn-primary"><Plus size={18} /> New Template</button>
            </div>

            <div className="templates-grid">
                {TEMPLATES.map(template => (
                    <div key={template.id} className="template-card">
                        <div className={`template-icon ${template.color}`}>
                            <template.icon size={24} />
                        </div>
                        <h3>{template.title}</h3>
                        <p>{template.desc}</p>
                        <button className="generate-btn">Generate Report</button>
                    </div>
                ))}
            </div>

            <div className="history-section">
                <div className="section-header">
                    <h2>Generation History</h2>
                </div>
                <div className="history-list">
                    {HISTORY.map(item => (
                        <div key={item.id} className="history-item">
                            <div className="history-info">
                                <FileText size={20} className="history-icon" />
                                <div>
                                    <span className="history-name">{item.name}</span>
                                    <div className="history-meta">
                                        <span className="history-by">by {item.generatedBy}</span>
                                        <span className="history-date"><Clock size={12} /> {item.date}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="download-btn"><Download size={18} /></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reports;
