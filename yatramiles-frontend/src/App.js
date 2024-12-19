import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import OwnerDashboard from './pages/OwnerDashboard';
import StaffDashboard from './pages/StaffDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import PrivateRoute from './components/PrivateRoute';
import ManagePackages from './pages/ManagePackages';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OwnerTransactions from './pages/OwnerTransactions';
import CustomerTransactions from './pages/CustomerTransactions';
import StaffTransactions from './pages/StaffTransactions';



const App = () => {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/owner-transactions"
            element={
              <PrivateRoute>
                <OwnerTransactions />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer-transactions"
            element={
              <PrivateRoute>
                <CustomerTransactions />
              </PrivateRoute>
            }
          />
          <Route
            path="/staff-transactions"
            element={
              <PrivateRoute>
                <StaffTransactions />
              </PrivateRoute>
            }
          />
          <Route
            path="/owner-dashboard"
            element={
              <PrivateRoute>
                <OwnerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/staff-dashboard"
            element={
              <PrivateRoute>
                <StaffDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer-dashboard"
            element={
              <PrivateRoute>
                <CustomerDashboard />
              </PrivateRoute>
            }
          />                    
          <Route
            path="/manage-packages"
            element={
              <PrivateRoute>
                <ManagePackages />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
