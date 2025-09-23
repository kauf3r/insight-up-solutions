import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request a Quote | Insight Up Solutions',
  description: 'Get a custom quote for your project. Fill out our form and we\'ll get back to you with pricing and details.',
  keywords: ['quote', 'pricing', 'custom solution', 'consultation'],
};

export default function QuoteRequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}