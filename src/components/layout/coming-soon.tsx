import { Construction } from 'lucide-react';

export function ComingSoon({ title, description }: { title: string; description: string }) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-h1">{title}</h1>
                <p className="text-body text-muted-foreground">{description}</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16">
                <Construction className="text-muted-foreground size-8" />
                <p className="text-body-s text-muted-foreground">Esta sección está en construcción.</p>
            </div>
        </div>
    );
}