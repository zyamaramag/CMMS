import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Clock, CheckCircle, XCircle, Search, ArrowLeft, Mail, User, Briefcase, Calendar } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { toast } from 'sonner';

export default function AccountStatusPage() {
  const navigate = useNavigate();
  const { pendingRegistrations } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [foundRegistration, setFoundRegistration] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Please enter your username or email');
      return;
    }

    const registration = pendingRegistrations.find(
      r => r.username === searchQuery.trim() || r.email === searchQuery.trim()
    );

    if (registration) {
      setFoundRegistration(registration);
    } else {
      toast.error('No registration found with this username or email');
      setFoundRegistration(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-12 w-12 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="h-12 w-12 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-12 w-12 text-red-600" />;
      default:
        return <Clock className="h-12 w-12 text-slate-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 text-white text-lg px-4 py-1">Pending Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-600 text-white text-lg px-4 py-1">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="text-lg px-4 py-1">Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="text-lg px-4 py-1">{status}</Badge>;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your registration is currently under review by the system administrator. You will be notified once a decision has been made.';
      case 'approved':
        return 'Congratulations! Your account has been approved. You can now log in to the system using your credentials.';
      case 'rejected':
        return 'Unfortunately, your registration request has been rejected. Please see the reason below for more details.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-blue-200">
        <CardHeader className="space-y-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl text-center">Check Registration Status</CardTitle>
          <CardDescription className="text-center text-blue-50">
            HVL Engineering Services - Account Registration
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="searchQuery">Enter Your Username or Email</Label>
              <div className="flex gap-2">
                <Input
                  id="searchQuery"
                  type="text"
                  placeholder="username or email@example.com"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </form>

          {/* Results */}
          {foundRegistration && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="text-center space-y-4 p-6 bg-slate-50 rounded-lg border">
                <div className="flex justify-center">
                  {getStatusIcon(foundRegistration.status)}
                </div>
                <div>
                  {getStatusBadge(foundRegistration.status)}
                </div>
                <p className="text-sm text-slate-700">
                  {getStatusMessage(foundRegistration.status)}
                </p>
              </div>

              {/* Registration Details */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">Registration Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-slate-600" />
                      <div>
                        <p className="text-xs text-slate-500">Full Name</p>
                        <p className="font-medium">{foundRegistration.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-slate-600" />
                      <div>
                        <p className="text-xs text-slate-500">Username</p>
                        <p className="font-medium">@{foundRegistration.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-slate-600" />
                      <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="font-medium">{foundRegistration.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-slate-600" />
                      <div>
                        <p className="text-xs text-slate-500">Requested Role</p>
                        <p className="font-medium capitalize">{foundRegistration.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-slate-600" />
                      <div>
                        <p className="text-xs text-slate-500">Request Date</p>
                        <p className="font-medium">{new Date(foundRegistration.requestDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {foundRegistration.reviewDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-slate-600" />
                        <div>
                          <p className="text-xs text-slate-500">Review Date</p>
                          <p className="font-medium">{new Date(foundRegistration.reviewDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {foundRegistration.reviewedBy && (
                    <div className="pt-3 border-t">
                      <p className="text-xs text-slate-500">Reviewed By</p>
                      <p className="font-medium text-sm">{foundRegistration.reviewedBy}</p>
                    </div>
                  )}

                  {foundRegistration.rejectionReason && (
                    <div className="pt-3 border-t">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-xs font-semibold text-red-800 mb-1">Rejection Reason:</p>
                        <p className="text-sm text-red-700">{foundRegistration.rejectionReason}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Next Steps */}
              {foundRegistration.status === 'approved' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                  <p className="font-semibold text-green-800 text-sm">✅ Next Steps:</p>
                  <ol className="list-decimal list-inside text-xs text-green-700 space-y-1">
                    <li>Return to the login page</li>
                    <li>Enter your username and password</li>
                    <li>Complete Multi-Factor Authentication (MFA)</li>
                    <li>Access the system dashboard</li>
                  </ol>
                  <Button
                    onClick={() => navigate('/')}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700"
                  >
                    Go to Login
                  </Button>
                </div>
              )}

              {foundRegistration.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="font-semibold text-yellow-800 text-sm mb-2">⏳ What's Next?</p>
                  <p className="text-xs text-yellow-700">
                    Please wait while the administrator reviews your registration. This typically takes 1-2 business days. 
                    You will receive an email notification once your account has been reviewed.
                  </p>
                </div>
              )}

              {foundRegistration.status === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-semibold text-red-800 text-sm mb-2">❌ Account Rejected</p>
                  <p className="text-xs text-red-700 mb-3">
                    If you believe this decision was made in error, please contact the system administrator 
                    at admin@hvl.com with your registration details.
                  </p>
                  <Button
                    onClick={() => navigate('/signup')}
                    variant="outline"
                    className="w-full border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Submit New Registration
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Back to Login */}
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
