import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Button,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

type Opportunity = {
  id: string;
  title: string;
  organizationName?: string;
  description?: string;
  createdAt?: any;
  applicants?: string[];
  applicantsStatus?: Record<string, 'pending' | 'accepted' | 'declined'>;
};

const OpportunityDetails = () => {
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!opportunityId) {
        setError('No opportunity ID provided.');
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'opportunities', opportunityId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setOpportunity({
            id: docSnap.id,
            title: data.title,
            organizationName: data.organizationName || data.postedBy || 'Unknown Organization',
            description: data.description || 'No description provided.',
            createdAt: data.createdAt,
            applicants: data.applicants || [],
            applicantsStatus: data.applicantsStatus || {},
          });
        } else {
          setError('Opportunity not found.');
        }
      } catch (err) {
        console.error('Error fetching opportunity:', err);
        setError('Failed to fetch opportunity data.');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [opportunityId]);

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

  if (!opportunity)
    return null;

  return (
    <Box p={8} maxWidth="600px" mx="auto" borderWidth="1px" borderRadius="md" boxShadow="md">
      <Heading mb={4}>{opportunity.title}</Heading>
      <Text fontSize="lg" mb={2} fontWeight="semibold">
        Organization: {opportunity.organizationName}
      </Text>
      {opportunity.createdAt && (
        <Text fontSize="sm" color="gray.600" mb={4}>
          Posted on: {new Date(opportunity.createdAt.seconds * 1000).toLocaleDateString()}
        </Text>
      )}
      <Text mb={6}>{opportunity.description}</Text>
      <Text fontWeight="bold" mb={2}>
        Number of Applicants: {opportunity.applicants?.length || 0}
      </Text>

      <Button onClick={() => navigate(-1)} colorScheme="blue" mt={4}>
        Back
      </Button>
    </Box>
  );
};

export default OpportunityDetails;
