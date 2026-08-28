'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';
import { getActivePlans, type Plan } from '@/lib/api/public-client';
import {
    registerTenant,
    OnboardingError,
    type BackendBillingCycle,
} from '@/lib/api/onboarding-client';
import {
    registrationSchema,
    IDENTIFICATION_TYPES,
    type RegistrationFormValues,
} from '@/lib/validations/registration.schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
});

const CYCLE_TO_BACKEND: Record<string, BackendBillingCycle> = {
    monthly: 'MONTHLY',
    quarterly: 'QUARTERLY',
    yearly: 'YEARLY',
};

const CYCLE_LABEL: Record<string, string> = {
    monthly: 'Mensual',
    quarterly: 'Trimestral',
    yearly: 'Anual',
};

const CYCLE_PRICE_FIELD: Record<string, keyof Plan> = {
    monthly: 'monthlyPrice',
    quarterly: 'quarterlyPrice',
    yearly: 'yearlyPrice',
};

export function RegistrationForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const planCode = searchParams.get('plan') ?? '';
    const cycleParam = searchParams.get('ciclo') ?? 'monthly';

    const [plan, setPlan] = useState<Plan | null>(null);
    const [loadingPlan, setLoadingPlan] = useState(true);
    const [planLoadError, setPlanLoadError] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [emailConfirmationPending, setEmailConfirmationPending] = useState(false);

    useEffect(() => {
        getActivePlans()
            .then((plans) => {
                const found = plans.find((p) => p.code === planCode) ?? null;
                setPlan(found);
            })
            .catch(() => setPlanLoadError(true))
            .finally(() => setLoadingPlan(false));
    }, [planCode]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<RegistrationFormValues>({
        resolver: zodResolver(registrationSchema),
    });

    async function onSubmit(values: RegistrationFormValues) {
        setSubmitError(null);

        if (!plan) {
            setSubmitError('No se encontró el plan seleccionado. Vuelve a la página de precios.');
            return;
        }

        const supabase = createClient();

        // 1. Crear el usuario en Supabase Auth (credenciales de login).
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
        });

        if (signUpError || !signUpData.user) {
            setSubmitError(
                signUpError?.message === 'User already registered'
                    ? 'Ya existe una cuenta con ese correo. Intenta iniciar sesión.'
                    : 'No se pudo crear la cuenta. Intenta de nuevo.',
            );
            return;
        }

        // 2. Orquestar el registro del tenant en el backend (Person, ResidentialComplex,
        //    AccessAccount, Subscription, Membership Administrador).
        try {
            await registerTenant({
                externalAuthId: signUpData.user.id,
                person: {
                    identificationType: values.identificationType,
                    identificationNumber: values.identificationNumber,
                    fullName: values.fullName,
                    email: values.email,
                    phone: values.phone || undefined,
                },
                residentialComplex: {
                    name: values.complexName,
                    address: values.complexAddress,
                    city: values.complexCity,
                },
                planCode: plan.code,
                billingCycle: CYCLE_TO_BACKEND[cycleParam] ?? 'MONTHLY',
            });
        } catch (error) {
            // El usuario de Supabase ya quedó creado aunque esto falle — no hay
            // rollback automático. Mostramos el error tal cual para que puedas
            // decidir manualmente (o reintentar con el mismo correo más adelante,
            // una vez el backend soporte reintentos de onboarding).
            const message =
                error instanceof OnboardingError
                    ? error.message
                    : 'No se pudo completar el registro de la copropiedad.';
            setSubmitError(message);
            return;
        }

        // 3. Si Supabase requiere confirmación de correo, no hay sesión todavía.
        if (!signUpData.session) {
            setEmailConfirmationPending(true);
            return;
        }

        router.push('/dashboard');
        router.refresh();
    }

    if (emailConfirmationPending) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-h3">Revisa tu correo</CardTitle>
                    <CardDescription>
                        Te enviamos un enlace de confirmación. Una vez confirmes tu cuenta, podrás iniciar
                        sesión y entrar a tu panel de administrador.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (loadingPlan) {
        return (
            <Card className="w-full max-w-md">
                <CardContent className="py-10 text-center">
                    <p className="text-body-s text-muted-foreground">Cargando plan...</p>
                </CardContent>
            </Card>
        );
    }

    if (planLoadError) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-h3">No pudimos cargar los planes</CardTitle>
                    <CardDescription>
                        Hubo un problema de conexión con el servidor. Intenta recargar la página.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (!plan) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-h3">Plan no encontrado</CardTitle>
                    <CardDescription>
                        El plan que intentas contratar no existe o ya no está disponible.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full">
                        <a href="/#planes">Volver a los planes</a>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="text-h3">Crea tu cuenta</CardTitle>
                <CardDescription>
                    {plan && (
                        <>
                            Plan <strong>{plan.name}</strong> ·{' '}
                            {currencyFormatter.format(plan[CYCLE_PRICE_FIELD[cycleParam]] as number)}{' '}
                            {CYCLE_LABEL[cycleParam]?.toLowerCase()}
                        </>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                    {submitError && (
                        <Alert variant="destructive">
                            <AlertDescription>{submitError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-body-s text-muted-foreground font-medium uppercase tracking-wide">
                            Tus datos
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="identificationType">Tipo de identificación</Label>
                                <Select onValueChange={(value) => setValue('identificationType', value as never)}>
                                    <SelectTrigger id="identificationType">
                                        <SelectValue placeholder="Selecciona" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {IDENTIFICATION_TYPES.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.identificationType && (
                                    <p className="text-caption text-destructive">
                                        {errors.identificationType.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="identificationNumber">Número de identificación</Label>
                                <Input id="identificationNumber" {...register('identificationNumber')} />
                                {errors.identificationNumber && (
                                    <p className="text-caption text-destructive">
                                        {errors.identificationNumber.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fullName">Nombre completo</Label>
                            <Input id="fullName" {...register('fullName')} />
                            {errors.fullName && (
                                <p className="text-caption text-destructive">{errors.fullName.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input id="email" type="email" autoComplete="email" {...register('email')} />
                                {errors.email && (
                                    <p className="text-caption text-destructive">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono (opcional)</Label>
                                <Input id="phone" type="tel" {...register('phone')} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-body-s text-muted-foreground font-medium uppercase tracking-wide">
                            Tu copropiedad
                        </h3>
                        <div className="space-y-2">
                            <Label htmlFor="complexName">Nombre de la copropiedad</Label>
                            <Input id="complexName" {...register('complexName')} />
                            {errors.complexName && (
                                <p className="text-caption text-destructive">{errors.complexName.message}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="complexAddress">Dirección</Label>
                                <Input id="complexAddress" {...register('complexAddress')} />
                                {errors.complexAddress && (
                                    <p className="text-caption text-destructive">
                                        {errors.complexAddress.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="complexCity">Ciudad</Label>
                                <Input id="complexCity" {...register('complexCity')} />
                                {errors.complexCity && (
                                    <p className="text-caption text-destructive">{errors.complexCity.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-body-s text-muted-foreground font-medium uppercase tracking-wide">
                            Contraseña
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    {...register('password')}
                                />
                                {errors.password && (
                                    <p className="text-caption text-destructive">{errors.password.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    {...register('confirmPassword')}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-caption text-destructive">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || !plan}>
                        {isSubmitting ? 'Creando tu cuenta...' : 'Crear cuenta y continuar'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}