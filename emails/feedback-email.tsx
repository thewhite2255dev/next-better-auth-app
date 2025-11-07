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
import { CustomText } from "@/components/react-email/custom-text";

export interface FeedbackEmailProps {
  feedback: string;
  userEmail?: string;
  category: "BUG" | "FEATURE" | "IMPROVEMENT" | "OTHER";
  rating?: number;
  totalFeedbacks?: number;
  averageRating?: number;
}

export default function FeedbackEmail({
  rating = 5,
  feedback = "Great starter kit! Love the authentication system.",
  userEmail = "user@example.com",
  category = "OTHER",
  totalFeedbacks = 8,
  averageRating = 3.8,
}: FeedbackEmailProps) {
  const year = new Date().getFullYear();
  const date = new Date().toLocaleDateString("en-US");

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push("★");
      } else if (i - 0.5 <= rating && rating < i) {
        stars.push("⯪");
      } else {
        stars.push("☆");
      }
    }
    return stars.join(" ");
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "BUG":
        return "Bug";
      case "FEATURE":
        return "New feature";
      case "IMPROVEMENT":
        return "Improvement";
      default:
        return "Other";
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "BUG":
        return { bg: "bg-red-100", text: "text-red-700" };
      case "FEATURE":
        return { bg: "bg-green-100", text: "text-green-700" };
      case "IMPROVEMENT":
        return { bg: "bg-blue-100", text: "text-blue-700" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700" };
    }
  };

  const categoryColors = getCategoryColor(category);

  return (
    <Html>
      <Head />
      <Preview>New feedback received - {getCategoryLabel(category)}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto my-8 max-w-2xl bg-white px-2 py-8">
            {/* Header */}
            <Section className="mb-8 text-center">
              <Heading className="m-0 mb-2 text-2xl font-bold text-gray-900">
                {SiteConfig.name}
              </Heading>
              <Text className="m-0 text-sm text-gray-500">
                Community Feedback
              </Text>
            </Section>

            <Heading className="mt-0 mb-6 text-center text-xl font-semibold text-gray-900">
              📬 New feedback received
            </Heading>

            {/* Category Badge */}
            <Section className="mb-6 text-center">
              <Text
                className={`m-0 inline-block rounded-full ${categoryColors.bg} px-4 py-2 text-sm font-semibold ${categoryColors.text}`}
              >
                {getCategoryLabel(category)}
              </Text>
            </Section>

            {/* Rating & Feedback Content */}
            {rating > 0 && (
              <Section className="mb-6">
                <table
                  cellPadding="0"
                  cellSpacing="0"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <tr>
                    <td style={{ padding: "16px" }}>
                      {/* Rating & Date */}
                      <table cellPadding="0" cellSpacing="0" width="100%">
                        <tr>
                          <td>
                            <Text
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                              className="m-0 mb-3"
                            >
                              <span
                                style={{
                                  fontSize: "20px",
                                  color: "#facc15",
                                  marginRight: "8px",
                                }}
                              >
                                {renderStars(rating)}
                              </span>
                              <span
                                style={{ fontSize: "14px", color: "#6b7280" }}
                              >
                                {date}
                              </span>
                            </Text>
                          </td>
                        </tr>
                      </table>

                      {/* Feedback Text */}
                      <CustomText
                        content={feedback}
                        className="m-0 mb-3 text-base leading-relaxed text-gray-800"
                      />

                      {/* User Email */}
                      {userEmail && userEmail !== "user@example.com" && (
                        <Text className="m-0 text-sm text-gray-600">
                          <strong>From:</strong> {userEmail}
                        </Text>
                      )}
                    </td>
                  </tr>
                </table>
              </Section>
            )}

            {/* Feedback Statistics */}
            <Section className="mb-6">
              <table
                cellPadding="0"
                cellSpacing="0"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#f9fafb",
                }}
              >
                <tr>
                  <td style={{ padding: "16px" }}>
                    <Text className="m-0 mb-2 text-sm font-semibold text-gray-900">
                      📊 Feedback statistics
                    </Text>
                    <Text className="m-0 text-sm leading-relaxed text-gray-700">
                      • Total feedbacks: <strong>{totalFeedbacks}</strong>
                      <br />• Average rating: <strong>
                        {averageRating}/5
                      </strong>{" "}
                      <span style={{ color: "#facc15" }}>★</span>
                    </Text>
                  </td>
                </tr>
              </table>
            </Section>

            {/* Next Steps */}
            <Section className="mb-6">
              <table
                cellPadding="0"
                cellSpacing="0"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  borderLeft: "4px solid #3b82f6",
                  backgroundColor: "#eff6ff",
                }}
              >
                <tr>
                  <td style={{ padding: "16px" }}>
                    <Text className="m-0 mb-2 text-sm font-semibold text-blue-900">
                      💡 Next steps
                    </Text>
                    <Text className="m-0 text-sm leading-relaxed text-blue-800">
                      • Review and categorize this feedback
                      <br />
                      • Consider for the roadmap
                      <br />
                      • Reply to the user if needed
                      <br />• Track similar feedback patterns
                    </Text>
                  </td>
                </tr>
              </table>
            </Section>

            <Hr className="my-8 border-gray-200" />

            {/* Footer */}
            <Text className="m-0 mb-2 text-center text-xs text-gray-400">
              This feedback was submitted through the {""}
              <strong>{SiteConfig.name}</strong> feedback form.
            </Text>
            <Text className="m-0 mb-2 text-center text-xs text-gray-400">
              © {year} {SiteConfig.name} · Open Source · MIT License
            </Text>
            <Text className="m-0 text-center text-xs text-gray-400">
              Built with ❤️ by {SiteConfig.author.name}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
