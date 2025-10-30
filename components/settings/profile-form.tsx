"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthErrorMessages } from "@/hooks/use-auth-error-messages";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { ProfileFormSchema } from "@/schemas/settings";
import type { ProfileFormValues } from "@/types/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import FormError from "../layout/form-error";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";

export function ProfileForm() {
  const t = useTranslations();
  const router = useRouter();
  const authError = useAuthErrorMessages();

  const { data: session, isPending, refetch } = authClient.useSession();

  const [isSubmitting, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileFormSchema(t)),
    defaultValues: {
      name: "",
      bio: "",
      location: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        bio: session.user.bio || "",
        location: session.user.location || "",
      });
    }
  }, [session, form]);

  function handleSubmit(values: ProfileFormValues) {
    setError("");

    startTransition(async () => {
      await authClient.updateUser(
        {
          ...values,
        },
        {
          onError: async (ctx) => {
            toast.error(
              authError[ctx.error.code as string] || t("Form.errors.generic"),
            );
          },
          onSuccess: () => {
            toast.success("Le profil a été modifié avec succès.");
            refetch();
            router.refresh();
          },
        },
      );
    });
  }

  if (isPending) {
    return <p>Loading...</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("Form.fields.name")}</FormLabel>
              <FormControl>
                <Input disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem className="w-full">
          <FormLabel>{t("Form.fields.email")}</FormLabel>
          <FormControl>
            <Input disabled defaultValue={session?.user.email} />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("Form.fields.bio")}</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  maxLength={200}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormDescription className="flex items-center justify-end">
                {field.value?.length} / 200
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("Form.fields.location")}</FormLabel>
              <FormControl>
                <Input disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormError message={error} />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : t("Form.profileForm.updateButton")}
        </Button>
      </form>
      <div className="opacity-70">
        <p>UserData: {JSON.stringify(session)}</p>
      </div>
    </Form>
  );
}
