// src/components/common/HeroSection.tsx

import { Box, Heading, Text, Stack, Button, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      bgGradient="linear(to-r, blue.700, teal.500)"
      color="white"
      py={[16, 24]}
      px={[6, 12]}
      textAlign="center"
    >
      <Flex direction="column" align="center" justify="center" maxW="3xl" mx="auto">
        <Heading fontSize={['3xl', '4xl', '5xl']} mb={4}>
          Empower Your Learning Journey
        </Heading>
        <Text fontSize="lg" mb={6}>
          Find the best tutors or organizations that fit your goals.
        </Text>
        <Stack direction={['column', 'row']} spacing={4}>
          <Button size="lg" colorScheme="yellow" onClick={() => navigate('/signup')}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" color="white" borderColor="white" onClick={() => navigate('/login')}>
            Login
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
};

export default HeroSection;
