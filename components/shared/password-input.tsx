"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FormControl } from "../ui/form";
import { useState } from "react";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import type {
  ControllerRenderProps,
  FieldValues,
  FieldPath,
} from "react-hook-form";

type PasswordInputProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, FieldPath<T>>;
  loading?: boolean;
};

export function PasswordInput<T extends FieldValues>({
  field,
  loading = false,
}: PasswordInputProps<T>) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <InputGroup>
      <FormControl>
        <InputGroupInput
          {...field}
          type={showPassword ? "text" : "password"}
          disabled={loading}
          autoComplete="off"
        />
      </FormControl>
      {field.value && (
        <InputGroupAddon align="inline-end">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="mr-[3px] h-6 w-6"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 cursor-default" />
            ) : (
              <Eye className="h-4 w-4 cursor-default" />
            )}
          </Button>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
