'use client';
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { signIn } from 'aws-amplify/auth';
import { Label } from "@/components/ui/label";
import { BsEyeSlashFill, BsFillEyeFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import Image from "next/image";
export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    //not being used

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState<string>(""); // Error state with explicit string type
    const [loading, setLoading] = useState(false); // Loading state

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent form submission reload
        setError("");
        setLoading(true);

        try {
            const { isSignedIn, nextStep } = await signIn({ username: email, password });

            if (isSignedIn) {
                router.push("/");
            } else {
                console.log('next step', nextStep);
            }

            if (nextStep?.signInStep === 'DONE') {
                router.push('/dashboard');
                return;
            }
        } catch (error: unknown) {
            console.log('error signing in', error);
            if (error instanceof Error && 'code' in error) {
                const authError = error as { code: string };
                switch (authError.code) {
                    case 'UserNotFoundException':
                        setError("Account doesn't exist");
                        break;
                    case 'NotAuthorizedException':
                        setError("Incorrect username or password");
                        break;
                    default:
                        setError("An unknown error occurred, please try again");
                        break;
                }
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <div className="relative hidden bg-muted md:block">
                        <Image
                            src="/aetherhero1.png"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                            width={500}
                            height={500}
                        />
                    </div>
                    <form className="p-6 md:p-8" onSubmit={handleLogin}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Welcome back</h1>
                                <p className="text-balance text-muted-foreground">
                                    Login to your AetherLabs account
                                </p>
                            </div>
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
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
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
                                    <button
                                        onClick={toggleVisibility}
                                        className="absolute right-0 inset-y-0 h-12 w-12 flex items-center justify-center rounded-xl"
                                        aria-label="Toggle password visibility"  // Accessibility improvement
                                    >
                                        {isVisible ? <BsFillEyeFill /> : <BsEyeSlashFill />}
                                    </button>
                                </div>

                            </div>
                            {error && <p className="text-red-500 mb-4">{error}</p>}
                            <Button
                                className="mt-4 w-full h-12 text-lg font-bold rounded-full"
                                onClick={handleLogin}
                                disabled={loading} // Disable button when loading
                            >
                                Login
                            </Button>
                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="w-full">
                                    <Image
                                        src="/google.png"
                                        alt="Apple Logo"
                                        width={24}
                                        height={24}
                                    />
                                    <span className="sr-only">Login with Apple</span>
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <Image
                                        src="/apple-logo.png"
                                        alt="Apple Logo"
                                        width={24}
                                        height={24}
                                    />
                                    <span className="sr-only">Login with Google</span>
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <a href="/signup" className="underline underline-offset-4">
                                    Sign up
                                </a>
                            </div>
                        </div>
                    </form>

                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By clicking continue, you agree to our <a href="/terms">Terms of Service</a>{" "}
                and <a href="/privacy">Privacy Policy</a>.
            </div>
        </div>
    )
}
