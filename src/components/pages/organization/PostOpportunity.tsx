// src/pages/PostOpportunity.tsx

import React, { useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Textarea, Heading, Select, useToast
} from '@chakra-ui/react';
import { db, auth } from '../../../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const PostOpportunity = () => {
  const [form, setForm] = useState({
    title: '',
    opportunityType: '',
    subject: '',
    description: '',
    duration: '',
    date: '',
    mode: '',
    location: '',
    perks: ''
  });

  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast({ title: 'Please log in', status: 'error' });
      return;
    }

    if (!form.title || !form.opportunityType || !form.date || !form.mode) {
      toast({ title: 'Please fill required fields', status: 'warning' });
      return;
    }

    const opportunity = {
      ...form,
      createdAt: new Date().toISOString(),
      postedBy: user.uid,
      applicants: [],
    };

    try {
      await addDoc(collection(db, 'opportunities'), opportunity);
      toast({ title: 'Opportunity posted successfully!', status: 'success' });
      setForm({
        title: '',
        opportunityType: '',
        subject: '',
        description: '',
        duration: '',
        date: '',
        mode: '',
        location: '',
        perks: ''
      });
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast({ title: 'Error posting opportunity', status: 'error' });
    }
  };

  return (
    <Box maxW="700px" mx="auto" p={4}>
      <Heading mb={6}>Post a New Opportunity</Heading>

      <FormControl mb={4}>
        <FormLabel>Title *</FormLabel>
        <Input name="title" value={form.title} onChange={handleChange} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Opportunity Type *</FormLabel>
        <Select name="opportunityType" value={form.opportunityType} onChange={handleChange}>
          <option value="">Select Type</option>
          <option value="Session">Session</option>
          <option value="Workshop">Workshop</option>
          <option value="Training">Training</option>
          <option value="Talk">Talk / Seminar</option>
        </Select>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Subject / Focus Area</FormLabel>
        <Input name="subject" value={form.subject} onChange={handleChange} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Description *</FormLabel>
        <Textarea name="description" value={form.description} onChange={handleChange} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Duration</FormLabel>
        <Input name="duration" value={form.duration} onChange={handleChange} placeholder="e.g., 2 hours or 3 days" />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Date *</FormLabel>
        <Input name="date" type="date" value={form.date} onChange={handleChange} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Mode *</FormLabel>
        <Select name="mode" value={form.mode} onChange={handleChange}>
          <option value="">Select Mode</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
          <option value="Hybrid">Hybrid</option>
        </Select>
      </FormControl>

      {(form.mode === 'Offline' || form.mode === 'Hybrid') && (
        <FormControl mb={4}>
          <FormLabel>Location</FormLabel>
          <Input name="location" value={form.location} onChange={handleChange} />
        </FormControl>
      )}

      <FormControl mb={4}>
        <FormLabel>Perks (optional)</FormLabel>
        <Input name="perks" value={form.perks} onChange={handleChange} placeholder="e.g., Certificate, Honorarium" />
      </FormControl>

      <Button colorScheme="blue" onClick={handleSubmit}>
        Post Opportunity
      </Button>
    </Box>
  );
};

export default PostOpportunity;
