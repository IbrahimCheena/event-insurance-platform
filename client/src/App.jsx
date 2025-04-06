import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { Shield, Calendar, Users, FileText, Settings, LogOut, Menu, X } from 'lucide-react';
import Login from "./pages/login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import QuoteForm from "./pages/QuoteForm";
import MyProfile from "./pages/MyProfile";
import AdminDashboard from "./pages/AdminDashboard";
import { auth } from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-pulse text-2xl text-indigo-600 font-semibold">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
        <Navbar user={user} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/quote" element={user ? <QuoteForm /> : <Navigate to="/login" replace />} />
            <Route path="/profile" element={user ? <MyProfile /> : <Navigate to="/login" replace />} />
            <Route path="/admin" element={user?.email === "admin@example.com" ? <AdminDashboard /> : <Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function Navbar({ user, isMenuOpen, setIsMenuOpen }) {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl sm:text-4xl font-extrabold text-slate-900">Event Insurance</span>
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center space-x-1 text-slate-600 hover:text-indigo-600 transition-colors">
                  <FileText className="h-4 w-4" /><span>Dashboard</span>
                </Link>
                <Link to="/quote" className="flex items-center space-x-1 text-slate-600 hover:text-indigo-600 transition-colors">
                  <Calendar className="h-4 w-4" /><span>Get Quote</span>
                </Link>
                <Link to="/profile" className="flex items-center space-x-1 text-slate-600 hover:text-indigo-600 transition-colors">
                  <Users className="h-4 w-4" /><span>Profile</span>
                </Link>
                {user.email === "admin@example.com" && (
                  <Link to="/admin" className="flex items-center space-x-1 text-indigo-600 font-semibold transition-colors">
                    <Settings className="h-4 w-4" /><span>Admin</span>
                  </Link>
                )}
                <button onClick={() => auth.signOut()} className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors">
                  <LogOut className="h-4 w-4" /><span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-150">Register</Link>
              </>
            )}
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t transition-all duration-300">
            <div className="flex flex-col space-y-4">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="px-4 text-slate-600 hover:text-indigo-600 transition-colors">Dashboard</Link>
                  <Link to="/quote" onClick={() => setIsMenuOpen(false)} className="px-4 text-slate-600 hover:text-indigo-600 transition-colors">Get Quote</Link>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="px-4 text-slate-600 hover:text-indigo-600 transition-colors">Profile</Link>
                  {user.email === "admin@example.com" && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="px-4 text-indigo-600 font-semibold transition-colors">Admin</Link>
                  )}
                  <button onClick={() => { auth.signOut(); setIsMenuOpen(false); }} className="px-4 text-left text-red-600 hover:text-red-700 transition-colors">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-4 text-slate-600 hover:text-indigo-600 transition-colors">Login</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="px-4 text-slate-600 hover:text-indigo-600 transition-colors">Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function Home() {
  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6">
          Protect Your Special Moments
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Get instant insurance coverage for any event. Whether it's a wedding, concert, or corporate gathering, we've got you covered.
        </p>
        <Link to="/quote" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transform hover:scale-105 transition duration-200">
          Get Your Quote Now
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 py-12">
        <FeatureCard
          icon={<Shield className="h-6 w-6 text-indigo-600" />}
          title="Comprehensive Coverage"
          description="Full protection for your events against cancellations, property damage, and liability claims."
        />
        <FeatureCard
          icon={<Calendar className="h-6 w-6 text-indigo-600" />}
          title="Instant Quotes"
          description="Get your insurance quote in minutes with our easy-to-use online platform."
        />
        <FeatureCard
          icon={<Users className="h-6 w-6 text-indigo-600" />}
          title="24/7 Support"
          description="Our dedicated team is always here to help you with any questions or concerns."
        />
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 my-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10">
          Trusted by Event Planners Nationwide
        </h2>
        <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
          <StatCard value="10K+" label="Events Insured" />
          <StatCard value="98%" label="Customer Satisfaction" />
          <StatCard value="24/7" label="Support Available" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div>
      <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">{value}</div>
      <div className="text-slate-600">{label}</div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Event Insurance</h2>
            <p className="text-slate-400">
              Protecting your special moments with comprehensive event insurance solutions.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/quote" className="hover:text-white transition-colors">Get Quote</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Login</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Email: contact@eventinsurance.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: 123 Insurance Ave</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Facebook</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} Event Insurance Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default App;
