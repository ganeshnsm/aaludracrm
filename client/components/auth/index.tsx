"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
    loginAction,
    signupAction,
    type AuthFormState,
} from "@/app/actions/auth";

type Mode = "login" | "signup";

interface AuthComponentProps {
    mode: Mode;
    title: string;
    buttonName: string;
}

const initialState: AuthFormState = {};

const AuthComponent: React.FC<AuthComponentProps> = ({ mode, title, buttonName }) => {
    const action = mode === "login" ? loginAction : signupAction;
    const [state, formAction, pending] = useActionState(action, initialState);

    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
            <form
                action={formAction}
                className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-8 shadow"
            >
                <h1 className="text-3xl font-semibold tracking-tight text-black">
                    {title}
                </h1>

                {mode === "signup" && (
                    <Field
                        name="name"
                        label="Name"
                        type="text"
                        autoComplete="name"
                        error={state.fieldErrors?.name}
                    />
                )}

                <Field
                    name="email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    error={state.fieldErrors?.email}
                />

                <Field
                    name="password"
                    label="Password"
                    type="password"
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    error={state.fieldErrors?.password}
                />

                {mode === "signup" && (
                    <Field
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        autoComplete="new-password"
                        error={state.fieldErrors?.confirmPassword}
                    />
                )}

                {state.error && (
                    <p className="text-sm text-red-600" role="alert">
                        {state.error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={pending}
                    className="flex h-12 w-full items-center justify-center rounded-full bg-black px-5 text-white transition-colors hover:bg-zinc-800 disabled:opacity-60"
                >
                    {pending ? "Please wait…" : buttonName}
                </button>

                <p className="text-center text-sm text-zinc-600">
                    {mode === "login" ? (
                        <>
                            No account?{" "}
                            <Link href="/signup" className="font-medium text-black underline">
                                Sign up
                            </Link>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-black underline">
                                Log in
                            </Link>
                        </>
                    )}
                </p>
            </form>
        </div>
    );
};

interface FieldProps {
    name: string;
    label: string;
    type: string;
    autoComplete: string;
    error?: string;
}

const Field: React.FC<FieldProps> = ({ name, label, type, autoComplete, error }) => (
    <label className="flex flex-col gap-1 text-sm text-zinc-800">
        <span className="font-medium">{label}</span>
        <input
            name={name}
            type={type}
            autoComplete={autoComplete}
            required
            className="rounded border border-zinc-300 bg-white p-3 text-black outline-none focus:border-black"
        />
        {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
);

export default AuthComponent;
