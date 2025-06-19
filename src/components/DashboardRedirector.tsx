import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardRedirector = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole === 'tutor') {
      navigate('/tutor');
    } else if (userRole === 'organization') {
      navigate('/organization');
    } else {
      navigate('/login');
    }
  }, [userRole, navigate]);

  return null; // Nothing to render
};

export default DashboardRedirector;
