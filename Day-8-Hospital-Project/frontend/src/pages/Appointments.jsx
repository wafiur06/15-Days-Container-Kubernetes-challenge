import { useState, useEffect } from 'react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  
  const [form, setForm] = useState({ patient_name: '', doctor_name: '', date_time: '', status: 'Pending' });

  const fetchData = async () => {
    try {
      const apptRes = await fetch('http://localhost:8000/appointments/');
      setAppointments(await apptRes.json());
      const docRes = await fetch('http://localhost:8000/doctors/');
      setDoctors(await docRes.json());
      const patRes = await fetch('http://localhost:8000/patients/');
      setPatients(await patRes.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8000/appointments/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setForm({ patient_name: '', doctor_name: '', date_time: '', status: 'Pending' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '8px' }}>Appointments Management</h1>
          <p style={{ color: '#64748b', fontSize: '15px', fontWeight: '500' }}>Schedule and track patient appointments.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px' }}>
        
        {/* 3D Form Card */}
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)', padding: '24px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>Book Appointment</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <select value={form.patient_name} onChange={e => setForm({...form, patient_name: e.target.value})} required style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>
              <option value="" disabled>Select Patient</option>
              {patients.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
            <select value={form.doctor_name} onChange={e => setForm({...form, doctor_name: e.target.value})} required style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>
              <option value="" disabled>Select Doctor</option>
              {doctors.map(d => <option key={d.id} value={d.name}>{d.name} ({d.specialty})</option>)}
            </select>
            <input type="datetime-local" value={form.date_time} onChange={e => setForm({...form, date_time: e.target.value})} required style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '14px', color: '#0f172a', fontWeight: '500' }} />
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button type="submit" style={{ padding: '14px', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '8px', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)' }}>
              Book Appointment
            </button>
          </form>
        </div>

        {/* 3D Table Card */}
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>All Appointments</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ID</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date & Time</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Patient</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Doctor</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice().reverse().map((a, idx) => (
                <tr key={a.id} style={{ borderBottom: idx === appointments.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>#{a.id}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569', fontWeight: '500' }}>{a.date_time.replace('T', ' ')}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>{a.patient_name}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569', fontWeight: '500' }}>{a.doctor_name}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '6px 12px', borderRadius: '24px', fontSize: '12px', fontWeight: '600',
                      background: a.status === 'Completed' ? '#ecfdf5' : a.status === 'Pending' ? '#fffbeb' : '#fef2f2',
                      color: a.status === 'Completed' ? '#059669' : a.status === 'Pending' ? '#d97706' : '#dc2626'
                    }}>
                      {a.status}
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

export default Appointments;