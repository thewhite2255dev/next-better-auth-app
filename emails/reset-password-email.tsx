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
          <Container className="mx-auto my-10 max-w-[600px] rounded-lg border border-gray-200 bg-white px-8 py-10 shadow-sm">
            {/* Header */}
            <Section className="mb-8 text-center">
              {/* <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <Text className="text-2xl font-bold text-white">🔐</Text>
              </div> */}
              <Text className="text-2xl font-bold text-gray-900">
                {SiteConfig.name}
              </Text>
              <Text className="text-sm text-gray-500">
                Production-Ready Next.js Starter Kit
              </Text>
            </Section>

            <Heading className="mb-6 text-center text-2xl font-bold text-gray-900">
              Reset Your Password
            </Heading>

            <Text className="mb-4 text-base leading-relaxed text-gray-700">
              Hello,
            </Text>

            <Text className="mb-6 text-base leading-relaxed text-gray-700">
              We received a request to reset your password for your{" "}
              <strong>{SiteConfig.name}</strong> account. Click the button below
              to create a new password:
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
              If the button doesn't work, copy and paste this link into your
              browser:
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
                If you didn't request a password reset, please ignore this email
                and ensure your account is secure. Your password will remain
                unchanged.
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
              reset was requested for your {SiteConfig.name} account.
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
