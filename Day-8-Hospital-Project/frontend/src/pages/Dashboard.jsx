import { useState, useEffect } from 'react';
import { Calendar, RefreshCcw, CheckCircle, Clock, XCircle, Activity, Users, Stethoscope } from 'lucide-react';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const savedEmail = localStorage.getItem('adminEmail') || 'Admin';
  const firstName = savedEmail.split('@')[0];

  const fetchData = async () => {
    setLoading(true);
    try {
      const pRes = await fetch('http://localhost:8000/patients/');
      setPatients(await pRes.json());
      const dRes = await fetch('http://localhost:8000/doctors/');
      setDoctors(await dRes.json());
      const aRes = await fetch('http://localhost:8000/appointments/');
      setAppointments(await aRes.json());
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalPatients = patients.length;
  const activeDoctors = doctors.filter(d => d.status === 'Active').length;
  const onLeaveDoctorsList = doctors.filter(d => d.status === 'On Leave');
  const onLeaveDoctors = onLeaveDoctorsList.length;
  const totalAppointments = appointments.length;
  
  const pendingAppts = appointments.filter(a => a.status === 'Pending').length;
  const completedAppts = appointments.filter(a => a.status === 'Completed').length;
  const cancelledAppts = appointments.filter(a => a.status === 'Cancelled').length;

  const recentAppointments = [...appointments].reverse().slice(0, 5);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Premium Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            Welcome back, {firstName.charAt(0).toUpperCase() + firstName.slice(1)} 👋
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px', fontWeight: '500' }}>Here is what's happening in your hospital today.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#334155', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <Calendar size={16} color="#64748b" /> Last 30 days
          </button>
          <button 
            onClick={fetchData} 
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#1e293b', border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600', color: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', opacity: loading ? 0.8 : 1 }}
          >
            <RefreshCcw size={16} style={{ transform: loading ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.5s ease' }} /> 
            {loading ? 'Syncing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {/* Top Primary Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        
        {[
          { title: 'Total Patients', value: totalPatients, icon: Users, color: '#3b82f6', bg: '#eff6ff' },
          { title: 'Active Doctors', value: activeDoctors, icon: Stethoscope, color: '#10b981', bg: '#ecfdf5' },
          { title: 'Appointments', value: totalAppointments, icon: Calendar, color: '#8b5cf6', bg: '#f5f3ff' },
          { title: 'Pending Queue', value: pendingAppts, icon: Clock, color: '#f59e0b', bg: '#fffbeb' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.03), 0 4px 6px -2px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>{stat.title}</div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px' }}>{stat.value}</div>
              </div>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={28} color={stat.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {[
          { title: 'Pending Today', count: pendingAppts, icon: Clock, color: '#f59e0b' },
          { title: 'Completed Appts', count: completedAppts, icon: CheckCircle, color: '#10b981' },
          { title: 'Doctors On Leave', count: onLeaveDoctors, icon: Activity, color: '#8b5cf6' },
          { title: 'Cancelled', count: cancelledAppts, icon: XCircle, color: '#ef4444' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} style={{ background: 'white', padding: '20px 24px', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>{stat.title}</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{stat.count}</div>
              </div>
              <Icon size={24} color={stat.color} opacity={0.8} />
            </div>
          );
        })}
      </div>

      {/* Bottom Section: Appointments & Leave Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Recent Appointments Table */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>Recent Appointments</h3>
            <button onClick={fetchData} style={{ padding: '6px 14px', fontSize: '13px', fontWeight: '600', color: '#3b82f6', background: '#eff6ff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>View All</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ID #</th>
                <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Patient Name</th>
                <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Doctor</th>
                <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontWeight: '500' }}>No recent appointments found.</td></tr>
              ) : null}
              {recentAppointments.map((appt, index) => (
                <tr key={appt.id} style={{ borderBottom: index === recentAppointments.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>#{appt.id}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>{appt.patient_name}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569', fontWeight: '500' }}>{appt.doctor_name}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '6px 12px', borderRadius: '24px', fontSize: '12px', fontWeight: '600',
                      background: appt.status === 'Completed' ? '#ecfdf5' : appt.status === 'Pending' ? '#fffbeb' : '#fef2f2',
                      color: appt.status === 'Completed' ? '#059669' : appt.status === 'Pending' ? '#d97706' : '#dc2626'
                    }}>
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Doctors On Leave Table */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.03)', overflow: 'hidden', height: 'fit-content' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#fffbeb' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#d97706' }}>Doctors On Leave</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Doctor Info</th>
                <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Return Date</th>
              </tr>
            </thead>
            <tbody>
              {onLeaveDoctorsList.length === 0 ? (
                <tr><td colSpan="2" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>No doctors currently on leave.</td></tr>
              ) : null}
              {onLeaveDoctorsList.map((doc, index) => (
                <tr key={doc.id} style={{ borderBottom: index === onLeaveDoctorsList.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>
                    {doc.name}
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginTop: '2px' }}>{doc.specialty}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '6px 12px', borderRadius: '24px', fontSize: '12px', fontWeight: '600',
                      background: '#f1f5f9', color: '#475569'
                    }}>
                      {doc.return_date ? doc.return_date : 'TBD'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;