"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Bug, Sparkles, Settings2, MessageCircle } from "lucide-react";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useImperativeHandle, forwardRef } from "react";
import type { FeedbackFormValues } from "@/types/other";
import { FeedbackFormSchema } from "@/schemas/other";
import { sendFeedback } from "@/actions/feedback";
import { StarRating } from "./star-rating";

export type FeedbackFormRef = {
  resetForm: () => void;
  submitForm: () => Promise<boolean>;
  isSubmitting: boolean;
};

type FeedbackFormProps = {
  onSuccess?: () => void;
};

export const FeedbackForm = forwardRef<FeedbackFormRef, FeedbackFormProps>(
  ({ onSuccess }, ref) => {
    const t = useTranslations();

    const form = useForm<FeedbackFormValues>({
      resolver: zodResolver(FeedbackFormSchema(t)),
      defaultValues: {
        category: "OTHER",
        userEmail: "",
        message: "",
        rating: undefined,
      },
    });

    const watchType = form.watch("category");

    const categoryIcon: Record<
      string,
      React.ComponentType<React.SVGProps<SVGSVGElement>>
    > = {
      BUG: Bug,
      FEATURE: Sparkles,
      IMPROVEMENT: Settings2,
      OTHER: MessageCircle,
    };

    const feedbackCategoryItems = Object.entries(categoryIcon).map(
      ([key, Icon]) => (
        <SelectItem key={key} value={key}>
          <Icon className="h-4 w-4" />
          {t(`Form.feedback.category.${key.toLowerCase()}`)}
        </SelectItem>
      ),
    );

    async function handleSubmit(values: FeedbackFormValues) {
      if (watchType !== "BUG" && values.rating === undefined) {
        toast.error(t("Form.feedback.errors.rating.required"));
        return false;
      }

      const { error } = await sendFeedback(values);

      if (error) {
        toast.error(error);
        return false;
      }

      toast.success(t("FeedbackDialog.success"));
      form.reset({ category: values.category });
      onSuccess?.();
      return true;
    }

    useImperativeHandle(ref, () => ({
      submitForm: async () => {
        const isValid = await form.trigger();
        if (!isValid) return false;
        return handleSubmit(form.getValues());
      },
      resetForm: () => form.reset(),
      isSubmitting: form.formState.isSubmitting,
    }));

    return (
      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Form.feedback.labels.category")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("Form.feedback.placeholders.category")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>{feedbackCategoryItems}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchType !== "BUG" && (
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Form.feedback.labels.rating")}</FormLabel>
                  <FormControl>
                    <StarRating value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Form.feedback.labels.message")}</FormLabel>
                <FormControl>
                  <Textarea
                    className="max-h-48 resize-none"
                    placeholder={t("Form.feedback.placeholders.message")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Form.feedback.labels.email")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("Form.feedback.placeholders.email")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  {t("Form.feedback.hints.email")}
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </Form>
    );
  },
);

FeedbackForm.displayName = "FeedbackForm";
