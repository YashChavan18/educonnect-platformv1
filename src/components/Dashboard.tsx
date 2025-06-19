import type { ReactNode } from 'react';
import { Box, Flex, Text, Button, VStack, Spacer } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { logout, userRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Flex height="100vh" direction="column">
      {/* Navbar */}
      <Flex bg="blue.600" color="white" p={4} align="center">
        <Text fontSize="lg" fontWeight="bold">
          EduConnect Dashboard
        </Text>
        <Spacer />
        <Text mr={4}>Welcome, {userRole === 'tutor' ? 'Tutor' : 'Organization'}</Text>
        <Button colorScheme="red" onClick={handleLogout}>
          Logout
        </Button>
      </Flex>

      {/* Main Content */}
      <Flex flex="1">
        {/* Sidebar */}
        <Box bg="gray.100" p={4} minW="200px">
          <VStack align="start" spacing={4}>
            <Button
              variant="ghost"
              width="100%"
              justifyContent="start"
              onClick={() => navigate('/profile')}
            >
              Profile
            </Button>
            <Button
              variant="ghost"
              width="100%"
              justifyContent="start"
              onClick={() =>
                navigate(userRole === 'tutor' ? '/find-opportunities' : '/post-opportunity')
              }
            >
              {userRole === 'tutor' ? 'Find Opportunities' : 'Post Opportunity'}
            </Button>

{userRole === 'organization' && (
  <Button
    variant="ghost"
    width="100%"
    justifyContent="start"
    onClick={() => navigate('/posted-opportunities')}
  >
    Posted Opportunities
  </Button>
)}
{userRole === 'tutor' && (
  <Button
    variant="ghost"
    width="100%"
    justifyContent="start"
    onClick={() => navigate('/applied-opportunities')}
  >
    Applied Opportunities
  </Button>
)}

          </VStack>
        </Box>

        {/* Content Area */}
        <Box flex="1" p={6} overflowY="auto" bg="gray.50">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default DashboardLayout;
