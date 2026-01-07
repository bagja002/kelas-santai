import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-background py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                    <div className="flex flex-col justify-center space-y-8 animate-in slide-in-from-left-10 duration-700 fade-in text-center md:text-left items-center md:items-start">
                        <div className="space-y-4 flex flex-col items-center md:items-start">
                            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                                <Sparkles className="mr-2 h-3.5 w-3.5" />
                                Belajar Santai, Hasil Maksimal
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl">
                                Upgrade Skill <br />
                                <span className="text-primary italic">Tanpa Stress.</span>
                            </h1>
                            <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl leading-relaxed">
                                Platform belajar online fleksibel dengan materi berkualitas. <br />
                                <span className="font-semibold text-foreground">Akses selamanya, belajar kapan saja.</span>
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 w-full sm:w-auto sm:flex-row pt-2 justify-center md:justify-start">
                            <Link href="#courses" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto bg-primary text-white h-14 px-8 text-lg hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-full">
                                    Mulai Belajar Sekarang
                                </Button>
                            </Link>
                            <Link href="#about" className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg border-primary/20 hover:bg-primary/5 text-foreground rounded-full">
                                    Lihat Silabus
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground justify-center md:justify-start">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-zinc-200" style={{ backgroundImage: `url(https://i.pravatar.cc/100?u=${i})`, backgroundSize: 'cover' }} />
                                ))}
                            </div>
                            <p>Bergabung dengan <span className="font-bold text-foreground">5,000+</span> member lainnya.</p>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full lg:max-w-none animate-in slide-in-from-right-10 duration-1000 fade-in">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl shadow-primary/10 bg-zinc-100 ring-1 ring-zinc-900/5">
                            <Image
                                src="/images/hero_study_cafe_1767037248518.png"
                                alt="Cozy study environment"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent mix-blend-overlay"></div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -left-6 hidden md:flex items-center gap-3 rounded-xl bg-background p-4 shadow-xl border border-border animate-bounce-slow">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-foreground">Sertifikat Kelulusan</p>
                                <p className="text-xs text-muted-foreground">Untuk Tiap Kelas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
