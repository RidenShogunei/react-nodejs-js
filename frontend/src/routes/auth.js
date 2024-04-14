import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import api from './api/login'

export function useAuthStatus() {
  const [status, setStatus] = useState('pending');
  const uid = localStorage.getItem('uid');

  useEffect(() => {
    if (uid) {
      api.confirm(uid).then(isValid => {
        if (isValid) {
          setStatus('resolved');
        } else {
          localStorage.removeItem('uid');
          setStatus('rejected');
        }
      });
    } else {
      setStatus('rejected');
    }
  }, [uid]);

  return status;
}

export function CheckAuth({ component: Component }) {
  const status = useAuthStatus();

  if (status === 'pending') {
    return <div>Loading...</div>;
  } else if (status === 'resolved') {
    return <Component />;
  } else {
    return <Navigate to="/" replace />;
  }
}