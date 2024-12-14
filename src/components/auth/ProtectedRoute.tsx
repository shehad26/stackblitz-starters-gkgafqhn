import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LoginModal } from './LoginModal';

interface Props {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const [showLogin, setShowLogin] = useState(true);
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <>
        {showLogin && (
          <LoginModal
            onClose={() => {
              setShowLogin(false);
              window.history.back();
            }}
            redirectPath={location.pathname}
          />
        )}
      </>
    );
  }

  return <>{children}</>;
}