"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import FormError from "@/components/shared/form-error";
import FormSuccess from "@/components/shared/form-success";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "../ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

import type { DeleteAccountFormValues } from "@/types/settings";
import { DeleteAccountSchema } from "@/schemas/settings";
import { useTranslations } from "next-intl";
import { maskEmail } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { PasswordInput } from "../shared/password-input";
import { useRouter } from "@/i18n/navigation";
import { DEFAULT_SIGN_OUT_REDIRECT } from "@/lib/redirect-config";
import { deleteAccount } from "@/actions/settings/delete-account";
import { Spinner } from "../ui/spinner";

interface DeleteAccountDialogProps {
  children: React.ReactNode;
  hasPasswordAccount: boolean;
}

export default function DeleteAccountDialog({
  children,
  hasPasswordAccount,
}: DeleteAccountDialogProps) {
  const t = useTranslations();
  const { data: session, refetch } = authClient.useSession();
  const router = useRouter();

  const maskedEmail = maskEmail(session?.user.email ?? "");

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(DeleteAccountSchema(t)),
    defaultValues: {
      email: "",
      confirmation: "",
      password: "",
    },
  });

  function handleSubmit(values: DeleteAccountFormValues) {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const { error } = await deleteAccount(values);

      if (error) {
        setError(error);
        return;
      }

      await authClient.deleteUser({
        callbackURL: DEFAULT_SIGN_OUT_REDIRECT,
        fetchOptions: {
          onError: () => {
            setError(t("Form.errors.generic"));
          },
          onSuccess: () => {
            refetch();
            router.refresh();
            router.push(DEFAULT_SIGN_OUT_REDIRECT);
          },
        },
      });
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle>
            {t("Form.deleteAccount.header.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("Form.deleteAccount.header.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Separator />
        <div className="space-y-4">
          <FormError message={t("Form.deleteAccount.warning")} />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block">
                        {
                          t.rich("Form.deleteAccount.fields.email", {
                            email: maskedEmail ?? "",
                            strong: (chunks) => (
                              <span className="text-muted-foreground font-normal">
                                {chunks}
                              </span>
                            ),
                          }) as string
                        }
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="email" disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block">
                        {
                          t.rich("Form.deleteAccount.fields.confirmation", {
                            keyword: t("Form.deleteAccount.confirmationWord"),
                            strong: (chunks) => (
                              <span className="text-muted-foreground font-normal">
                                {chunks}
                              </span>
                            ),
                          }) as string
                        }
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {hasPasswordAccount && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("Form.fields.currentPassword")}
                        </FormLabel>
                        <FormControl>
                          <PasswordInput field={field} loading={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <div className="flex justify-between">
                <AlertDialogCancel onClick={() => form.reset()} asChild>
                  <Button type="button" variant="outline" disabled={isPending}>
                    {t("Form.deleteAccount.buttons.cancel")}
                  </Button>
                </AlertDialogCancel>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <Spinner />
                  ) : (
                    t("Form.deleteAccount.buttons.submit")
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
