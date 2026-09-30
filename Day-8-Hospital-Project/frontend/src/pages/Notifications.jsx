import { Calendar, Settings, AlertCircle, CheckCircle } from 'lucide-react';

const Notifications = () => {
  // Dummy notifications data
  const notifications = [
    { id: 1, type: 'appointment', title: 'New Appointment Booked', desc: "A new patient has been added to Dr. Hasan's queue.", time: '2 mins ago', icon: Calendar, color: '#3b82f6', bg: '#eff6ff' },
    { id: 2, type: 'system', title: 'System Update', desc: 'Hospital Management System updated to v2.0', time: '1 hour ago', icon: Settings, color: '#8b5cf6', bg: '#f5f3ff' },
    { id: 3, type: 'alert', title: 'High Queue Alert', desc: "Dr. Sagor's queue has exceeded 10 patients.", time: '3 hours ago', icon: AlertCircle, color: '#ef4444', bg: '#fef2f2' },
    { id: 4, type: 'success', title: 'Daily Backup Complete', desc: 'All patient records have been securely backed up.', time: '1 day ago', icon: CheckCircle, color: '#10b981', bg: '#ecfdf5' },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '8px' }}>Notifications</h1>
          <p style={{ color: '#64748b', fontSize: '15px', fontWeight: '500' }}>Stay updated with your hospital's latest activities.</p>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)', padding: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {notifications.map(n => {
            const Icon = n.icon;
            return (
              <div key={n.id} style={{ 
                display: 'flex', alignItems: 'flex-start', gap: '20px', padding: '24px', 
                background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', 
                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5), 0 4px 6px -1px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease', cursor: 'pointer'
              }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: n.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <Icon size={28} color={n.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{n.title}</h4>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#475569', margin: 0, fontWeight: '500' }}>{n.desc}</p>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default Notifications;