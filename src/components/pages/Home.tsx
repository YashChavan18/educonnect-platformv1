
import Navbar from '../common/navbar'; // Correct path depending on your folder structure
import './Home.css'; // Optional for your custom styles
import HeroSection from '../common/HeroSection';
import AboutSection from '../pages/AboutSection';
import AvailableSection from '../common/AvailableSection';
import TestimonialsSection from '../common/TestimonialsSection';
import FAQSection from '../common/FAQSection';
import Footer from '../common/Footer'; // Ensure this path is correct   
const Home = () => {

  return (
    <>
      <Navbar />
        <HeroSection />
        <AboutSection /> 
        <AvailableSection/>
        <TestimonialsSection />
        <FAQSection />
        <Footer />
   
    </>
  );
};

export default Home;
