import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/components";
import { SiteConfig } from "@/lib/site-config";

export interface FeedbackEmailProps {
  rating?: number;
  feedback: string;
  userEmail?: string;
  userName?: string;
}

export default function FeedbackEmail({
  rating = 5,
  feedback = "Great starter kit! Love the authentication system.",
  userEmail = "user@example.com",
  userName = "Anonymous User",
}: FeedbackEmailProps) {
  const year = new Date().getFullYear();
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const renderStars = (count: number) => {
    return "⭐".repeat(count) + "☆".repeat(5 - count);
  };

  return (
    <Html>
      <Head />
      <Preview>New feedback received from {userName}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded-lg border border-gray-200 bg-white px-8 py-10 shadow-sm">
            {/* Header */}
            <Section className="mb-8 text-center">
              {/* <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <Text className="text-2xl font-bold text-white">💬</Text>
              </div> */}
              <Text className="text-2xl font-bold text-gray-900">
                {SiteConfig.name}
              </Text>
              <Text className="text-sm text-gray-500">Community Feedback</Text>
            </Section>

            <Heading className="mb-6 text-center text-2xl font-bold text-gray-900">
              New Feedback Received
            </Heading>

            {/* User Info */}
            <Section className="mb-6 rounded-lg bg-blue-50 p-4">
              <Text className="mb-2 text-sm font-semibold text-gray-700">
                👤 From:
              </Text>
              <Text className="mb-1 text-base font-medium text-gray-900">
                {userName}
              </Text>
              <Text className="text-sm text-gray-600">{userEmail}</Text>
              <Text className="mt-3 text-xs text-gray-500">📅 {date}</Text>
            </Section>

            {/* Rating */}
            {rating > 0 && (
              <Section className="mb-6">
                <Text className="mb-2 text-sm font-semibold text-gray-700">
                  ⭐ Rating:
                </Text>
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">
                  <Text className="text-2xl">{renderStars(rating)}</Text>
                  <Text className="mt-2 text-sm font-medium text-gray-600">
                    {rating} out of 5 stars
                  </Text>
                </div>
              </Section>
            )}

            {/* Feedback Content */}
            <Section className="mb-6">
              <Text className="mb-2 text-sm font-semibold text-gray-700">
                💭 Feedback:
              </Text>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <Text className="text-base leading-relaxed text-gray-800">
                  {feedback}
                </Text>
              </div>
            </Section>

            {/* Quick Actions */}
            <Section className="mb-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
              <Text className="mb-2 text-sm font-semibold text-blue-900">
                💡 Next Steps
              </Text>
              <Text className="text-sm leading-relaxed text-blue-800">
                • Review and categorize this feedback
                <br />
                • Consider for roadmap and improvements
                <br />
                • Reply to the user if contact is needed
                <br />• Track similar feedback patterns
              </Text>
            </Section>

            <Hr className="my-8 border-gray-200" />

            {/* Footer */}
            <Text className="text-center text-xs leading-relaxed text-gray-400">
              This feedback was submitted through the{" "}
              <strong>{SiteConfig.name}</strong> feedback form.
            </Text>
            <Text className="mt-4 text-center text-xs text-gray-400">
              © {year} {SiteConfig.name} · Open Source · MIT License
            </Text>
            <Text className="mt-2 text-center text-xs text-gray-400">
              Built with ❤️ by {SiteConfig.author.name}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
