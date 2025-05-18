import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createStoreService, createAccountService } from "@/services/admin.service";
import storeSchema from "@/schemas/store.schema";
import userSchema, { type User } from "@/schemas/user.schema";


const CreateStore = () => {
  const [step, setStep] = useState(1);
  const [storeOwnerId, setStoreOwnerId] = useState<string>("");
  const navigate = useNavigate();

  const userForm = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      address: "",
      role: "STORE_OWNER",
    },
  });

  const storeForm = useForm<z.infer<typeof storeSchema>>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  const onSubmitUser = async (data: User) => {
    try {
      const user = await createAccountService(data);
      setStoreOwnerId(user.data.user.id);
      setStep(2);
      
    } catch (error) {
      console.log({ title: "Failed to create store owner", variant: "destructive" });
    }
  };

  const onSubmitStore = async (data: z.infer<typeof storeSchema>) => {
    try {
      if (!storeOwnerId) throw new Error("Missing user ID");
      await createStoreService({ ...data, userId: storeOwnerId });
      navigate("/admin/dashboard");
    } catch (error) {
      console.log({ title: "Failed to create store", variant: "destructive" });
    }
  };

  useEffect(() => {
    setStep(1);
  }, []);

  return (
    <Card className="max-w-xl mx-auto mt-10 border shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {step === 1 ? "Create Store Owner" : "Create Store"}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {step === 1 && (
          <Form {...userForm}>
            <form
              onSubmit={userForm.handleSubmit(onSubmitUser)}
              className="space-y-5"
            >
              <FormField
                control={userForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <input type="hidden" {...userForm.register("role")} value="STORE_OWNER" />

              <Button type="submit" className="w-full cursor-pointer" disabled={userForm.formState.isSubmitting}>
                {userForm.formState.isSubmitting ? "Creating Store Owner..." : "Create Store Owner"}
              </Button>
            </form>
          </Form>
        )}

        {step === 2 && (
          <Form {...storeForm}>
            <form
              onSubmit={storeForm.handleSubmit(onSubmitStore)}
              className="space-y-5"
            >
              <FormField
                control={storeForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={storeForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Address</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full cursor-pointer" disabled={storeForm.formState.isSubmitting}>
                {storeForm.formState.isSubmitting ? "Creating Store..." : "Create Store"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default CreateStore;
