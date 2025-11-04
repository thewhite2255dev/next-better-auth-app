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
          <Container className="mx-auto my-10 max-w-[600px] rounded-lg border border-gray-200 bg-white px-8 py-10 shadow-sm">
            {/* Header */}
            <Section className="mb-8 text-center">
              {/* <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <Text className="text-2xl font-bold text-white">🔒</Text>
              </div> */}
              <Text className="text-2xl font-bold text-gray-900">
                {SiteConfig.name}
              </Text>
              <Text className="text-sm text-gray-500">
                Production-Ready Next.js Starter Kit
              </Text>
            </Section>

            <Heading className="mb-6 text-center text-2xl font-bold text-gray-900">
              Two-Factor Authentication
            </Heading>

            <Text className="mb-4 text-base leading-relaxed text-gray-700">
              Hello,
            </Text>

            <Text className="mb-6 text-base leading-relaxed text-gray-700">
              You're receiving this email because you (or someone) attempted to
              sign in to your <strong>{SiteConfig.name}</strong> account. Enter
              the verification code below to complete your login:
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
                If you didn't attempt to sign in, someone may be trying to
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
              codes with anyone, including {SiteConfig.name} team members.
            </Text>

            <Hr className="my-8 border-gray-200" />

            {/* Footer */}
            <Text className="text-center text-xs leading-relaxed text-gray-400">
              This email was sent to <strong>{email}</strong> because a sign-in
              attempt was made on your {SiteConfig.name} account.
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
