"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Code, Check, ChevronRight } from "lucide-react";
import { COURSES } from "@/lib/constants";
import { useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export default function CurriculumPage() {
    // We'll use the courses as the source of truth for curriculums now.
    // Filter courses that have a curriculum or simply all courses.
    const coursesWithCurriculum = COURSES.filter(c => c.curiculum && c.curiculum.length > 0);
    const [selectedCourse, setSelectedCourse] = useState(coursesWithCurriculum[0] || COURSES[0]);

    if (!selectedCourse) {
        return <div className="p-20 text-center">No courses found.</div>;
    }

    return (
        <div className="min-h-screen pb-20 pt-12">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Intensive Bootcamp</span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Kurikulum Pembelajaran</h1>
                    <p className="text-muted-foreground text-xl leading-relaxed">
                        Pilih program spesialisasi yang sesuai dengan tujuan karirmu.
                        Setiap program dirancang intensif untuk mencetak talenta digital siap kerja.
                    </p>
                </div>

                {/* Program Selector Carousel */}
                <div className="max-w-5xl mx-auto mb-16 px-12">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {coursesWithCurriculum.map((course) => (
                                <CarouselItem key={course.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                                    <div className="p-1 h-full">
                                        <Card
                                            className={cn(
                                                "cursor-pointer transition-all duration-300 hover:shadow-md h-full border-2",
                                                selectedCourse.id === course.id
                                                    ? "border-primary bg-primary/5 shadow-md"
                                                    : "border-transparent bg-secondary/20 hover:border-primary/50"
                                            )}
                                            onClick={() => setSelectedCourse(course)}
                                        >
                                            <CardHeader className="p-4 pb-2">
                                                <div className="flex justify-between items-start">
                                                    <Badge variant={selectedCourse.id === course.id ? "default" : "secondary"} className="mb-2">
                                                        {selectedCourse.id === course.id ? "Selected" : "Course"}
                                                    </Badge>
                                                    {selectedCourse.id === course.id && <Check className="h-4 w-4 text-primary" />}
                                                </div>
                                                <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-2">
                                                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                                    {course.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="-left-4 lg:-left-12" />
                        <CarouselNext className="-right-4 lg:-right-12" />
                    </Carousel>
                </div>

                {/* Selected Curriculum Details */}
                <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 key={selectedCourse.id}">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-primary mb-2">{selectedCourse.title}</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">{selectedCourse.garis_besar || selectedCourse.description}</p>
                    </div>

                    <div className="grid gap-8 max-w-4xl mx-auto relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute left-8 top-8 bottom-8 w-0.5 bg-border/50" />

                        {selectedCourse.curiculum.length === 0 ? (
                            <div className="text-center py-10 border rounded-lg bg-muted/20 md:ml-24">
                                <p className="text-muted-foreground">Belum ada data kurikulum detail untuk kelas ini.</p>
                            </div>
                        ) : (
                            selectedCourse.curiculum.map((item, index) => (
                                <div key={item.id} className="relative group">
                                    {/* Number Badge */}
                                    <div className="hidden md:flex absolute left-0 top-0 h-16 w-16 items-center justify-center rounded-full bg-background border-4 border-primary/10 text-xl font-bold text-primary group-hover:border-primary transition-colors z-10 shadow-sm">
                                        {index + 1}
                                    </div>

                                    <Card className="md:ml-24 transition-all duration-300 hover:shadow-lg border-primary/5 hover:border-primary/20">
                                        <CardHeader>
                                            <div className="flex items-center gap-3 mb-2">
                                                <Badge variant="secondary" className="md:hidden w-fit">Pertemuan {index + 1}</Badge>
                                                <div className="p-2 bg-primary/10 rounded-md">
                                                    <Code className="h-5 w-5 text-primary" />
                                                </div>
                                            </div>
                                            <CardTitle className="text-xl md:text-2xl">{item.name}</CardTitle>
                                            <CardDescription className="text-base mt-2">
                                                {item.description}
                                            </CardDescription>
                                        </CardHeader>
                                        {/* Since the new curriculum model is simpler, we don't have nested topics. 
                                            We can hide the content area or use it if we add more details later. 
                                            For now, we can show a placeholder or remove it. 
                                            Let's optional render if there's more info in description or add a generic "Topics" placeholder if needed, 
                                            but based on struct, there are no separate topics. 
                                        */}
                                    </Card>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

