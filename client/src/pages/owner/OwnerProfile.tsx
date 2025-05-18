"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { useAuth } from "@/context/AuthContext"
import Cookies from "js-cookie"
import axios from "axios"

const passwordSchema = z.object({
  oldPassword: z.string().min(8, "Old password must be at least 8 characters."),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters.")
    .max(16, "New password must be at most 16 characters."),
})

type PasswordFormData = z.infer<typeof passwordSchema>

const OwnerProfile = () => {
  const { auth } = useAuth()
  const owner = auth?.user
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
      const validationErrors = error?.response?.data?.errors
      if (validationErrors) {
        alert(error?.response?.data?.message || "Failed to update password")
      } else {
        alert("An error occurred while updating the password")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!owner) {
    return <p className="text-center mt-10">Loading owner data...</p>
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg rounded-2xl border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-indigo-600 text-center">
            Owner Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Owner Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Name</Label>
              <Input value={owner.name} readOnly className="bg-gray-100" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={owner.email} readOnly className="bg-gray-100" />
            </div>
            <div>
              <Label>Store Name</Label>
              <Input value={(owner as any).storeName || ""} readOnly className="bg-gray-100" />
            </div>
            <div className="md:col-span-2">
              <Label>Store Address</Label>
              <Input value={(owner as any).storeAddress || ""} readOnly className="bg-gray-100" />
            </div>
          </div>

          <Separator className="my-4" />

          {/* Password Update Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-indigo-600 font-semibold">
                      Current Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter current password"
                        {...field}
                        className="border-indigo-300 focus-visible:ring-indigo-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-indigo-600 font-semibold">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        {...field}
                        className="border-indigo-300 focus-visible:ring-indigo-500"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      Password must be between 8 - 16 characters.
                    </p>
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
        </CardContent>
      </Card>
    </div>
  )
}

export default OwnerProfile
