import PageTransition from '../components/PageTransition';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Lock, AlertCircle, Shield, UserPlus, LogIn } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { toast } from 'sonner';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { users } = useData();
  const { addAuthLog } = useData();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Log login attempt
      addAuthLog({
        username,
        action: 'login_attempt',
        details: 'User attempting to log in'
      });

      // Find user
      const user = users.find(u => u.username === username);

      if (!user) {
        setError('Invalid username or password');
        addAuthLog({
          username,
          action: 'login_failed',
          details: 'User not found'
        });
        setLoading(false);
        return;
      }

      if (user.password !== password) {
        setError('Invalid username or password');
        addAuthLog({
          username,
          action: 'login_failed',
          details: 'Incorrect password'
        });
        setLoading(false);
        return;
      }

      if (user.status !== 'active') {
        setError('Your account is not active. Please contact an administrator.');
        addAuthLog({
          username,
          action: 'login_failed',
          details: `Account status: ${user.status}`
        });
        setLoading(false);
        return;
      }

      // Redirect to MFA page
      toast.info('Credentials verified. Proceeding to MFA verification...');
      navigate('/mfa-verification', {
        state: {
          username: user.username,
          password: user.password,
          email: user.email,
          fullName: user.fullName
        }
      });

    } catch (err) {
      setError('Login failed. Please try again.');
      addAuthLog({
        username,
        action: 'login_failed',
        details: 'System error during login'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-blue-50 p-4">
      <PageTransition>
      <Card className="w-full max-w-md shadow-2xl border-yellow-200">
        <CardHeader className="space-y-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-t-lg">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">HVL Engineering Services</CardTitle>
          <CardDescription className="text-center text-yellow-50">
            Construction Materials Management System
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-semibold">Secure Login</p>
                <p>Multi-Factor Authentication (MFA) required for all logins</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">
                <Lock className="h-4 w-4 inline mr-2" />
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-slate-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                <Lock className="h-4 w-4 inline mr-2" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-slate-300"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 h-12"
              disabled={loading}
            >
              <LogIn className="h-5 w-5 mr-2" />
              {loading ? 'Verifying...' : 'Sign In'}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-yellow-300 hover:bg-yellow-50"
              onClick={() => navigate('/signup')}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create New Account
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => navigate('/account-status')}
            >
              Check Registration Status
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-2">Demo Credentials:</p>
            <div className="text-xs space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span><strong>Admin:</strong> admin / admin123</span>
              </div>
              <div className="flex justify-between">
                <span><strong>Warehouse Staff:</strong> staff / staff123</span>
              </div>
              <div className="flex justify-between">
                <span><strong>Engineer:</strong> engineer / engineer123</span>
              </div>
              <div className="flex justify-between">
                <span><strong>Project Manager:</strong> manager / manager123</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-300">
              <p className="text-xs text-blue-700 font-semibold">
                📌 Existing users passkey: <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">123456</span>
              </p>
            </div>
          </div>

          {/* Security Info */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>🔒 Security Features:</strong>
            </p>
            <ul className="text-xs text-yellow-700 mt-1 space-y-1 list-disc list-inside">
              <li>Multi-Factor Authentication (MFA)</li>
              <li>Passkey verification for existing users</li>
              <li>Password strength requirements</li>
              <li>Session timeout protection</li>
              <li>All login attempts logged</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      </PageTransition>
    </div>
  );
}