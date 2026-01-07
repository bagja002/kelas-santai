"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Coffee, ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";

// ... imports ...
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotPasswordSchema = z.object({
    email: z.string().email("Format email tidak valid"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Forgot Password data:", data);
        setIsLoading(false);
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-2xl shadow-primary/10 border-border/50">
                <CardHeader className="space-y-1 text-center">
                    <Link href="/login" className="absolute top-4 left-4 text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <div className="flex justify-center mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <Coffee className="h-6 w-6" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Lupa Password?</CardTitle>
                    <CardDescription>
                        Masukkan email anda, kami akan mengirimkan link untuk reset password.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@contoh.com"
                                {...register("email")}
                                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>
                        <Button className="w-full bg-primary text-white hover:bg-primary/90" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Kirim Link Reset
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <div className="text-center text-sm text-muted-foreground">
                        Sudah ingat password?{" "}
                        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                            Masuk
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
