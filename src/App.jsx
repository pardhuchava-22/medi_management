import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';

import PredictiveAnalytics from './pages/PredictiveAnalytics';
import NafldDiagnosis from './pages/NafldDiagnosis';
import Resources from './pages/Resources';
import Alerts from './pages/Alerts';
import Insights from './pages/Insights';
import Reports from './pages/Reports';
import Login from './pages/Login';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="nafld" element={<NafldDiagnosis />} />
                    <Route path="predictive" element={<PredictiveAnalytics />} />
                    <Route path="resources" element={<Resources />} />
                    <Route path="alerts" element={<Alerts />} />
                    <Route path="insights" element={<Insights />} />
                    <Route path="reports" element={<Reports />} />
                </Route>
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
