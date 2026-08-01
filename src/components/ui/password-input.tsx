"use client"

import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState, type ComponentProps, type ReactNode, type ChangeEvent } from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export function PasswordInput({
  children,
  onChange,
  value,
  defaultValue,
  ...props
}: Omit<ComponentProps<typeof Input>, "type"> & {
  children?: ReactNode
}) {
  const [showPassword, setShowPassword] = useState(false)
  const Icon = showPassword ? EyeOffIcon : EyeIcon

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
  }

  return (
    <div className="space-y-3">
      <InputGroup>
        <InputGroupInput
          {...props}
          value={value}
          defaultValue={defaultValue}
          type={showPassword ? "text" : "password"}
          onChange={handleChange}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            onClick={() => setShowPassword(p => !p)}
          >
            <Icon className="size-4.5" />
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {children}
    </div>
  )
}
