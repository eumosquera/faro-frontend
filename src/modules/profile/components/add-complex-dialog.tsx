'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { useAddResidentialComplex } from '../hooks/use-add-residential-complex';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ApiError } from '@/app/api/client';

export function AddComplexDialog() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState<string | null>(null);

    const { mutate, isPending } = useAddResidentialComplex();

    function resetForm() {
        setName('');
        setAddress('');
        setCity('');
        setError(null);
    }

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setError(null);

        mutate(
            { name, address, city },
            {
                onSuccess: () => {
                    setOpen(false);
                    resetForm();
                },
                onError: (err) => {
                    setError(
                        err instanceof ApiError
                            ? err.message
                            : 'No se pudo agregar la copropiedad. Intenta de nuevo.',
                    );
                },
            },
        );
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (!next) resetForm();
            }}
        >
            <DialogTrigger >
                <Button size="sm" variant="outline">
                    <Plus className="size-4" />
                    Agregar copropiedad
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Nueva copropiedad</DialogTitle>
                        <DialogDescription>
                            Se creará con tu cuenta como Administrador, dentro del límite de tu plan actual.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="complex-name">Nombre</Label>
                            <Input
                                id="complex-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="complex-address">Dirección</Label>
                            <Input
                                id="complex-address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="complex-city">Ciudad</Label>
                            <Input
                                id="complex-city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Creando...' : 'Crear copropiedad'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}