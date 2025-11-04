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

export interface VerificationEmailProps {
  token: string;
  email?: string;
}

export default function VerificationEmail({
  token,
  email = "utilisateur@example.com",
}: VerificationEmailProps) {
  const year = new Date().getFullYear();
  const baseUrl = process.env.BETTER_AUTH_URL!;
  const verificationLink = `${baseUrl}/verify-email?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>Verify your email to get started with Degni Kit</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded-lg border border-gray-200 bg-white px-8 py-10 shadow-sm">
            {/* Header */}
            <Section className="mb-8 text-center">
              {/* <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <Text className="text-2xl font-bold text-white">✨</Text>
              </div> */}
              <Text className="text-2xl font-bold text-gray-900">
                {SiteConfig.name}
              </Text>
              <Text className="text-sm text-gray-500">
                Production-Ready Next.js Starter Kit
              </Text>
            </Section>

            <Heading className="mb-6 text-center text-2xl font-bold text-gray-900">
              Verify Your Email Address
            </Heading>

            <Text className="mb-4 text-base leading-relaxed text-gray-700">
              Welcome to <strong>{SiteConfig.name}</strong>! 👋
            </Text>

            <Text className="mb-6 text-base leading-relaxed text-gray-700">
              We're excited to have you on board. To complete your registration
              and start building amazing applications, please verify your email
              address by clicking the button below:
            </Text>

            <Section className="my-8 text-center">
              <Link
                href={verificationLink}
                className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white no-underline shadow-lg"
              >
                Verify Email Address
              </Link>
            </Section>

            <Text className="mb-4 text-sm leading-relaxed text-gray-600">
              This link will expire in <strong>24 hours</strong> for security
              reasons.
            </Text>

            <Text className="mb-6 text-sm leading-relaxed text-gray-600">
              If the button doesn't work, copy and paste this link into your
              browser:
            </Text>

            <Section className="mb-6 rounded-md bg-gray-50 p-3">
              <Text className="text-xs break-all text-gray-500">
                {verificationLink}
              </Text>
            </Section>

            <Hr className="my-8 border-gray-200" />

            <Text className="mb-4 text-sm leading-relaxed text-gray-600">
              <strong>Didn't request this?</strong> If you didn't create an
              account, you can safely ignore this email.
            </Text>

            <Text className="text-sm leading-relaxed text-gray-600">
              Need help? Check out our{" "}
              <Link
                href={SiteConfig.links.github}
                className="text-blue-600 underline"
              >
                documentation
              </Link>{" "}
              or reach out to the community.
            </Text>

            <Hr className="my-8 border-gray-200" />

            {/* Footer */}
            <Text className="text-center text-xs leading-relaxed text-gray-400">
              This email was sent to <strong>{email}</strong> because an account
              was created on {SiteConfig.name}.
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
