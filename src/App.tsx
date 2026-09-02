import "./App.css";

import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import ListasTracks from "./components/listaTracks";
import NavBar from "./components/NavBar";
import AdminUsersPage from "./pages/AdminUsersPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ListasTracks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute requireRole="ADMIN">
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
