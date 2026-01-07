import { CourseList } from "@/components/home/course-list";

export default function CoursesPage() {
    return (
        <div className="pt-8 pb-20">
            <div className="container mx-auto px-4 mb-8">
                <h1 className="text-3xl font-bold mb-2">Katalog Kelas</h1>
                <p className="text-muted-foreground">Jelajahi semua kelas yang tersedia dan mulai belajar hari ini.</p>
            </div>
            <CourseList />
        </div>
    );
}
