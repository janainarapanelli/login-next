'use client';

import { useActionState, useEffect, useRef } from 'react';

interface LoginFormProps {
    loginAction: (prevState: { error?: string } | void, formData: FormData) => Promise<{ error?: string } | void>;
}

export default function LoginForm({ loginAction }: LoginFormProps) {
    const [state, formAction] = useActionState(loginAction, undefined);
    const formRef = useRef<HTMLFormElement>(null);

    // Limpar form após erro para permitir nova tentativa
    useEffect(() => {
        if (state?.error) {
            formRef.current?.reset();
        }
    }, [state?.error]);

    return (
        <>
            <form ref={formRef} action={formAction}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    defaultValue="emilys"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    defaultValue="emilyspass"
                    required
                />
                <button type="submit">Login</button>
            </form>
            {state?.error && <p style={{ color: "red" }}>{state.error}</p>}
        </>
    );
}
