// src/components/common/Navbar.tsx

import { Box, Flex, Text, Spacer, Button, Link, HStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <Box px={8} py={4} bg="blue.700" color="white" boxShadow="lg">
      <Flex align="center">
        {/* Logo Section */}
        <Text fontSize="2xl" fontWeight="bold" color="white">
          <RouterLink to="/">EduConnect</RouterLink>
        </Text>

        <Spacer />

        {/* Navigation Links */}
        <HStack spacing={6}>
          <Link as={RouterLink} to="/about" fontWeight="medium" _hover={{ color: 'yellow.200' }}>
            About Us
          </Link>
          <Link as={RouterLink} to="/contact" fontWeight="medium" _hover={{ color: 'yellow.200' }}>
            Contact
          </Link>
          <Button as={RouterLink} to="/login" colorScheme="yellow" size="sm" variant="solid">
            Login
          </Button>
          <Button as={RouterLink} to="/signup" colorScheme="whiteAlpha" size="sm" variant="outline">
            Sign Up
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
