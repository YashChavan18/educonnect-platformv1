// src/components/common/TestimonialsSection.tsx

import { Box, Heading, Text, SimpleGrid} from '@chakra-ui/react';

const testimonials = [
  {
    text: '"EduConnect helped me find amazing tutors within days. The platform is seamless!"',
    author: 'Priya Sharma (Organization)',
  },
  {
    text: '"As a tutor, I was able to connect with multiple institutions. It really boosted my reach."',
    author: 'Rahul Mehta (Tutor)',
  },
  {
    text: '"User-friendly and efficient. EduConnect made hiring simple and transparent."',
    author: 'Ananya Rao (Organization)',
  },
];

const TestimonialsSection = () => {
  return (
    <Box bg="gray.100" py={16} px={6}>
      <Box maxW="6xl" mx="auto" textAlign="center">
        <Heading as="h2" size="xl" mb={10} color="blue.800">
          What Our Users Say
        </Heading>

        <SimpleGrid columns={[1, 1, 3]} spacing={8}>
          {testimonials.map((item, index) => (
            <Box
              key={index}
              p={6}
              bg="white"
              borderRadius="md"
              boxShadow="md"
              transition="0.3s"
              _hover={{ boxShadow: 'lg' }}
            >
              <Text fontStyle="italic" mb={4}>
                {item.text}
              </Text>
              <Text fontWeight="bold" color="gray.600">
                {item.author}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default TestimonialsSection;
