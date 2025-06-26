import { Box, Flex, Text, Link, Stack } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="gray.800" color="white" py={6}>
      <Flex
        maxW="6xl"
        mx="auto"
        px={4}
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align={{ base: 'center', md: 'flex-start' }}
      >
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Teacherstree
          </Text>
          <Text fontSize="sm">Empowering Learning Connections</Text>
          <Text fontSize="sm">Connecting Tutors & Organizations Seamlessly</Text>
        </Box>

        <Stack direction={{ base: 'column', md: 'row' }} spacing={8} mt={{ base: 4, md: 0 }}>
          <Link href="#" _hover={{ textDecoration: 'underline' }}>
            About Us
          </Link>
          <Link href="#" _hover={{ textDecoration: 'underline' }}>
            Contact
          </Link>
          <Link href="#" _hover={{ textDecoration: 'underline' }}>
            Careers
          </Link>
        </Stack>
      </Flex>

      <Text textAlign="center" mt={6} fontSize="sm">
        © {new Date().getFullYear()} Teacherstree. All rights reserved.
      </Text>
    </Box>
  );
};

export default Footer;
