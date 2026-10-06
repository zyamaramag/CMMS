import { Outlet } from 'react-router';
import { AuthProvider } from '../contexts/AuthContext';
import { DataProvider } from '../contexts/DataContext';

export default function RootProviders() {
  return (
    <AuthProvider>
      <DataProvider>
        <Outlet />
      </DataProvider>
    </AuthProvider>
  );
}
