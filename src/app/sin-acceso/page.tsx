import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function NoAccessPage() {
    return (
        <div className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>No tienes acceso a Faro</CardTitle>

                    <CardDescription>
                        Tu cuenta fue autenticada correctamente, pero actualmente
                        no tienes una membresía activa que te permita acceder a
                        un conjunto residencial.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Button className="w-full">
                        <Link href="/login">
                            Volver al inicio de sesión
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}