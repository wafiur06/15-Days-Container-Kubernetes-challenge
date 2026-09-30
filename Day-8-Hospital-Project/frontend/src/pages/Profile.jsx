import { useState } from 'react';
import { User, Mail, Shield, Phone, Building } from 'lucide-react';

const Profile = () => {
  const savedEmail = localStorage.getItem('adminEmail') || 'admin@bdhospital.com';
  const displayInitial = savedEmail.charAt(0).toUpperCase();

  const [profile] = useState({
    name: savedEmail, 
    email: savedEmail,
    phone: '+880 1711-000000',
    role: 'Admin',
    hospital: 'BD Smart Hospital, Dhaka'
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '8px' }}>My Profile</h1>
          <p style={{ color: '#64748b', fontSize: '15px', fontWeight: '500' }}>Manage your personal account settings.</p>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* Profile Summary 3D Card */}
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)', padding: '32px', textAlign: 'center', height: 'fit-content' }}>
          <div style={{ width: '96px', height: '96px', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '40px', color: 'white', margin: '0 auto 20px auto', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)' }}>
            {displayInitial}
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', wordBreak: 'break-all', marginBottom: '4px' }}>{profile.name}</h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px', fontWeight: '500' }}>{profile.role}</p>
          <span style={{ background: '#ecfdf5', color: '#059669', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', boxShadow: '0 2px 4px rgba(5, 150, 105, 0.1)' }}>Active Account</span>
        </div>

        {/* Profile Details Form 3D Card */}
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)', padding: '32px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '24px' }}>Personal Information</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Full Name</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}>
                <User size={18} color="#94a3b8" style={{ marginRight: '12px', minWidth: '18px' }} />
                <span style={{ fontSize: '14px', color: '#475569', wordBreak: 'break-all', fontWeight: '500' }}>{profile.name}</span>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Email Address</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}>
                <Mail size={18} color="#94a3b8" style={{ marginRight: '12px', minWidth: '18px' }} />
                <span style={{ fontSize: '14px', color: '#475569', wordBreak: 'break-all', fontWeight: '500' }}>{profile.email}</span>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Phone Number</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px 16px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                <Phone size={18} color="#94a3b8" style={{ marginRight: '12px', minWidth: '18px' }} />
                <input type="text" defaultValue={profile.phone} style={{ border: 'none', outline: 'none', fontSize: '14px', color: '#0f172a', width: '100%', fontWeight: '500' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Organization</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}>
                <Building size={18} color="#94a3b8" style={{ marginRight: '12px', minWidth: '18px' }} />
                <span style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>{profile.hospital}</span>
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '24px' }}>Security Settings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>New Password</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px 16px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                <Shield size={18} color="#94a3b8" style={{ marginRight: '12px', minWidth: '18px' }} />
                <input type="password" placeholder="Leave blank to keep current" style={{ border: 'none', outline: 'none', fontSize: '14px', width: '100%', fontWeight: '500' }} />
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
            <button style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)' }}>
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;