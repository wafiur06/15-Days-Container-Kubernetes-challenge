import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays, ClipboardList, Settings, Bell, Search, User, LogOut } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const savedEmail = localStorage.getItem('adminEmail') || 'admin@bdhospital.com';
  const displayInitial = savedEmail.charAt(0).toUpperCase();

  const fetchDoctors = async () => {
    try {
      const res = await fetch('http://localhost:8000/doctors/');
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error("Search fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [location]);

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotification(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Appointments', path: '/appointments', icon: CalendarDays },
    { name: 'Patients', path: '/patients', icon: Users },
    { name: 'Doctors', path: '/doctors', icon: ClipboardList },
  ];

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSettingsActive = path === '/settings';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      
      <header style={{ height: '64px', background: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0, zIndex: 50 }}>
        
        <Link to="/" style={{ color: 'white', fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span style={{ fontSize: '24px' }}>🏥</span> BD Smart Hospital
        </Link>
        
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#2d2d2d', borderRadius: '6px', padding: '6px 12px', width: '400px' }}>
            <Search size={18} color="#9ca3af" />
            <input 
              type="text" 
              placeholder="Search doctor by name..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(e.target.value.length > 0);
              }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              onFocus={() => { 
                fetchDoctors(); 
                if(searchQuery.length > 0) setShowDropdown(true); 
              }}
              style={{ background: 'transparent', border: 'none', color: 'white', marginLeft: '10px', width: '100%', outline: 'none' }} 
            />
          </div>

          {showDropdown && (
            <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: '#ffffff', borderRadius: '8px', marginTop: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', overflow: 'hidden', zIndex: 1000, border: '1px solid #e5e7eb' }}>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map(d => (
                  <div key={d.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <div>
                      <div style={{ color: '#111827', fontWeight: '600', fontSize: '14px' }}>{d.name}</div>
                      <div style={{ color: '#6b7280', fontSize: '12px' }}>{d.specialty}</div>
                    </div>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                      background: d.status === 'Active' ? '#dcfce7' : '#fef08a', 
                      color: d.status === 'Active' ? '#166534' : '#854d0e' 
                    }}>
                      {d.status === 'Active' ? 'Available' : 'On Leave'}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '16px', color: '#6b7280', textAlign: 'center', fontSize: '14px' }}>
                  No doctors found
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: 'white' }}>
          
          {/* Notification Menu */}
<div style={{ position: 'relative' }} ref={notificationRef}>
  <div onClick={() => setShowNotification(!showNotification)} style={{ cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}>
    <Bell size={20} style={{ opacity: '0.8' }} />
    <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', width: '8px', height: '8px', borderRadius: '50%' }}></span>
  </div>
  
  {showNotification && (
    <div style={{ position: 'absolute', top: '100%', right: '-10px', marginTop: '16px', width: '320px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)', overflow: 'hidden', zIndex: 1000, border: '1px solid #e5e7eb' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>Notifications</div>
      
      <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '600' }}>New Appointment Booked</div>
        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>A new patient has been added to Dr. Hasan's queue.</div>
        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px', fontWeight: '600' }}>2 mins ago</div>
      </div>
      
      <div style={{ padding: '16px' }}>
        <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '600' }}>System Update</div>
        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>Hospital Management System updated to v2.0</div>
        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px', fontWeight: '600' }}>1 hour ago</div>
      </div>
      
      <Link 
        to="/notifications" 
        onClick={() => setShowNotification(false)}
        style={{ display: 'block', padding: '14px', textAlign: 'center', fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: '700', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}
      >
        View All Notifications
      </Link>
    </div>
  )}
</div>
          
          {/* Admin Profile with Dropdown */}
          <div style={{ position: 'relative' }} ref={profileRef}>
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#2d2d2d', padding: '4px 12px', borderRadius: '20px', cursor: 'pointer', transition: 'background 0.2s' }}
            >
              <div style={{ width: '28px', height: '28px', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                {displayInitial}
              </div>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{savedEmail.split('@')[0]}</span>
            </div>

            {showProfileMenu && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '12px', width: '180px', background: '#ffffff', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', overflow: 'hidden', zIndex: 1000, border: '1px solid #e5e7eb' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', background: '#f9fafb' }}>
                  <div style={{ fontSize: '13px', color: '#111827', fontWeight: '600', wordBreak: 'break-all' }}>{savedEmail}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Admin</div>
                </div>
                <Link to="/profile" onClick={() => setShowProfileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: '#374151', textDecoration: 'none', fontSize: '13px', fontWeight: '500', borderBottom: '1px solid #f1f5f9' }}>
                  <User size={16} /> My Profile
                </Link>
                <Link to="/login" onClick={() => setShowProfileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: '#ef4444', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>
                  <LogOut size={16} /> Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside style={{ width: '250px', background: '#f9fafb', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', padding: '16px 12px' }}>
          <nav style={{ flex: 1 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = path === item.path;
              return (
                <Link key={item.name} to={item.path} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '8px', color: isActive ? '#111827' : '#4b5563', background: isActive ? '#ffffff' : 'transparent', boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', textDecoration: 'none', marginBottom: '8px', fontWeight: isActive ? '600' : '500', transition: 'all 0.2s' }}>
                  <Icon size={20} color={isActive ? '#3b82f6' : '#6b7280'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
            <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '8px', color: isSettingsActive ? '#111827' : '#4b5563', background: isSettingsActive ? '#ffffff' : 'transparent', boxShadow: isSettingsActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', textDecoration: 'none', fontWeight: isSettingsActive ? '600' : '500', transition: 'all 0.2s' }}>
              <Settings size={20} color={isSettingsActive ? '#3b82f6' : '#6b7280'} /> Settings
            </Link>
          </div>
        </aside>

        <main style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#f3f4f6' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;