import { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, Avatar } from '@chakra-ui/react';
import DashboardLayout from '../../Dashboard';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase';

type OrgProfile = {
  fullName: string;
  role: string;
  photoURL?: string;
};

const OrgDashboard = () => {
  const [profile, setProfile] = useState<OrgProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        setProfile(docSnap.data() as OrgProfile);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Spinner size="xl" />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box>
        <Heading size="lg" mb={4}>
          Welcome, {profile?.fullName || 'Organization'}!
        </Heading>
        <Avatar
                  size="xl"
                  name={profile?.fullName}
                
                  mb={4}
                />
        <Text fontSize="md" mb={6}>
          Role: {profile?.role || 'organization'}
        </Text>
        <Text fontSize="md">
          Here you can post new tutoring opportunities, manage applicants, and view your organization profile.
        </Text>
      </Box>
    </DashboardLayout>
  );
};

export default OrgDashboard;
