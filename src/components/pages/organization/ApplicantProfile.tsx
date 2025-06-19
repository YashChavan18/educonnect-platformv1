import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Text, Heading, Avatar, Spinner, Center, VStack } from '@chakra-ui/react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

type Applicant = {
  fullName: string;
  email: string;
  contactNumber: string;
  description: string;
  location: string;
  photoURL?: string;
};

const ApplicantProfile = () => {
  const { applicantId } = useParams<{ applicantId: string }>();
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicant = async () => {
      if (!applicantId) return;
      try {
        const docRef = doc(db, 'users', applicantId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setApplicant(docSnap.data() as Applicant);
        } else {
          console.error('Applicant not found');
        }
      } catch (error) {
        console.error('Error fetching applicant profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicant();
  }, [applicantId]);

  if (loading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!applicant) {
    return (
      <Center h="60vh">
        <Text>Applicant not found.</Text>
      </Center>
    );
  }

  return (
    <Box p={8}>
      <VStack spacing={4} align="start">
        <Avatar size="xl" src={applicant.photoURL} name={applicant.fullName} />
        <Heading size="lg">{applicant.fullName}</Heading>
        <Text><strong>Email:</strong> {applicant.email}</Text>
        <Text><strong>Contact:</strong> {applicant.contactNumber}</Text>
        <Text><strong>Location:</strong> {applicant.location}</Text>
        <Text><strong>About:</strong> {applicant.description}</Text>
      </VStack>
    </Box>
  );
};

export default ApplicantProfile;
