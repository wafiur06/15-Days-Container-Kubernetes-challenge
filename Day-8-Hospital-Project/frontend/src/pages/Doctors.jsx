import { useState, useEffect } from 'react';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  const [form, setForm] = useState({ 
    name: '', specialty: '', phone: '', status: 'Active', 
    startDay: 'Monday', endDay: 'Friday', startTime: '10:00', endTime: '17:00',
    leave_date: '', return_date: ''
  });

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [activeDoctorForLeave, setActiveDoctorForLeave] = useState(null);
  const [modalLeaveDate, setModalLeaveDate] = useState('');
  const [modalReturnDate, setModalReturnDate] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchData = async () => {
    try {
      const docRes = await fetch('http://localhost:8000/doctors/');
      setDoctors(await docRes.json());
      const apptRes = await fetch('http://localhost:8000/appointments/');
      setAppointments(await apptRes.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const formatTime12h = (time24) => {
    if(!time24) return "";
    let [hours, minutes] = time24.split(':');
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const parseTime24h = (time12) => {
    if(!time12) return "";
    const [time, modifier] = time12.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const combinedDays = `${form.startDay} - ${form.endDay}`;
    const combinedTime = `${formatTime12h(form.startTime)} - ${formatTime12h(form.endTime)}`;
    
    const payload = {
      name: form.name, specialty: form.specialty, phone: form.phone,
      status: form.status, available_days: combinedDays, available_time: combinedTime,
      leave_date: form.status === 'On Leave' ? form.leave_date : '',
      return_date: form.status === 'On Leave' ? form.return_date : ''
    };

    try {
      if (editingId) {
        await fetch(`http://localhost:8000/doctors/${editingId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        setEditingId(null);
      } else {
        await fetch('http://localhost:8000/doctors/', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
      }
      setForm({ name: '', specialty: '', phone: '', status: 'Active', startDay: 'Monday', endDay: 'Friday', startTime: '10:00', endTime: '17:00', leave_date: '', return_date: '' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (doc) => {
    let st = '10:00', et = '17:00', sd = 'Monday', ed = 'Friday';
    if (doc.available_time && doc.available_time.includes(' - ')) {
       const timeParts = doc.available_time.split(' - ');
       st = parseTime24h(timeParts[0]); et = parseTime24h(timeParts[1]);
    }
    if (doc.available_days && doc.available_days.includes(' - ')) {
       const dayParts = doc.available_days.split(' - ');
       sd = dayParts[0].trim(); ed = dayParts[1].trim();
    }
    setForm({ 
      name: doc.name, specialty: doc.specialty, phone: doc.phone, status: doc.status, 
      startDay: sd, endDay: ed, startTime: st, endTime: et,
      leave_date: doc.leave_date || '', return_date: doc.return_date || ''
    });
    setEditingId(doc.id);
  };

  const handleStatusClick = (doc) => {
    if (doc.status === 'Active') {
      setActiveDoctorForLeave(doc);
      setModalLeaveDate('');
      setModalReturnDate('');
      setShowLeaveModal(true);
    } else {
      toggleStatus(doc.id, 'Active');
    }
  };

  const toggleStatus = async (id, newStatus, leaveData = null) => {
    try {
        await fetch(`http://localhost:8000/doctors/${id}/status?status=${newStatus}`, { method: 'PUT' });
        if (leaveData) {
            const currentDoc = doctors.find(d => d.id === id);
            if(currentDoc) {
                 const payload = { ...currentDoc, status: newStatus, leave_date: leaveData.leave_date, return_date: leaveData.return_date };
                await fetch(`http://localhost:8000/doctors/${id}`, {
                    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
                });
            }
        }
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleModalSubmit = (e) => {
      e.preventDefault();
      toggleStatus(activeDoctorForLeave.id, 'On Leave', { leave_date: modalLeaveDate, return_date: modalReturnDate });
      setShowLeaveModal(false);
      setActiveDoctorForLeave(null);
  };

  const completeNextPatient = async (appointmentId) => {
    try {
      await fetch(`http://localhost:8000/appointments/${appointmentId}/status?status=Completed`, { method: 'PUT' });
      fetchData();
    } catch(e) { console.error(e); }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px', position: 'relative' }}>
      
      {/* 3D Glassmorphism Leave Modal */}
      {showLeaveModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '420px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                  <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Set Leave for {activeDoctorForLeave?.name}</h3>
                  <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                     <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '13px', color: '#334155', marginBottom: '8px', display: 'block', fontWeight: '600' }}>Start Date</label>
                          <input type="date" value={modalLeaveDate} onChange={e => setModalLeaveDate(e.target.value)} required style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', color: '#0f172a', fontWeight: '500' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '13px', color: '#334155', marginBottom: '8px', display: 'block', fontWeight: '600' }}>Expected Return</label>
                          <input type="date" value={modalReturnDate} onChange={e => setModalReturnDate(e.target.value)} required style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', color: '#0f172a', fontWeight: '500' }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                          <button type="button" onClick={() => setShowLeaveModal(false)} style={{ padding: '12px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }}>Cancel</button>
                          <button type="submit" style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 14px 0 rgba(59,130,246,0.39)' }}>Confirm Leave</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '8px' }}>Medical Staff</h1>
          <p style={{ color: '#64748b', fontSize: '15px', fontWeight: '500' }}>Manage doctor profiles, schedules, and leave status.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px' }}>
        
        {/* 3D Form Card */}
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)', padding: '24px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
            {editingId ? 'Edit Doctor Profile' : 'Add New Doctor'}
            {editingId && <button onClick={() => { setEditingId(null); setForm({ name: '', specialty: '', phone: '', status: 'Active', startDay: 'Monday', endDay: 'Friday', startTime: '10:00', endTime: '17:00', leave_date: '', return_date: '' }); }} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Cancel</button>}
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="text" placeholder="Dr. Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '14px', color: '#0f172a', fontWeight: '500' }} />
            <input type="text" placeholder="Specialty (e.g. Cardiology)" value={form.specialty} onChange={e => setForm({...form, specialty: e.target.value})} required style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '14px', color: '#0f172a', fontWeight: '500' }} />
            <input type="text" placeholder="Phone Number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '14px', color: '#0f172a', fontWeight: '500' }} />
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', display: 'block', fontWeight: '600' }}>Start Day</label>
                <select value={form.startDay} onChange={e => setForm({...form, startDay: e.target.value})} style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>
                  {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>
              <span style={{ color: '#94a3b8', fontWeight: '600', marginTop: '20px', fontSize: '12px' }}>TO</span>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', display: 'block', fontWeight: '600' }}>End Day</label>
                <select value={form.endDay} onChange={e => setForm({...form, endDay: e.target.value})} style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>
                  {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', display: 'block', fontWeight: '600' }}>Start Time</label>
                <input type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} required style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '14px', color: '#0f172a', fontWeight: '500' }} />
              </div>
              <span style={{ color: '#94a3b8', fontWeight: '600', marginTop: '20px', fontSize: '12px' }}>TO</span>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', display: 'block', fontWeight: '600' }}>End Time</label>
                <input type="time" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} required style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '14px', color: '#0f172a', fontWeight: '500' }} />
              </div>
            </div>

            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
            </select>

            {form.status === 'On Leave' && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#fffbeb', padding: '16px', borderRadius: '16px', border: '1px solid #fef3c7' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#b45309', marginBottom: '6px', display: 'block', fontWeight: '700' }}>Leave Start</label>
                  <input type="date" value={form.leave_date} onChange={e => setForm({...form, leave_date: e.target.value})} required style={{ width: '100%', padding: '10px', background: 'white', border: '1px solid #fde68a', borderRadius: '8px', outline: 'none', fontSize: '13px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#b45309', marginBottom: '6px', display: 'block', fontWeight: '700' }}>Return Date</label>
                  <input type="date" value={form.return_date} onChange={e => setForm({...form, return_date: e.target.value})} required style={{ width: '100%', padding: '10px', background: 'white', border: '1px solid #fde68a', borderRadius: '8px', outline: 'none', fontSize: '13px' }} />
                </div>
              </div>
            )}
            
            <button type="submit" style={{ padding: '14px', background: editingId ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #2563eb, #3b82f6)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '8px', boxShadow: editingId ? '0 4px 14px 0 rgba(16, 185, 129, 0.39)' : '0 4px 14px 0 rgba(59, 130, 246, 0.39)' }}>
              {editingId ? 'Save Changes' : 'Register Doctor'}
            </button>
          </form>
        </div>

        {/* 3D Table Card */}
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>Staff Directory</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Doctor Name</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Schedule</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Queue</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d, idx) => {
                const pendingAppts = appointments.filter(a => a.doctor_name === d.name && a.status === 'Pending').sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
                const count = pendingAppts.length;
                const nextPatient = count > 0 ? pendingAppts[0] : null;

                return (
                  <tr key={d.id} style={{ borderBottom: idx === doctors.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                    <td style={{ padding: '20px 24px', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>
                      {d.name}<br/>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginTop: '4px', display: 'inline-block' }}>{d.specialty} | {d.phone}</span>
                    </td>
                    <td style={{ padding: '20px 24px', fontSize: '13px', color: '#475569', fontWeight: '500' }}>
                      <strong style={{ color: '#0f172a' }}>{d.available_days}</strong><br/>
                      <span style={{ color: '#64748b', marginTop: '2px', display: 'inline-block' }}>{d.available_time}</span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span onClick={() => handleStatusClick(d)} style={{ cursor: 'pointer', padding: '6px 12px', borderRadius: '24px', fontSize: '12px', fontWeight: '700', background: d.status === 'Active' ? '#ecfdf5' : '#fffbeb', color: d.status === 'Active' ? '#059669' : '#d97706', border: d.status === 'Active' ? '1px solid #a7f3d0' : '1px solid #fde68a' }}>
                        {d.status} 
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      {count > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '600' }}><span style={{ color: '#3b82f6', fontWeight: '800' }}>Serving:</span> {nextPatient.patient_name}</div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: '#fef2f2', color: '#dc2626', padding: '4px 10px', borderRadius: '16px', fontSize: '11px', fontWeight: '700' }}>+{count - 1} Waiting</span>
                            <button onClick={() => completeNextPatient(nextPatient.id)} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)' }}>✔️ Done</button>
                          </div>

                          {count > 1 && (
                            <div style={{ marginTop: '4px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Next in line:</div>
                              <div style={{ fontSize: '12px', color: '#334155', fontWeight: '600' }}>
                                <strong style={{ color: '#94a3b8', marginRight: '6px' }}>#2</strong> {pendingAppts[1].patient_name}
                              </div>
                            </div>
                          )}

                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500', fontStyle: 'italic' }}>Queue Clear</span>
                      )}
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <button onClick={() => handleEdit(d)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>Edit</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Doctors;