// src/components/common/FAQSection.tsx

import {
  Box,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

const FAQSection = () => {
  return (
    <Box bg="gray.50" py={16} px={6}>
      <Box maxW="6xl" mx="auto">
        <Heading as="h2" size="xl" textAlign="center" mb={10} color="blue.800">
          Frequently Asked Questions
        </Heading>

        <Accordion allowMultiple boxShadow="md" borderRadius="md" bg="white" p={4}>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  What is EduConnect?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              EduConnect is a platform that connects tutors with organizations and learners.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  Is EduConnect free to use?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Yes, the platform offers free access for basic features. Premium options will be introduced in the future.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  How do I sign up as a tutor?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              You can sign up as a tutor by selecting the “Tutor” role during the sign-up process.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Box>
  );
};

export default FAQSection;
