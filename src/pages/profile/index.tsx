import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useUserSlice, setLoginResponse } from '@/pages/admin/auth-slice';
import { useGetApiV1AuthMeQuery } from '@/store/coreApiWithTags';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Lock,
  Edit2,
  RollerCoaster,
} from 'lucide-react';
import { toast } from 'sonner';
import config from '@/utils/config';

export function Profile() {
  const dispatch = useDispatch();
  const { loginResponse } = useUserSlice();
  const user = loginResponse?.data?.user;

  // Query to refetch user data (always enabled so we can refetch)
  const { refetch: refetchUser } = useGetApiV1AuthMeQuery();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    businessName: user?.businessName || '',
    state: user?.state || '',
    lga: user?.lga || '',
    city: user?.city || '',
    address: user?.address || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Ensure proper URL construction
      const baseUrl = (config.API_BASE_URL || 'http://localhost:5000').replace(
        /\/+$/,
        ''
      );
      const apiUrl = `${baseUrl}/api/v1/auth/profile`;
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${loginResponse?.data?.tokens?.accessToken}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Fetch updated user data using RTK Query
      const { data: meData } = await refetchUser();

      if (meData?.data) {
        // Update Redux state with new user data
        dispatch(
          setLoginResponse({
            ...loginResponse!,
            data: {
              ...loginResponse!.data,
              user: meData.data,
            },
          })
        );

        // Update local profile data state
        setProfileData({
          firstName: meData.data?.firstName || '',
          lastName: meData.data?.lastName || '',
          phone: meData.data?.phone || '',
          businessName: meData.data?.businessName || '',
          state: meData.data?.state || '',
          lga: meData.data?.lga || '',
          city: meData.data?.city || '',
          address: meData.data?.address || '',
        });
      }

      toast.success('Profile updated successfully');
      setIsEditDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Ensure proper URL construction
      const baseUrl = (config.API_BASE_URL || 'http://localhost:5000').replace(
        /\/+$/,
        ''
      );
      const apiUrl = `${baseUrl}/api/v1/auth/password`;
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${loginResponse?.data?.tokens?.accessToken}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      toast.success('Password changed successfully');
      setIsPasswordDialogOpen(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() ||
      user.email?.[0]?.toUpperCase() ||
      'U'
    : 'U';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account information
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-3xl text-white mb-4">
              {initials}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
              className="w-full md:w-auto"
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Full Name
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.email || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.email || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Phone
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.phone || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-5 w-5 text-gray-400 mt-0.5 flex items-center justify-center">
                  <RollerCoaster />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Role
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {(user?.role || 'admin').toUpperCase()}
                  </p>
                </div>
              </div>

              {user?.businessName && (
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Business Name
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.businessName}
                    </p>
                  </div>
                </div>
              )}

              {(user?.state || user?.city || user?.address) && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Address
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {[user?.address, user?.city, user?.lga, user?.state]
                        .filter(Boolean)
                        .join(', ') || 'N/A'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Change Password Button */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(true)}
                className="w-full md:w-auto"
              >
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  First Name
                </label>
                <Input
                  value={profileData.firstName}
                  onChange={e =>
                    setProfileData(prev => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  placeholder="First Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Last Name
                </label>
                <Input
                  value={profileData.lastName}
                  onChange={e =>
                    setProfileData(prev => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  placeholder="Last Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input
                  value={profileData.phone}
                  onChange={e =>
                    setProfileData(prev => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="Phone Number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Business Name (Optional)
                </label>
                <Input
                  value={profileData.businessName}
                  onChange={e =>
                    setProfileData(prev => ({
                      ...prev,
                      businessName: e.target.value,
                    }))
                  }
                  placeholder="Business Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <Input
                  value={profileData.state}
                  onChange={e =>
                    setProfileData(prev => ({ ...prev, state: e.target.value }))
                  }
                  placeholder="State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">LGA</label>
                <Input
                  value={profileData.lga}
                  onChange={e =>
                    setProfileData(prev => ({ ...prev, lga: e.target.value }))
                  }
                  placeholder="Local Government Area"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <Input
                  value={profileData.city}
                  onChange={e =>
                    setProfileData(prev => ({ ...prev, city: e.target.value }))
                  }
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Address
                </label>
                <Input
                  value={profileData.address}
                  onChange={e =>
                    setProfileData(prev => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="Street Address"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Password
              </label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={e =>
                  setPasswordData(prev => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                placeholder="Enter current password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={e =>
                  setPasswordData(prev => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                placeholder="Enter new password (min 8 characters)"
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={e =>
                  setPasswordData(prev => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                placeholder="Confirm new password"
                required
                minLength={8}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
