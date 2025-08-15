import { Navigate } from 'react-router';
import { Spin } from 'antd';
import { useAuth } from '../context/auth-context';

// This component is a wrapper that checks for authentication.
const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth();

    // 1. While we are checking for a user, show a loading spinner
    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    // 2. If loading is finished and there's no user, redirect to the login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. If a user is logged in, show the page they were trying to access
    return <>{children}</>;
};

export default ProtectedRoute;