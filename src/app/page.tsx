import HeroSection from '@/components/HeroSection'
import TrustSection from '@/components/TrustSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import HealthProtocolSection from '@/components/HealthProtocolSection'
import MembershipSection from '@/components/MembershipSection'
import DoctorsSection from '@/components/DoctorsSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import SocialProofSection from '@/components/SocialProofSection'
import CoursesSection from '@/components/CoursesSection'
import ContactPopup from '@/components/ContactPopup'
import CTASection from '@/components/CTASection'
import FAQSection from '@/components/FAQSection'

export default function Home() {
  return (
    <main>
      <ContactPopup />
      <HeroSection />
      <TrustSection />
      <HowItWorksSection />
      <HealthProtocolSection />
      <CoursesSection />
      <DoctorsSection />
      <MembershipSection />
      <TestimonialsSection />
      {/* <SocialProofSection /> */}
      <FAQSection />
      <CTASection />

      <div  className=""></div>
    </main>
  )
}
