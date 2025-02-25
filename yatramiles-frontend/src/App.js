import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Import Footer component
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ'; // Import FAQ page
import Register from './pages/Register';
import Login from './pages/Login';
import OwnerDashboard from './pages/OwnerDashboard';
import StaffDashboard from './pages/StaffDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import PackageDetails from './pages/PackageDetails';
import PrivateRoute from './components/PrivateRoute';
import ManagePackages from './pages/ManagePackages';
import ManageStaffPage from './pages/ManageStaffPage'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AllTransactionsPage from './pages/AllTransactionsPage';
import AllQueries from './pages/AllQueries';
import EditQueryPage from './pages/EditQueryPage';
import CreateTransactionPage from './pages/CreateTransactionPage';
import EditTransactionPage from './pages/EditTransactionPage';
import CustomerTransactions from './pages/CustomerTransactions';
import StaffTransactionsPage from './pages/StaffTransactionsPage';
import { UserProvider } from './context/UserContext'; 
import AllPackages from './pages/AllPackages'; 
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsAppButton";

const App = () => {
  return (
    <UserProvider>
      <Router>
      <ScrollToTop />
        <Navbar />
        <ToastContainer />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} /> {/* Add FAQ Route */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/packages" element={<AllPackages />} />
            
            <Route
              path="/customer-transactions"
              element={
                <PrivateRoute>
                  <CustomerTransactions />
                </PrivateRoute>
              }
            />
            <Route path="queries" element={<AllQueries />} />
            <Route path="/queries/edit/:id" element={<EditQueryPage />} />
            <Route path="/owner-transactions" element={<AllTransactionsPage />} />
            <Route path="/staff-transactions" element={<StaffTransactionsPage />} />
            <Route path="/transactions/new" element={<CreateTransactionPage />} />
            <Route path="/transactions/edit/:transactionId" element={<EditTransactionPage />} />
            <Route path="/packages/:id" element={<PackageDetails />} />
            <Route path="/contact" element={<Contact />} />
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
            <Route
            path="/manage-staff"
            element={
              <PrivateRoute>
                <ManageStaffPage />
              </PrivateRoute>
            }
          />
          </Routes>
        </div>
        <WhatsAppButton />
        <Footer /> {/* Add Footer component here */}
      </Router>
    </UserProvider>
  );
};

export default App;
