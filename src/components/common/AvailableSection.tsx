import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Button,
  useToast,
  Spinner,
  Center,
  Stack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

interface CardItem {
  id: string;
  name: string;
  info: string;
}

const AvailableSection = () => {
  const [opportunities, setOpportunities] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!currentUser) {
      // User not logged in, clear data and skip fetching
      setOpportunities([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, 'opportunities'),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          info: doc.data().info,
        }));
        setOpportunities(data);
        setLoading(false);
      },
      (error) => {
        console.error('Firestore snapshot error: ', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleApply = () => {
    if (!currentUser) {
      toast({
        title: 'Login Required',
        description: 'Please log in to apply for this opportunity.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
    } else {
      toast({
        title: 'Application Submitted!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="gray.50" py={16} px={6}>
      <Box maxW="6xl" mx="auto" textAlign="center">
        <Heading as="h2" size="xl" mb={4} color="blue.800">
          Explore Opportunities
        </Heading>
        <Text fontSize="lg" mb={8} color="gray.600">
          Featured latest openings from organizations
        </Text>

        {!currentUser && (
          <Box
            bg="blue.50"
            p={6}
            mb={8}
            borderRadius="md"
            boxShadow="md"
            maxW="md"
            mx="auto"
          >
            <Text fontSize="lg" mb={4} color="blue.700">
              New here? Please sign up to explore and apply for opportunities.
            </Text>
            <Stack direction="row" spacing={4} justify="center">
              <Button
                colorScheme="blue"
                onClick={() => navigate('/signup')}
                size="md"
              >
                Sign Up
              </Button>
              <Button
                variant="outline"
                colorScheme="blue"
                onClick={() => navigate('/login')}
                size="md"
              >
                Login
              </Button>
            </Stack>
          </Box>
        )}

        {loading ? (
          <Center>
            <Spinner size="xl" color="blue.500" />
          </Center>
        ) : (
          currentUser && (
            <SimpleGrid columns={[1, 2]} spacing={6}>
              {opportunities.slice(0, 3).map((item) => (
                <Box
                  key={item.id}
                  p={6}
                  bg="white"
                  borderRadius="md"
                  boxShadow="md"
                  textAlign="left"
                >
                  <Heading size="md" mb={2} color="blue.600">
                    {item.name}
                  </Heading>
                  <Text color="gray.600">{item.info}</Text>
                  <Button
                    mt={4}
                    colorScheme="blue"
                    size="sm"
                    onClick={handleApply}
                  >
                    Apply
                  </Button>
                </Box>
              ))}
            </SimpleGrid>
          )
        )}

        {/* Show "See More" button only if opportunities are more than 3 */}
        {currentUser && opportunities.length > 3 && (
          <Button
            mt={8}
            colorScheme="blue"
            onClick={() => {
              // Implement your modal or redirect for full list here
              toast({
                title: 'More Opportunities',
                description: 'Feature to view more opportunities coming soon!',
                status: 'info',
                duration: 3000,
                isClosable: true,
              });
            }}
          >
            See More
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AvailableSection;
