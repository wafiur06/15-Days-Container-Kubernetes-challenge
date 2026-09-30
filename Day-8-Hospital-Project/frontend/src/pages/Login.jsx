import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('adminEmail', email);
    navigate('/');
  };

  return (
    <div style={{ 
      height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        padding: '48px 40px', 
        borderRadius: '24px', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.05)', 
        width: '100%', maxWidth: '420px',
        border: '1px solid rgba(255, 255, 255, 0.5)'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '64px', height: '64px', background: '#eff6ff', borderRadius: '16px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto',
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5), 0 4px 6px rgba(59, 130, 246, 0.1)'
          }}>
            <span style={{ fontSize: '32px' }}>🏥</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', letterSpacing: '-0.5px' }}>BD Smart Hospital</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '6px', fontWeight: '500' }}>Sign in to your admin workspace</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bdhospital.com" 
                required 
                style={{ 
                  width: '100%', padding: '12px 12px 12px 42px', border: '1px solid #e2e8f0', 
                  borderRadius: '12px', outline: 'none', fontSize: '14px', color: '#1e293b',
                  background: '#f8fafc', transition: 'all 0.2s ease'
                }} 
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Password</label>
              <a href="#" style={{ fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Forgot password?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
                style={{ 
                  width: '100%', padding: '12px 42px', border: '1px solid #e2e8f0', 
                  borderRadius: '12px', outline: 'none', fontSize: '14px', color: '#1e293b',
                  background: '#f8fafc', transition: 'all 0.2s ease'
                }} 
              />
              <div 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '12px', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
              </div>
            </div>
          </div>

          <button type="submit" style={{ 
            padding: '14px', background: 'linear-gradient(to right, #2563eb, #3b82f6)', 
            color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', 
            fontWeight: '600', cursor: 'pointer', marginTop: '8px',
            boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)', transition: 'all 0.2s ease'
          }}>
            Secure Sign In
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
          Secure Access Area • Authorized Personnel Only
        </div>
      </div>
    </div>
  );
};

export default Login;