import { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, Avatar } from '@chakra-ui/react';
import DashboardLayout from '../../Dashboard';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase';

type UserProfile = {
  fullName: string;
  role: string;
  photoURL?: string;
};

const TutorDashboard = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
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
        <Heading size="lg" mb={4}>Welcome, {profile?.fullName || 'Tutor'}!</Heading>
        <Avatar
          size="xl"
          name={profile?.fullName}

          mb={4}
        />
        <Text fontSize="md" mb={2}>Role: {profile?.role || 'Tutor'}</Text>
        <Text fontSize="md">
          Here you can manage your profile, explore tutoring opportunities, and track your applications.
        </Text>
      </Box>
    </DashboardLayout>
  );
};

export default TutorDashboard;
