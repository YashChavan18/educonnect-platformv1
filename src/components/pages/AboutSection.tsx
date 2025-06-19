// src/components/pages/AboutSection.tsx

import { Box, Heading, Text, SimpleGrid } from '@chakra-ui/react';

const AboutSection = () => {
  return (
    <Box bg="white" py={20} px={6}>
      <Box maxW="6xl" mx="auto" textAlign="center">
        <Heading as="h2" size="xl" mb={6} color="blue.800">
          Why EduConnect?
        </Heading>
        <Text fontSize="lg" mb={10} color="gray.600">
          EduConnect bridges the gap between skilled tutors and organizations looking for educational expertise.
          Whether you're an educator or an institution, EduConnect helps you connect, collaborate, and grow.
        </Text>

        <SimpleGrid columns={[1, 2]} spacing={10} mt={10}>
          <Box bg="gray.50" p={6} borderRadius="md" boxShadow="sm">
            <Heading size="md" mb={2} color="blue.600">For Tutors</Heading>
            <Text color="gray.600">
              Find job opportunities, connect with top institutions, and grow your teaching career.
            </Text>
          </Box>
          <Box bg="gray.50" p={6} borderRadius="md" boxShadow="sm">
            <Heading size="md" mb={2} color="blue.600">For Organizations</Heading>
            <Text color="gray.600">
              Hire talented tutors, manage teaching staff, and scale your educational impact easily.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default AboutSection;
