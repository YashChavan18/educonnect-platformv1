import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Badge,
  Button,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase'; // Adjust the import path as needed
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

type Opportunity = {
  id: string;
  title: string;
  organizationName?: string; // optional, if stored
  createdAt?: any;
  applicantsStatus: Record<string, 'pending' | 'accepted' | 'declined'>;
};

const statusColorMap = {
  pending: 'yellow',
  accepted: 'green',
  declined: 'red',
};

const AppliedOpportunities = () => {
  const [appliedOpportunities, setAppliedOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!user?.uid) {
      setError('User not logged in.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const q = query(
      collection(db, 'opportunities'),
      where('applicants', 'array-contains', user.uid)
    );

    // Real-time listener
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const opps: Opportunity[] = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const data = docSnapshot.data();

            let orgName = data.organizationName;

            // If organizationName is missing but postedBy ID is available, fetch organization/user name
            if (!orgName && data.postedBy) {
              try {
                const orgRef = doc(db, 'users', data.postedBy);
                const orgSnap = await getDoc(orgRef);
                if (orgSnap.exists()) {
                  const orgData = orgSnap.data();
                  orgName = orgData.fullName || orgData.name || 'Unknown Org';
                } else {
                  orgName = 'Unknown Org';
                }
              } catch (err) {
                console.error('Error fetching organization name:', err);
                orgName = 'Unknown Org';
              }
            }

            return {
              id: docSnapshot.id,
              title: data.title,
              organizationName: orgName || 'Unknown Org',
              createdAt: data.createdAt,
              applicantsStatus: data.applicantsStatus || {},
            };
          })
        );

        setAppliedOpportunities(opps);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching applied opportunities:', err);
        setError('Failed to load applied opportunities.');
        setLoading(false);
        toast({
          title: 'Error',
          description: 'Could not fetch your applied opportunities.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [user, toast]);

  if (loading)
    return (
      <Box p={8} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );

  if (error)
    return (
      <Box p={8} textAlign="center" color="red.500">
        {error}
      </Box>
    );

  return (
    <Box p={8}>
      <Heading mb={6}>My Applied Opportunities</Heading>
      {appliedOpportunities.length === 0 ? (
        <Text>You have not applied to any opportunities yet.</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {appliedOpportunities.map((opp) => {
            const status = opp.applicantsStatus[user!.uid] || 'pending';

            return (
              <Box
                key={opp.id}
                borderWidth="1px"
                borderRadius="md"
                p={4}
                _hover={{ shadow: 'md' }}
              >
                <HStack justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="bold" fontSize="lg">
                      {opp.title}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Organization: {opp.organizationName}
                    </Text>
                    {opp.createdAt && (
                      <Text fontSize="xs" color="gray.500">
                        Posted on: {new Date(opp.createdAt.seconds * 1000).toLocaleDateString()}
                      </Text>
                    )}
                  </Box>
                  <HStack spacing={4}>
                    <Badge colorScheme={statusColorMap[status]}>{status.toUpperCase()}</Badge>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/opportunity-details/${opp.id}`)} // Adjust route as needed
                    >
                      View Details
                    </Button>
                  </HStack>
                </HStack>
              </Box>
            );
          })}
        </VStack>
      )}
    </Box>
  );
};

export default AppliedOpportunities;
