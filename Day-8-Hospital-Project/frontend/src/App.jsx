import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications'; // Add this line
import { Building, Mail, Globe, Save } from 'lucide-react';

const Settings = () => (
  <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '8px' }}>System Settings</h1>
        <p style={{ color: '#64748b', fontSize: '15px', fontWeight: '500' }}>Manage your application preferences and hospital details.</p>
      </div>
    </div>
    
    <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)', padding: '32px' }}>
      <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Hospital Information</h3>
        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px', fontWeight: '500' }}>Update your hospital's details and contact information.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Hospital Name</label>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}>
            <Building size={18} color="#94a3b8" style={{ marginRight: '12px' }} />
            <input type="text" defaultValue="BD Smart Hospital" style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', width: '100%', color: '#0f172a', fontWeight: '500' }} />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Contact Email</label>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}>
            <Mail size={18} color="#94a3b8" style={{ marginRight: '12px' }} />
            <input type="email" defaultValue="contact@bdhospital.com" style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', width: '100%', color: '#0f172a', fontWeight: '500' }} />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Website URL</label>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}>
            <Globe size={18} color="#94a3b8" style={{ marginRight: '12px' }} />
            <input type="text" defaultValue="https://bdsmarthospital.com" style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', width: '100%', color: '#0f172a', fontWeight: '500' }} />
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)' }}>
          <Save size={18} /> Save Settings
        </button>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} /> {/* Add this line */}
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;