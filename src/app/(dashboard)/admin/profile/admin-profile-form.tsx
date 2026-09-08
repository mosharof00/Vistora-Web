"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { updateAdminProfile } from "@/app/(dashboard)/admin/profile/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  adminProfileSchema,
  type AdminProfileInput,
} from "@/lib/validations/admin-profile";

export function AdminProfileForm({
  email,
  defaultValues,
}: {
  email: string;
  defaultValues: AdminProfileInput;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<AdminProfileInput>({
    resolver: zodResolver(adminProfileSchema),
    defaultValues,
  });

  function onSubmit(values: AdminProfileInput) {
    startTransition(async () => {
      const result = await updateAdminProfile(values);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("Profile updated.");
      router.refresh();
    });
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Account details</CardTitle>
        <CardDescription>
          Update how your name appears across the admin console
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-2">
                <label className="text-sm font-medium">Email</label>
                <Input value={email} disabled readOnly />
                <p className="text-xs text-muted-foreground">
                  Login email cannot be changed here.
                </p>
              </div>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+880…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
