import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AdminDashboard from "./pages/admin/Dashboard";
import OwnerDashboard from "./pages/owner/Dashboard";
import StoreList from "./pages/user/StoreList";
import Navbar from "./components/Navbar";
import UserProfile from "./pages/user/UserProfile";
import OwnerProfile from "./pages/owner/OwnerProfile";
import Add from "./pages/admin/Add";
import Unauthorized from "./pages/Unauthorized";
import CreateStore from "./pages/admin/CreateStore";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { auth } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/login"
          element={
            !auth?.user ? (
              <Login />
            ) : (
              <Navigate
                to={`/${auth.user.role.toLowerCase().replace("_", "")}/dashboard`}
                replace
              />
            )
          }
        />

        <Route
          path="/signup"
          element={
            !auth?.user ? (
              <Signup />
            ) : (
              <Navigate
                to={`/${auth.user.role.toLowerCase().replace("_", "")}/dashboard`}
                replace
              />
            )
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-new" element={<Add />} />
          <Route path="/admin/create-store" element={<CreateStore />} />
        </Route>

        {/* Owner Routes */}
        <Route element={<ProtectedRoute allowedRoles={["STORE_OWNER"]} />}>
          <Route path="/storeowner/dashboard" element={<OwnerDashboard />} />
          <Route path="/storeowner/profile" element={<OwnerProfile />} />
        </Route>

        {/* User Routes */}
        <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
          <Route path="/user/dashboard" element={<StoreList />} />
          <Route path="/user/profile" element={<UserProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
