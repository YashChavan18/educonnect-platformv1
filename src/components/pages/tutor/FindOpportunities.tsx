// src/pages/FindOpportunities.tsx

import { useEffect, useState } from 'react';
import {
  Box, Text, Heading, SimpleGrid, Spinner, Button, Badge, Stack, Divider, useToast
} from '@chakra-ui/react';
import { db } from '../../../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../contexts/AuthContext';

const FindOpportunities = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const toast = useToast();

  const fetchOpportunities = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'opportunities'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOpportunities(data);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleApply = async (opportunityId: string) => {
    const opportunity = opportunities.find(op => op.id === opportunityId);
    if (!currentUser || !opportunity) return;

    if (opportunity.applicants?.includes(currentUser.uid)) {
      toast({
        title: 'Already Applied',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setApplyingId(opportunityId);
    try {
      const updatedApplicants = [...(opportunity.applicants || []), currentUser.uid];
      const docRef = doc(db, 'opportunities', opportunityId);
      await updateDoc(docRef, { applicants: updatedApplicants });

      // Update local state
      setOpportunities(prev =>
        prev.map(op =>
          op.id === opportunityId
            ? { ...op, applicants: updatedApplicants }
            : op
        )
      );

      toast({
        title: 'Application Submitted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Apply error:', error);
      toast({
        title: 'Failed to apply.',
        description: 'Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={6}>All Opportunities</Heading>

      {opportunities.length === 0 ? (
        <Text>No opportunities available.</Text>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {opportunities.map(op => {
            const hasApplied = op.applicants?.includes(currentUser?.uid);

            return (
              <Box key={op.id} p={5} shadow="md" borderWidth="1px" borderRadius="md">
                <Heading fontSize="xl">{op.title}</Heading>
                <Badge colorScheme="purple" mt={2}>{op.opportunityType || op.type}</Badge>

                <Stack spacing={1} mt={3}>
                  <Text><strong>Subject:</strong> {op.subject}</Text>
                  <Text><strong>Date:</strong> {op.date}</Text>
                  <Text><strong>Mode:</strong> {op.mode}</Text>
                  {op.location && <Text><strong>Location:</strong> {op.location}</Text>}
                  {op.perks && <Text><strong>Perks:</strong> {op.perks}</Text>}
                </Stack>

                <Divider my={3} />

                <Button
                  colorScheme="teal"
                  onClick={() => handleApply(op.id)}
                  isLoading={applyingId === op.id}
                  isDisabled={hasApplied}
                >
                  {hasApplied ? 'Applied' : 'Apply'}
                </Button>
              </Box>
            );
          })}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default FindOpportunities;
