import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

export function Testimonials() {
    const testimonials = [
        {
            name: "Budi Santoso",
            role: "Backend Engineer di Gojek",
            content: "Kelas Santai benar-benar mengubah karir saya. Materinya daging semua tapi pembawaannya santai, jadi gak stress belajarnya.",
            avatar: "B"
        },
        {
            name: "Siti Aminah",
            role: "Digital Marketer di Shopee",
            content: "Mentornya sangat suportif. Saya yang awalnya gaptek sekarang bisa manage campaign iklan jutaan rupiah.",
            avatar: "S"
        },
        {
            name: "Andi Pratama",
            role: "Freelance UI/UX Designer",
            content: "Portofolio yang saya bangun di sini membantu saya mendapatkan klien pertama dari luar negeri. Worth it banget!",
            avatar: "A"
        }
    ];

    return (
        <section className="py-24 bg-card/50">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl font-bold text-center mb-12">Apa Kata Alumni?</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <Card key={i} className="bg-background border-none shadow-lg shadow-primary/5">
                            <CardContent className="pt-6 relative">
                                <Quote className="absolute top-6 left-6 h-8 w-8 text-primary/20 rotate-180" />
                                <p className="text-muted-foreground mb-6 pl-8 italic relative z-10">
                                    "{t.content}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border border-primary/20">
                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${t.name}`} />
                                        <AvatarFallback>{t.avatar}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-sm">{t.name}</p>
                                        <p className="text-xs text-muted-foreground">{t.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
