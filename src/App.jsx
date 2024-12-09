import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Profile from './pages/Profile';
import ClassRoster from './pages/ClassRoster';
import MyRoster from './pages/MyRoster';
import AssignedExercises from './pages/AssignedExercises';

function App() {
  console.log('App rendering');  // Debug log

  return (
    <Router>
      <div className="app-container">
        <AuthProvider>
          <ErrorBoundary>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <ProtectedRoute>
                    <Students />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/class-roster"
                element={
                  <ProtectedRoute>
                    <ClassRoster />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-roster"
                element={
                  <ProtectedRoute>
                    <MyRoster />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roster"
                element={
                  <ProtectedRoute>
                    <ClassRoster />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assigned-exercises"
                element={
                  <ProtectedRoute>
                    <AssignedExercises />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </ErrorBoundary>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App; 