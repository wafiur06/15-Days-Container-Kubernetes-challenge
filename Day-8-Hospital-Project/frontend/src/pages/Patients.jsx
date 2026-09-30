import { useState, useEffect } from 'react';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', department: 'General' });

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:8000/patients/');
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8000/patients/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setForm({ name: '', age: '', department: 'General' });
      fetchPatients();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '8px' }}>Patient Directory</h1>
          <p style={{ color: '#64748b', fontSize: '15px', fontWeight: '500' }}>Register and manage patient records efficiently.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px' }}>
        
        {/* 3D Form Card */}
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)', padding: '24px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>Register New Patient</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '14px', color: '#0f172a', fontWeight: '500' }} />
            <input type="number" placeholder="Age" value={form.age} onChange={e => setForm({...form, age: e.target.value})} required style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '14px', color: '#0f172a', fontWeight: '500' }} />
            <select value={form.department} onChange={e => setForm({...form, department: e.target.value})} style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>
              <option value="General">General</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
            </select>
            <button type="submit" style={{ padding: '14px', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '8px', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)' }}>
              Add Patient
            </button>
          </form>
        </div>

        {/* 3D Table Card */}
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>All Patients</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ID</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Age</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Department</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p, idx) => (
                <tr key={p.id} style={{ borderBottom: idx === patients.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>#{p.id}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>{p.name}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569', fontWeight: '500' }}>{p.age}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '6px 12px', background: '#eff6ff', color: '#2563eb', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{p.department}</span>
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

export default Patients;