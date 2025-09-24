import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Reservations from "@/components/pages/Reservations";
import Rooms from "@/components/pages/Rooms";
import Guests from "@/components/pages/Guests";
import Housekeeping from "@/components/pages/Housekeeping";
import Reports from "@/components/pages/Reports";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="guests" element={<Guests />} />
            <Route path="housekeeping" element={<Housekeeping />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;