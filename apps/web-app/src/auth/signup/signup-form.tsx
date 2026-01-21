'use client'
import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils"
import Image from "next/image";


import { BsEyeSlashFill, BsFillEyeFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"


export function SignupForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"form">) {

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const [ConfirmSginUp, setConfirmSginUp] = useState(false);

    const handlesingUp = async () => {
        try {
            const { isSignUpComplete, userId, nextStep } = await signUp({
                username: email,
                password,
                options: {
                    userAttributes: {
                        email,
                    },
                    // optional
                    autoSignIn: true // or SignInOptions e.g { authFlowType: "USER_SRP_AUTH" }
                }
            });

            if (isSignUpComplete) {
                console.log('user has been signed up');
                // redirect to the next step
                router.push('/Signup');
                return;
            }

            else if (nextStep) {
                console.log('next step is required:', nextStep);
                // handle the next steps
                if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
                    // you need to get the confirmation code to confirm the sign up
                    // you can do this by redirecting the user to the confirm sign up page
                    setConfirmSginUp(true);
                    //rerender the page
                    // router.push('/Signup');
                    return;
                }
            }


            console.log(userId);
        } catch (error) {
            console.log('error signing up:', error);
        }
    }


    const handleConfirmSignUp = async () => {
        try {

            await confirmSignUp({ username: email, confirmationCode: otp });

            console.log('user has been confirmed');

            // redirect to the next step
            router.push('/Signup');

        } catch (error) {
            console.log('error signing in:', error);
        }
    }
    return (
        <>
            {!ConfirmSginUp ? (
                <form className={cn("flex flex-col gap-6", className)} {...props}>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-2xl font-bold">Everything Starts Here!</h1>
                        <p className="text-balance text-sm text-muted-foreground">
                            Sign up to get started with AetherLabs
                        </p>
                    </div>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <a
                                    href="#"
                                    className="ml-auto text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <div className="relative w-full flex items-center">
                                <Input
                                    type={isVisible ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-12 rounded-xl pr-12" // Ensure there is padding to not overlap the icon
                                />
                                <Button
                                    onClick={toggleVisibility}
                                    className="absolute right-0 inset-y-0 h-12 w-12 flex items-center justify-center rounded-xl"
                                    aria-label="Toggle password visibility"  // Accessibility improvement
                                    variant="ghost"
                                >
                                    {isVisible ? <BsFillEyeFill /> : <BsEyeSlashFill />}
                                </Button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" onClick={handlesingUp}>
                            Create Account
                        </Button>
                        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                            <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                        <div className="grid gap-2">
                            <Button variant="outline" className="w-full">
                                <Image
                                    src="/apple-logo.png"
                                    alt="Apple logo"
                                    width={20}
                                    height={20}
                                    className="mr-2"
                                />
                                Signup with Apple
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Image
                                    src="/google.png"
                                    alt="Apple logo"
                                    width={20}
                                    height={20}
                                    className="mr-2"
                                />
                                Signup with Google
                            </Button>
                        </div>

                    </div>
                    <div className="text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <a href="/login" className="underline underline-offset-4">
                            Login
                        </a>
                    </div>
                </form>) : (
                <Card className="p-6 md:w-96 flex flex-col justify-center items-center">
                    <InputOTP maxLength={6}
                        value={otp}
                        onChange={(otp) => setOtp(otp)}
                        onComplete={handleConfirmSignUp}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>

                </Card>
            )
            }
        </>
    );
}


