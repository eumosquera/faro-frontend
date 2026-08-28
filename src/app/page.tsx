import { Hero } from '@/components/marketing/hero';
import { FeaturesSection } from '@/components/marketing/features-section';
import { PricingSection } from '@/components/marketing/pricing-section';
import { getActivePlans } from '@/lib/api/public-client';

export default async function LandingPage() {
  const plans = await getActivePlans();

  return (
    <main>
      <Hero />
      <FeaturesSection />
      <PricingSection plans={plans} />
    </main>
  );
}
