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

export interface TwoFactorEmailProps {
  token: string;
  email?: string;
}

export default function TwoFactorOTPEmail({
  token = "123456",
  email = "utilisateur@example.com",
}: TwoFactorEmailProps) {
  const year = new Date().getFullYear();

  return (
    <Html>
      <Head />
      <Preview>Your two-factor authentication code</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto my-8 max-w-2xl bg-white px-2 py-8">
            {/* Header */}
            <Section className="mb-8 text-center">
              <Heading className="m-0 mb-2 text-2xl font-bold text-gray-900">
                {SiteConfig.siteName}
              </Heading>
              <Text className="m-0 text-sm text-gray-500">
                Security notification
              </Text>
            </Section>

            <Heading className="mt-0 mb-6 text-center text-xl font-semibold text-gray-900">
              Two-factor authentication
            </Heading>

            <Text className="mb-4 text-base leading-relaxed text-gray-700">
              Hello,
            </Text>

            <Text className="mb-6 text-base leading-relaxed text-gray-700">
              You&apos;re receiving this email because you (or someone)
              attempted to sign in to your{" "}
              <strong>{SiteConfig.siteName}</strong> account. Enter the
              verification code below to complete your login:
            </Text>

            {/* OTP Code Box */}
            <Section className="my-8 rounded-lg border-2 border-blue-200 bg-blue-50 py-6 text-center">
              <Text className="mb-2 text-sm font-semibold tracking-wide text-gray-600 uppercase">
                Your Verification Code
              </Text>
              <Text className="text-4xl font-bold tracking-[0.5em] text-blue-600">
                {token}
              </Text>
            </Section>

            {/* Security Info */}
            <Section className="mb-6 rounded-lg bg-blue-50 p-4">
              <Text className="mb-2 text-sm font-semibold text-blue-900">
                ⏱️ Time-Sensitive Code
              </Text>
              <Text className="text-sm leading-relaxed text-blue-800">
                This code will expire in <strong>3 minutes</strong>. If it
                expires, you can request a new one during the sign-in process.
              </Text>
            </Section>

            <Hr className="my-8 border-gray-200" />

            {/* Security Warning */}
            <Section className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
              <Text className="mb-2 text-sm font-semibold text-red-900">
                🚨 Important Security Notice
              </Text>
              <Text className="text-sm leading-relaxed text-red-800">
                If you didn&apos;t attempt to sign in, someone may be trying to
                access your account. Please secure your account immediately by:
              </Text>
              <Text className="mt-2 ml-4 text-sm leading-relaxed text-red-800">
                • Changing your password
                <br />
                • Reviewing recent account activity
                <br />• Ensuring 2FA is enabled
              </Text>
            </Section>

            <Text className="mb-4 text-sm leading-relaxed text-gray-600">
              <strong>Pro Tip:</strong> Two-factor authentication adds an extra
              layer of security to your account. Never share your verification
              codes with anyone, including {SiteConfig.siteName} team members.
            </Text>

            <Hr className="my-8 border-gray-200" />

            {/* Footer */}
            <Text className="text-center text-xs leading-relaxed text-gray-400">
              This email was sent to <strong>{email}</strong> because a sign-in
              attempt was made on your {SiteConfig.siteName} account.
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
