import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Construction } from "lucide-react";

export default function PlaceholderPage({ title, description }: { title: string, description: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <div className="bg-primary/10 p-6 rounded-full mb-6">
                <Construction className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-muted-foreground text-lg max-w-md mb-8">
                {description}
            </p>
            <Link href="/">
                <Button size="lg">Kembali ke Beranda</Button>
            </Link>
        </div>
    );
}
