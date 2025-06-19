import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { db } from '../../../firebase';
import {
  doc,
  getDoc,
} from 'firebase/firestore';
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  HStack,
  Spinner,
} from '@chakra-ui/react';

type Applicant = {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'accepted' | 'declined';
};

// ... imports remain unchanged
import { updateDoc } from 'firebase/firestore';

const ViewApplicants = () => {
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [opportunityTitle, setOpportunityTitle] = useState<string>('');

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!opportunityId) return;
      try {
        setLoading(true);
        setError(null);

        const opportunityRef = doc(db, 'opportunities', opportunityId);
        const opportunitySnap = await getDoc(opportunityRef);

        if (!opportunitySnap.exists()) {
          setError('Opportunity not found.');
          setLoading(false);
          return;
        }

        const opportunityData = opportunitySnap.data();
        setOpportunityTitle(opportunityData?.title || 'Opportunity');

        const applicantIds: string[] = opportunityData?.applicants || [];
        const applicantStatusMap = opportunityData?.applicantsStatus || {};

        const userPromises = applicantIds.map(async (userId) => {
          const userRef = doc(db, 'users', userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            return {
              id: userId,
              name: userData?.fullName || 'No Name',
              email: userData?.email || 'No Email',
              status: applicantStatusMap[userId] || 'pending',
            };
          } else {
            return null;
          }
        });

        const usersData = await Promise.all(userPromises);
        const filteredApplicants = usersData.filter(Boolean) as Applicant[];

        setApplicants(filteredApplicants);
        setLoading(false);
      } catch (err) {
        console.error('Error loading applicants:', err);
        setError('Error loading applicants. Please try again.');
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [opportunityId]);

  const updateStatus = async (userId: string, status: 'accepted' | 'declined') => {
    if (!opportunityId) return;

    const opportunityRef = doc(db, 'opportunities', opportunityId);
    try {
      await updateDoc(opportunityRef, {
        [`applicantsStatus.${userId}`]: status,
      });

      // update UI
      setApplicants((prev) =>
        prev.map((a) => (a.id === userId ? { ...a, status } : a))
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status.');
    }
  };

  if (loading) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box p={8}>
      <Heading mb={4}>Applicants for: {opportunityTitle}</Heading>
      <VStack spacing={4} align="stretch">
        {applicants.length === 0 && <Text>No applicants found.</Text>}

        {applicants.map((applicant) => (
          <Box key={applicant.id} borderWidth="1px" borderRadius="lg" p={4}>
            <HStack justify="space-between">
              <Box>
                <Text fontWeight="bold">{applicant.name}</Text>
                <Text>Status: {applicant.status}</Text>
              </Box>
              <HStack spacing={2}>
                <Button
                  as={RouterLink}
                  to={`/applicant-profile/${applicant.id}`}
                  size="sm"
                  colorScheme="blue"
                >
                  View Profile
                </Button>
                <Button
                  size="sm"
                  colorScheme="green"
                  isDisabled={applicant.status !== 'pending'}
                  onClick={() => updateStatus(applicant.id, 'accepted')}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  isDisabled={applicant.status !== 'pending'}
                  onClick={() => updateStatus(applicant.id, 'declined')}
                >
                  Decline
                </Button>
              </HStack>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default ViewApplicants;
