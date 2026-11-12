import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Departments from "./pages/public/Departments";
import HowItWorks from "./pages/public/HowItWorks";
import Contact from "./pages/public/Contact";
import FAQ from "./pages/public/FAQ";

import Login from "./pages/citizen/Login";
import Register from "./pages/citizen/Register";
import Dashboard from "./pages/citizen/Dashboard";
import SubmitGrievance from "./pages/citizen/SubmitGrievance";
import TrackGrievance from "./pages/citizen/TrackGrievance";

import OfficerDashboard from "./pages/officer/OfficerDashboard";
import OfficerLogin from "./pages/officer/OfficerLogin";

import CMOLogin from "./pages/cmo/CMOLogin";
import CMODashboard from "./pages/cmo/CMODashboard";

function ComingSoon() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="bg-green-50 text-green-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-2xl font-bold">
        …
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Page Under Development
      </h1>
      <p className="text-gray-500 max-w-md">
        This section is being prepared. Please check back soon or return to the
        home page.
      </p>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/track" element={<TrackGrievance />} />

          {/* Staff logins */}
          <Route path="/cmo/login" element={<CMOLogin />} />
          <Route path="/officer/login" element={<OfficerLogin />} />

          {/* Citizen protected */}
          <Route element={<ProtectedRoute allowedRoles={["CITIZEN"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/submit-grievance" element={<SubmitGrievance />} />
          </Route>

          {/* CMO protected */}
          <Route element={<ProtectedRoute allowedRoles={["CMO_ADMIN"]} />}>
            <Route path="/cmo/dashboard" element={<CMODashboard />} />
          </Route>

          {/* Officer protected */}
          <Route
            element={<ProtectedRoute allowedRoles={["DEPARTMENT_OFFICER"]} />}
          >
            <Route path="/officer/dashboard" element={<OfficerDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<ComingSoon />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
