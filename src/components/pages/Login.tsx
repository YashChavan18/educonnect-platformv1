import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import {
  Box,
  Button,
  Input,
  Select,
  VStack,
  Heading,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ViewIcon, ViewOffIcon, ArrowBackIcon } from '@chakra-ui/icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tutor'); // Temporary until we fetch from Firestore
  const [showPassword, setShowPassword] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: 'Please fill in all fields.',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      login(role, userCredential.user.displayName || '', userCredential.user.email || '');

      toast({
        title: 'Login successful.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      if (role === 'tutor') navigate('/tutor');
      else if (role === 'organization') navigate('/organization');
    } catch (error: any) {
      toast({
        title: 'Login failed.',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Flex minHeight="100vh" align="center" justify="center" bg="gray.50" p={4}>
      <Box
        p={8}
        maxW="400px"
        width="100%"
        bg="white"
        boxShadow="xl"
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.200"
      >
        <Flex mb={6} align="center">
          <IconButton
            aria-label="Go Back"
            icon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            variant="ghost"
            mr={2}
          />
          <Heading size="lg" flexGrow={1} textAlign="center">
            Log In
          </Heading>
          <Spacer />
        </Flex>

        <VStack spacing={4} align="stretch">
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            focusBorderColor="green.400"
            rounded="md"
          />

          <InputGroup>
            <Input
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              focusBorderColor="green.400"
              rounded="md"
            />
            <InputRightElement width="3rem">
              <IconButton
                h="1.75rem"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                variant="ghost"
              />
            </InputRightElement>
          </InputGroup>

          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            focusBorderColor="green.400"
            rounded="md"
          >
            <option value="tutor">Tutor</option>
            <option value="organization">Organization</option>
          </Select>

          <Button colorScheme="green" onClick={handleLogin} width="full" size="md" fontWeight="bold">
            Log In
          </Button>

          <Text fontSize="sm" textAlign="center" color="gray.600">
            Don't have an account?{' '}
            <Button
              variant="link"
              colorScheme="green"
              onClick={() => navigate('/signup')}
              fontWeight="bold"
            >
              Sign Up
            </Button>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;
