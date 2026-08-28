import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
    return (
        <section className="mx-auto max-w-3xl px-6 py-24 text-center">
            <h1 className="text-display text-balance">
                Administra tu copropiedad sin perder el control de nada
            </h1>
            <p className="text-body-l text-muted-foreground mx-auto mt-4 max-w-xl text-balance">
                Faro centraliza estructura, personas, accesos y finanzas de tu copropiedad en un solo
                lugar — hecho para administradores que no tienen tiempo que perder.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
                <Button size="lg">
                    <Link href="#planes">Ver planes</Link>
                </Button>
                <Button size="lg" variant="outline">
                    <Link href="/login">Ya tengo cuenta</Link>
                </Button>
            </div>
        </section>
    );
}