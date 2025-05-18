"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { useAuth } from "@/context/AuthContext"
import axios from "axios"
import Cookies from "js-cookie"

// Password update form schema with zod
const passwordSchema = z.object({
  oldPassword: z.string().min(8, "Old password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
})

type PasswordFormData = z.infer<typeof passwordSchema>

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
)

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.953 9.953 0 012.252-3.438M9.88 9.879a3 3 0 014.242 4.242M15 12a3 3 0 00-3-3m0 0l-2.12-2.12m4.24 4.24l2.12 2.12M3 3l18 18"
    />
  </svg>
)

const UserProfile = () => {
  const { auth } = useAuth()
  const user = auth?.user

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  })

  const onSubmit = async (data: PasswordFormData) => {
    setIsSubmitting(true)
    try {
      const token = Cookies.get("accessToken")
      if (!token) throw new Error("User is not authenticated")

      await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/change-password`,
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      alert("Password updated successfully!")
      form.reset()
    } catch (error: any) {
        const validationErrors = error.response.data.errors
      if (validationErrors) {
        alert(error?.response?.data?.message || "Failed to update password")
      } else {
        alert("An error occurred while updating the password")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return <p className="text-center mt-10">Loading user data...</p>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-xl border border-gray-200 rounded-3xl bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-center text-indigo-600">
            👤 Your Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Name</Label>
              <Input
                type="text"
                value={user.name}
                readOnly
                className="bg-gray-100 border border-gray-200"
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Email</Label>
              <Input
                type="email"
                value={user.email}
                readOnly
                className="bg-gray-100 border border-gray-200"
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm text-muted-foreground">Address</Label>
              <Input
                type="text"
                value={(user as any).address || ""}
                readOnly
                className="bg-gray-100 border border-gray-200"
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Role</Label>
              <Input
                type="text"
                value={user.role}
                readOnly
                className="bg-gray-100 border border-gray-200"
              />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="bg-white border border-indigo-100 rounded-xl p-5 shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="text-indigo-600">Old Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showOldPassword ? "text" : "password"}
                          placeholder="Enter old password"
                          {...field}
                          className="border border-indigo-300 focus-visible:ring-indigo-500 pr-10"
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-3 top-8 text-gray-600"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        tabIndex={-1}
                        aria-label={showOldPassword ? "Hide old password" : "Show old password"}
                      >
                        {showOldPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="text-indigo-600">New Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          {...field}
                          className="border border-indigo-300 focus-visible:ring-indigo-500 pr-10"
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-3 top-8 text-gray-600"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        tabIndex={-1}
                        aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                      >
                        {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                      <FormDescription>
                        Make sure your password is strong and secure.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserProfile
