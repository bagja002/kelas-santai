import { Coffee } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t bg-background py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1">
                            <img src="/images/logo-ks.png" alt="Logo" className="h-full w-full object-contain" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground">
                            Kelas Santai
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                        &copy; {new Date().getFullYear()} Kelas Santai. Belajar dengan tenang, hasil gemilang.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">
                            Terms
                        </Link>
                        <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">
                            Privacy
                        </Link>
                        <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
