import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  Spinner,
  useToast,
  Avatar,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { auth, db, storage } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import DashboardLayout from '../Dashboard';
// At top: Add these below your existing imports
import { Textarea } from '@chakra-ui/react';

type ProfileData = {
  fullName: string;
  email: string;
  role: 'tutor' | 'organization';
  photoURL?: string;
  // Tutor specific
  expertise?: string;
  location?: string;
  bio?: string;
  experience?: string;
  // Org specific
  organizationName?: string;
  website?: string;
  contactNumber?: string;
  description?: string;
};

const ProfilePage = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});
  const [uploading, setUploading] = useState(false);
  const toast = useToast();


  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        const data = docSnap.data() as ProfileData;
        setProfile(data);
        setFormData(data); // initialize editable data
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    if (!auth.currentUser) return;

    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), formData);
      setProfile({ ...profile!, ...formData });
      setIsEditing(false);
      toast({
        title: 'Profile updated.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Update failed.',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

    setUploading(true);
    const storageRef = ref(storage, `profilePics/${auth.currentUser.uid}`);

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        photoURL: downloadURL,
      });
      setProfile({ ...profile!, photoURL: downloadURL });
      toast({
        title: 'Profile picture updated.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Upload failed.',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setUploading(false);
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
          <Spinner size="xl" />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box maxW="md" mx="auto" mt={8}>
        <Heading size="lg" mb={4}>Profile</Heading>
        <VStack spacing={4} align="stretch">
          <Avatar size="xl" name={profile?.fullName} src={profile?.photoURL} />
          <Input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
          {uploading && <Text>Uploading...</Text>}
          <Text>Email: {profile?.email}</Text>
          <Text>Role: {profile?.role}</Text>

          {isEditing ? (
            <>
              <Input
                value={formData.fullName || ''}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="Full Name"
              />

              {profile?.role === 'tutor' && (
                <>
                  <Input
                    value={formData.expertise || ''}
                    onChange={(e) => handleChange('expertise', e.target.value)}
                    placeholder="Expertise (e.g., Math, Physics)"
                  />
                  <Input
                    value={formData.location || ''}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="Location"
                  />
                  <Textarea
                    value={formData.bio || ''}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    placeholder="Bio"
                  />
                  <Input
                    value={formData.experience || ''}
                    onChange={(e) => handleChange('experience', e.target.value)}
                    placeholder="Experience (e.g., 5 years)"
                  />
                </>
              )}

              {profile?.role === 'organization' && (
                <>
                  <Input
                    value={formData.organizationName || ''}
                    onChange={(e) => handleChange('organizationName', e.target.value)}
                    placeholder="Organization Name"
                  />
                  <Input
                    value={formData.website || ''}
                    onChange={(e) => handleChange('website', e.target.value)}
                    placeholder="Website"
                  />
                  <Input
                    value={formData.contactNumber || ''}
                    onChange={(e) => handleChange('contactNumber', e.target.value)}
                    placeholder="Contact Number"
                  />
                  <Input
                    value={formData.location || ''}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="Location"
                  />
                  <Textarea
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Description"
                  />
                </>
              )}

              <Button colorScheme="green" onClick={handleUpdate}>Save</Button>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            </>
          ) : (
            <>
              <Text>Full Name: {profile?.fullName}</Text>

              {profile?.role === 'tutor' && (
                <>
                  <Text>Expertise: {profile?.expertise || '—'}</Text>
                  <Text>Location: {profile?.location || '—'}</Text>
                  <Text>Bio: {profile?.bio || '—'}</Text>
                  <Text>Experience: {profile?.experience || '—'}</Text>
                </>
              )}

              {profile?.role === 'organization' && (
                <>
                  <Text>Organization Name: {profile?.organizationName || '—'}</Text>
                  <Text>Website: {profile?.website || '—'}</Text>
                  <Text>Contact: {profile?.contactNumber || '—'}</Text>
                  <Text>Location: {profile?.location || '—'}</Text>
                  <Text>Description: {profile?.description || '—'}</Text>
                </>
              )}

              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </>
          )}
        </VStack>
      </Box>
    </DashboardLayout>
  );
};

export default ProfilePage;
