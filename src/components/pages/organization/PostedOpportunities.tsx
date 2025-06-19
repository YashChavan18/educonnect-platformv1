// src/components/pages/organization/PostedOpportunities.tsx

import { useEffect, useState } from 'react';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../../contexts/AuthContext';

type Opportunity = {
  id: string;
  title: string;
  description: string;
  date: string;
};

const PostedOpportunities = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      if (!currentUser) return;
      const q = query(
        collection(db, 'opportunities'),
        where('postedBy', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Opportunity[];
      setOpportunities(data);
    };

    fetchOpportunities();
  }, [currentUser]);

  return (
    <Box p={8}>
      <Heading mb={6}>Your Posted Opportunities</Heading>
      <VStack spacing={4} align="stretch">
        {opportunities.length === 0 ? (
          <Text>No opportunities posted yet.</Text>
        ) : (
          opportunities.map((opp) => (
            <Box key={opp.id} p={4} borderWidth="1px" borderRadius="md">
              <Text fontWeight="bold">{opp.title}</Text>
              <Text>{opp.description}</Text>
              <Text>Date: {opp.date}</Text>
              <Button
                mt={2}
                size="sm"
                colorScheme="blue"
                onClick={() => navigate(`/view-applicants/${opp.id}`)}
              >
                View Applicants
              </Button>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default PostedOpportunities;
