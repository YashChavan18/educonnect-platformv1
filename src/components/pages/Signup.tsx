// src/components/pages/Signup.tsx

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import {
  Box,
  Button,
  Input,
  Select,
  VStack,
  Heading,
  useToast,
  Text,
  Link,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowBackIcon } from '@chakra-ui/icons';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tutor');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async () => {
    if (!fullName.trim()) {
      toast({
        title: 'Full name is required.',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: 'Password should be at least 6 characters.',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        email,
        role,
        createdAt: serverTimestamp(),
      });

      login(role, user.email || '', user.uid);

      toast({
        title: 'Signup successful.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      if (role === 'tutor') navigate('/tutor');
      else if (role === 'organization') navigate('/organization');

      setFullName('');
      setEmail('');
      setPassword('');
      setRole('tutor');
    } catch (error: any) {
      toast({
        title: 'Signup failed.',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={6} maxW="400px" mx="auto" mt={10} boxShadow="lg" borderRadius="lg" bg="white">
      <Flex mb={4} align="center" onClick={() => navigate(-1)} cursor="pointer">
        <Icon as={ArrowBackIcon} mr={2} />
        <Text fontWeight="medium">Back</Text>
      </Flex>

      <Heading mb={6} textAlign="center" fontSize="2xl">Create an Account</Heading>

      <VStack spacing={4}>
        <Input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="tutor">Tutor</option>
          <option value="organization">Organization</option>
        </Select>
        <Button
          colorScheme="blue"
          onClick={handleSignup}
          width="full"
          isLoading={loading}
          loadingText="Signing up..."
        >
          Sign Up
        </Button>
      </VStack>

      <Text mt={4} textAlign="center" fontSize="sm">
        Already have an account?{' '}
        <Link color="blue.500" onClick={() => navigate('/login')}>
          Log in
        </Link>
      </Text>
    </Box>
  );
};

export default Signup;
