import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Import Footer component
import Home from './pages/Home';
import About from './pages/About';
import FAQ from './pages/FAQ'; // Import FAQ page
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
import { UserProvider } from './context/UserContext'; // Wrap the app

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <ToastContainer />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} /> {/* Add FAQ Route */}
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
        <Footer /> {/* Add Footer component here */}
      </Router>
    </UserProvider>
  );
};

export default App;
