import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/components";
import { SiteConfig } from "@/lib/site-config";

export interface ResetPasswordEmailProps {
  token: string;
  email?: string;
}

export default function ResetPasswordEmail({
  token,
  email = "utilisateur@example.com",
}: ResetPasswordEmailProps) {
  const year = new Date().getFullYear();
  const baseUrl = process.env.BETTER_AUTH_URL!;
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>Reset your password securely</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto my-8 max-w-2xl bg-white px-2 py-8">
            {/* Header */}
            <Section className="mb-8 text-center">
              <Heading className="m-0 mb-2 text-2xl font-bold text-gray-900">
                {SiteConfig.siteName}
              </Heading>
              <Text className="m-0 text-sm text-gray-500">
                Production-ready Next.js starter kit
              </Text>
            </Section>

            <Heading className="mt-0 mb-6 text-center text-xl font-semibold text-gray-900">
              Reset Your Password
            </Heading>

            <Text className="mb-4 text-base leading-relaxed text-gray-700">
              Hello,
            </Text>

            <Text className="mb-6 text-base leading-relaxed text-gray-700">
              We received a request to reset your password for your{" "}
              <strong>{SiteConfig.siteName}</strong> account. Click the button
              below to create a new password:
            </Text>

            <Section className="my-8 text-center">
              <Link
                href={resetLink}
                className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white no-underline shadow-lg"
              >
                Reset Password
              </Link>
            </Section>

            <Text className="mb-4 text-sm leading-relaxed text-gray-600">
              This password reset link will expire in <strong>1 hour</strong>{" "}
              for security reasons.
            </Text>

            <Text className="mb-6 text-sm leading-relaxed text-gray-600">
              If the button doesn&apos;t work, copy and paste this link into
              your browser:
            </Text>

            <Section className="mb-6 rounded-md bg-gray-50 p-3">
              <Text className="text-xs break-all text-gray-500">
                {resetLink}
              </Text>
            </Section>

            <Hr className="my-8 border-gray-200" />

            {/* Security Notice */}
            <Section className="mb-6 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4">
              <Text className="mb-2 text-sm font-semibold text-amber-900">
                ⚠️ Security Notice
              </Text>
              <Text className="text-sm leading-relaxed text-amber-800">
                If you didn&apos;t request a password reset, please ignore this
                email and ensure your account is secure. Your password will
                remain unchanged.
              </Text>
            </Section>

            <Text className="text-sm leading-relaxed text-gray-600">
              For security reasons, we recommend:
            </Text>
            <Text className="ml-4 text-sm leading-relaxed text-gray-600">
              • Using a strong, unique password
              <br />
              • Enabling two-factor authentication
              <br />• Never sharing your password with anyone
            </Text>

            <Hr className="my-8 border-gray-200" />

            {/* Footer */}
            <Text className="text-center text-xs leading-relaxed text-gray-400">
              This email was sent to <strong>{email}</strong> because a password
              reset was requested for your {SiteConfig.siteName} account.
            </Text>
            <Text className="mt-4 text-center text-xs text-gray-400">
              © {year} {SiteConfig.siteName} · Open Source · MIT License
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
