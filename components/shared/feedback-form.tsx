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
import {
  Star,
  Bug,
  Sparkles,
  Settings2,
  MessageSquareText,
} from "lucide-react";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useImperativeHandle, forwardRef } from "react";
import type { FeedbackFormValues } from "@/types/other";
import { FeedbackFormSchema } from "@/schemas/other";
import { sendFeedback } from "@/actions/feedback";

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
                <FormLabel>Catégorie</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BUG">
                      <Bug /> Bug
                    </SelectItem>
                    <SelectItem value="FEATURE">
                      <Sparkles /> Nouvelle fonctionnalité
                    </SelectItem>
                    <SelectItem value="IMPROVEMENT">
                      <Settings2 /> Amélioration
                    </SelectItem>
                    <SelectItem value="OTHER">
                      <MessageSquareText /> Autre
                    </SelectItem>
                  </SelectContent>
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
                  <FormLabel>
                    Comment évalueriez-vous votre expérience ?
                  </FormLabel>
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
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    className="max-h-48 resize-none"
                    placeholder="Dites-nous ce que vous pensez de degni-kit, quelles fonctionnalités vous aimeriez, ou signalez des problèmes..."
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
                <FormLabel>Adresse e-mail (facultatif)</FormLabel>
                <FormControl>
                  <Input placeholder="votre@email.com" {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Nous l&apos;utiliserons uniquement pour répondre à votre
                  retour.
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

type StarRatingProps = {
  value?: number;
  onChange?: (value: number) => void;
};

function StarRating({ value = 0, onChange }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className="transition-all hover:scale-110"
        >
          <Star
            className={`h-5 w-5 ${
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
