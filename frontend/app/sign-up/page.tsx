import SignUpForm from "@/components/sign-up-form"

export default function SignUpPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <SignUpForm />
            </div>
        </div>
    )
}
