import { Hero } from '@/components/home/hero';
import { CourseList } from '@/components/home/course-list';
import { Testimonials } from '@/components/home/testimonials';

export default function Home() {
  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <CourseList />
      <Testimonials />

      {/* Additional "Why Choose Us" Section for extra content */}
      <section id="about" className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-secondary/20 border border-border">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary text-2xl">
                🚀
              </div>
              <h3 className="text-xl font-bold mb-2">Akses Seumur Hidup</h3>
              <p className="text-muted-foreground">Bayar sekali, akses materi selamanya. Update gratis.</p>
            </div>
            <div className="p-6 rounded-2xl bg-secondary/20 border border-border">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary text-2xl">
                🤝
              </div>
              <h3 className="text-xl font-bold mb-2">Mentor Praktisi</h3>
              <p className="text-muted-foreground">Belajar langsung dari mereka yang sudah berpengalaman di industri.</p>
            </div>
            <div className="p-6 rounded-2xl bg-secondary/20 border border-border">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary text-2xl">
                🏆
              </div>
              <h3 className="text-xl font-bold mb-2">Sertifikat Kompetensi</h3>
              <p className="text-muted-foreground">Tunjukkan keahlianmu dengan sertifikat resmi dari Kelas Santai.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
