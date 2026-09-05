'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth.schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [authError, setAuthError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(values: LoginFormValues) {
        setAuthError(null);
        const supabase = createClient();

        const { error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
        });

        if (error) {
            // Mensaje genérico a propósito: no revelar si fue el correo o la
            // contraseña lo que falló.
            setAuthError('Correo o contraseña incorrectos.');
            return;
        }

        const redirectTo = searchParams.get('redirectTo') ?? '/inicio';
        router.push(redirectTo);
        router.refresh(); // fuerza a que el middleware/Server Components relean la sesión
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-h3">Iniciar sesión</CardTitle>
                <CardDescription>Ingresa a tu cuenta de Faro</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    {authError && (
                        <Alert variant="destructive">
                            <AlertDescription>{authError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            aria-invalid={!!errors.email}
                            {...register('email')}
                        />
                        {errors.email && (
                            <p className="text-caption text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            aria-invalid={!!errors.password}
                            {...register('password')}
                        />
                        {errors.password && (
                            <p className="text-caption text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Ingresando...' : 'Ingresar'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}