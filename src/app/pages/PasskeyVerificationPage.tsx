import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Key, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '../components/ui/alert';

export default function PasskeyVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthenticatedUser } = useAuth();
  const { addAuthLog, users } = useData();
  
  const pendingUsername = location.state?.username;
  const pendingPassword = location.state?.password;
  const userFullName = location.state?.fullName;

  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');

  // Default passkey for demo users (in production, this would be stored securely per user)
  const DEFAULT_PASSKEY = '123456';

  useEffect(() => {
    if (!pendingUsername || !pendingPassword) {
      navigate('/');
      return;
    }

    // Show passkey info
    toast.info(`Demo Mode: Default passkey is ${DEFAULT_PASSKEY}`, { duration: 10000 });
  }, [pendingUsername, pendingPassword, navigate]);

  const handleVerify = () => {
    setError('');

    if (!passkey.trim()) {
      setError('Please enter your passkey');
      return;
    }

    // Verify passkey
    if (passkey === DEFAULT_PASSKEY) {
      // Passkey verified successfully
      addAuthLog({
        username: pendingUsername,
        action: 'login_success',
        details: 'Passkey verification successful - User logged in'
      });

      // Get full user data from DataContext
      const userData = users.find(u => u.username === pendingUsername);
      
      console.log('🔍 DEBUG: Looking for user:', pendingUsername);
      console.log('🔍 DEBUG: Found user data:', userData);
      
      if (userData) {
        // Set the authenticated user with full data
        const authUser = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          fullName: userData.fullName
        };
        
        console.log('✅ DEBUG: Setting authenticated user:', authUser);
        
        // Set authenticated user
        setAuthenticatedUser(authUser);
        
        toast.success('Authentication successful! Welcome back.');
        navigate('/dashboard');
      } else {
        console.error('❌ DEBUG: User not found in DataContext');
        setError('User data not found. Please contact administrator.');
      }
    } else {
      // Passkey verification failed
      addAuthLog({
        username: pendingUsername,
        action: 'login_failed',
        details: 'Invalid passkey entered'
      });

      setError('Invalid passkey. Please try again.');
      setPasskey('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-yellow-200">
        <CardHeader className="space-y-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Key className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Passkey Verification</CardTitle>
              <CardDescription className="text-yellow-50">
                Additional security for existing users
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Welcome Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-700 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Welcome back, {userFullName}!</p>
              <p className="text-xs">
                As an existing user, please enter your passkey for additional security verification.
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Passkey Input */}
          <div className="space-y-3">
            <Label htmlFor="passkey">
              <Key className="h-4 w-4 inline mr-2" />
              Enter Your Passkey
            </Label>
            <Input
              id="passkey"
              type="password"
              placeholder="Enter 6-digit passkey"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength={6}
              className="text-center text-2xl tracking-widest font-mono"
              autoFocus
            />
            <p className="text-xs text-slate-500">
              Enter the 6-digit passkey you set up during registration
            </p>
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 h-12"
            disabled={!passkey.trim()}
          >
            <Key className="h-5 w-5 mr-2" />
            Verify Passkey
          </Button>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-sm text-slate-600">
              Forgot your passkey?{' '}
              <button
                onClick={() => {
                  toast.info('Please contact your system administrator to reset your passkey');
                }}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Contact Support
              </button>
            </p>
          </div>

          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>

          {/* Security Info */}
          <div className="bg-slate-50 rounded-lg p-4 text-xs text-slate-600 space-y-2">
            <p className="font-semibold text-slate-800">🔒 Passkey Security:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Passkeys provide an extra layer of security</li>
              <li>Your passkey is unique and confidential</li>
              <li>Never share your passkey with anyone</li>
              <li>All verification attempts are logged</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}