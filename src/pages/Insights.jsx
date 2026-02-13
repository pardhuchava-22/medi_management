import React, { useState } from 'react';
import { Send, User, Bot, HelpCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import './Insights.css';

const Insights = () => {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello Dr. Sharma. I can explain the current forecasts or help you explore specific scenarios. What would you like to know?' }
    ]);

    const handleSend = () => {
        if (!query.trim()) return;
        setMessages([...messages, { role: 'user', content: query }]);
        setQuery('');
        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Based on historical data and current viral trends, I predict a 15% increase in respiratory cases over the next 48 hours relative to baseline.' }]);
        }, 1000);
    };

    return (
        <div className="insights-container">
            <div className="explanation-panel">
                <div className="panel-header">
                    <h2>Forecast Explanation</h2>
                    <span className="subtitle">Ward C Overflow Prediction</span>
                </div>

                <div className="factor-list">
                    <div className="factor-item">
                        <h4>Contributing Factors</h4>
                        <ul>
                            <li><strong>Seasonal Trend:</strong> Historical data indicates spike in trauma cases post-festival.</li>
                            <li><strong>Weather:</strong> Temperature drop (12°C) correlates with respiratory admissions.</li>
                            <li><strong>Public Event:</strong> Local marathon scheduled for Sunday.</li>
                        </ul>
                    </div>

                    <div className="confidence-metrics">
                        <div className="metric">
                            <span className="label">Model Confidence</span>
                            <span className="value high">92%</span>
                        </div>
                        <div className="metric">
                            <span className="label">Data Quality</span>
                            <span className="value medium">Good</span>
                        </div>
                    </div>

                    <div className="recommendation-box">
                        <h4>AI Recommendation</h4>
                        <p>Activate "Level 2" surge protocols for ER triage. Increase nursing staff by 20% for the weekend shift.</p>
                        <div className="feedback-actions">
                            <span>Was this helpful?</span>
                            <button className="icon-btn-sm"><ThumbsUp size={16} /></button>
                            <button className="icon-btn-sm"><ThumbsDown size={16} /></button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="chat-interface">
                <div className="chat-header">
                    <Bot size={20} className="bot-icon" />
                    <h3>AI Assistant</h3>
                </div>

                <div className="messages-area">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.role}`}>
                            <div className="avatar">
                                {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                            </div>
                            <div className="bubble">
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="input-area">
                    <button className="help-btn" title="Suggested Questions"><HelpCircle size={18} /></button>
                    <input
                        type="text"
                        placeholder="Ask a question..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button className="send-btn" onClick={handleSend} disabled={!query.trim()}>
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Insights;
