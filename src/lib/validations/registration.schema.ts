import { z } from 'zod';

const IDENTIFICATION_TYPES = ['CC', 'TI', 'CE', 'PA', 'NIT', 'PPT', 'PEP'] as const;

export const registrationSchema = z
    .object({
        identificationType: z.enum(IDENTIFICATION_TYPES, {
            message: 'Selecciona un tipo de identificación',
        }),
        identificationNumber: z.string().min(1, 'Obligatorio'),
        fullName: z.string().min(1, 'Obligatorio'),
        email: z.string().min(1, 'Obligatorio').email('Correo inválido'),
        phone: z.string().optional(),
        complexName: z.string().min(1, 'Obligatorio'),
        complexAddress: z.string().min(1, 'Obligatorio'),
        complexCity: z.string().min(1, 'Obligatorio'),
        password: z.string().min(8, 'Mínimo 8 caracteres'),
        confirmPassword: z.string().min(1, 'Obligatorio'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
export { IDENTIFICATION_TYPES };