import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';

const Dashboard = () => {
  return (
    <div className="bg-background text-on-background font-body-md flex h-screen overflow-hidden antialiased selection:bg-primary-container selection:text-on-primary-container">
      <Sidebar />
      {/* Main content — offset by nav width */}
      <div className="flex-1 ml-16 md:ml-20 flex h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
