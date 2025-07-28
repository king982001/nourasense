import React, { useState } from 'react';
import { SuccessModal } from './components/Modals';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ChildrenManagement from './components/ChildrenManagement';
import GrowthCharts from './components/GrowthCharts';
import QuickDiagnosis from './components/QuickDiagnosis';
import Referrals from './components/Referrals';
import Appointments from './components/Appointments';
import FindProviders from './components/FindProviders';
import Profile from './components/Profile';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [currentUserRole, setCurrentUserRole] = useState('doctor');
  const [childrenData, setChildrenData] = useState([
    {
      id: 1,
      name: 'Emma Thompson',
      dob: '2016-03-15',
      gender: 'female',
      bloodType: 'A+',
      allergies: 'Peanuts, Shellfish',
      notes: 'Regular checkups, no major health issues',
      measurements: [
        { date: '2024-01-15', height: 110, weight: 20, headCircumference: 52 },
        { date: '2024-02-15', height: 111, weight: 20.5, headCircumference: 52.2 },
        { date: '2024-03-15', height: 112, weight: 21, headCircumference: 52.4 }
      ]
    },
    {
      id: 2,
      name: 'James Rodriguez',
      dob: '2018-07-22',
      gender: 'male',
      bloodType: 'O+',
      allergies: 'None known',
      notes: 'Active child, plays soccer',
      measurements: [
        { date: '2024-01-10', height: 95, weight: 15, headCircumference: 50 },
        { date: '2024-02-10', height: 96, weight: 15.3, headCircumference: 50.1 },
        { date: '2024-03-10', height: 97, weight: 15.6, headCircumference: 50.2 }
      ]
    },
    {
      id: 3,
      name: 'Maya Patel',
      dob: '2020-11-08',
      gender: 'female',
      bloodType: 'B+',
      allergies: 'Dairy sensitivity',
      notes: 'Lactose intolerant, uses alternative milk',
      measurements: [
        { date: '2024-01-20', height: 85, weight: 12, headCircumference: 48 },
        { date: '2024-02-20', height: 86, weight: 12.2, headCircumference: 48.1 },
        { date: '2024-03-20', height: 87, weight: 12.5, headCircumference: 48.2 }
      ]
    }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const showModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalOpen(true);
  };

  const handleRoleSwitch = (role) => {
    setCurrentUserRole(role);
    showModal('Role Switched', `Switched to ${role} view successfully.`);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard currentUserRole={currentUserRole} childrenData={childrenData} onPageChange={setActivePage} />;
      case 'children':
        return <ChildrenManagement childrenData={childrenData} setChildrenData={setChildrenData} onShowModal={showModal} />;
      case 'growth-charts':
        return <GrowthCharts childrenData={childrenData} onShowModal={showModal} />;
      case 'quick-diagnosis':
        return <QuickDiagnosis childrenData={childrenData} onShowModal={showModal} />;
      case 'referrals':
        return <Referrals childrenData={childrenData} onShowModal={showModal} />;
      case 'appointments':
        return <Appointments onShowModal={showModal} />;
      case 'providers':
        return <FindProviders onShowModal={showModal} />;
      case 'profile':
        return <Profile onShowModal={showModal} />;
      default:
        return <Dashboard currentUserRole={currentUserRole} childrenData={childrenData} onPageChange={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header 
        currentUserRole={currentUserRole}
        onRoleSwitch={handleRoleSwitch}
        onPageChange={setActivePage}
        activePage={activePage}
      />
      
      {renderPage()}
      
      <SuccessModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
      />
    </div>
  );
}

export default App;
