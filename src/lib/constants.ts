
export interface Curiculum {
    id: string; // uuid
    course_id: string; // uuid
    name: string;
    description: string;
    created_at?: string;
    updated_at?: string;
}

export interface Course {
    id: string; // uuid
    mentor_id: string; // uuid
    name: string;
    title: string;
    description: string;
    price: number;
    level: string;
    rating: number;
    category: string;
    picture: string;
    duration: string;
    total_jp: number;
    mentor?: string; // KEEPing for mock data backward compatibility if needed, but API uses mentor_name
    mentor_name?: string; // From API
    start_date: string;
    end_date: string;
    silabus: string;
    garis_besar: string;
    status: string;
    curiculum: Curiculum[];
    created_at?: string;
    updated_at?: string;
}

export interface Mentor {
    id: string;
    name: string;
    avatar: string;
    email: string;
    gelar_depan?: string;
    gelar_belakang?: string;
    created_at?: string;
    updated_at?: string;
}

export const MENTORS: Mentor[] = [
    {
        id: "1",
        name: "Rizky Ramadhan",
        email: "rizky@kelassantai.com",
        gelar_depan: "Ir.",
        gelar_belakang: "M.Kom",
        avatar: "https://i.pravatar.cc/150?u=rizky",
    },
    {
        id: "2",
        name: "Sarah Wijaya",
        email: "sarah@kelassantai.com",
        gelar_depan: "",
        gelar_belakang: "S.Ds",
        avatar: "https://i.pravatar.cc/150?u=sarah",
    },
    {
        id: "3",
        name: "Budi Santoso",
        email: "budi@kelassantai.com",
        gelar_depan: "Dr.",
        gelar_belakang: "S.E., M.M.",
        avatar: "https://i.pravatar.cc/150?u=budi",
    },
];

export const COURSES: Course[] = [
    {
        id: "9a537bca-6e86-4bad-a4f6-b0b3c69010ba",
        mentor_id: "1",
        name: "Mastering React.js & Next.js",
        title: "Mastering React.js & Next.js",
        description: "Build modern, scalable web applications with the latest React ecosystem. Includes Server Components, Suspense, and more.",
        price: 499000,
        level: "Intermediate",
        rating: 4.8,
        category: "Programming",
        picture: "/images/course_coding_coffee_1767037262713.png",
        duration: "8 Weeks",
        total_jp: 32,
        mentor: "Rizky Ramadhan",
        start_date: "2024-02-01",
        end_date: "2024-03-28",
        silabus: "React Fundamentals, Hooks, Next.js App Router, Server Actions, Deployment",
        garis_besar: "Course ini dirancang untuk membawa Anda dari dasar hingga mahir dalam ekosistem React modern.",
        status: "published",
        curiculum: [
            {
                id: "c1",
                course_id: "9a537bca-6e86-4bad-a4f6-b0b3c69010ba",
                name: "Introduction to React",
                description: "Understanding Components, JSX, and Props"
            },
            {
                id: "c2",
                course_id: "9a537bca-6e86-4bad-a4f6-b0b3c69010ba",
                name: "Hooks Deep Dive",
                description: "useState, useEffect, and Custom Hooks"
            },
            {
                id: "c3",
                course_id: "9a537bca-6e86-4bad-a4f6-b0b3c69010ba",
                name: "Next.js Fundamentals",
                description: "App Router, Pages, and Layouts"
            },
            {
                id: "c4",
                course_id: "9a537bca-6e86-4bad-a4f6-b0b3c69010ba",
                name: "Server Components & Actions",
                description: "Data fetching and server-side logic"
            },
            {
                id: "c5",
                course_id: "9a537bca-6e86-4bad-a4f6-b0b3c69010ba",
                name: "Deployment & Optimization",
                description: "Vercel deployment, caching, and performance"
            }
        ]
    },
    {
        id: "2",
        mentor_id: "2",
        name: "UI/UX Design Fundamentals",
        title: "UI/UX Design Fundamentals",
        description: "Learn to design beautiful interfaces and user experiences. From wireframing to high-fidelity prototypes using Figma.",
        price: 399000,
        level: "Beginner",
        rating: 4.9,
        category: "Design",
        picture: "/images/course_uiux_design_1767037277518.png",
        duration: "6 Weeks",
        total_jp: 24,
        mentor: "Sarah Wijaya",
        start_date: "2024-02-15",
        end_date: "2024-03-30",
        silabus: "Design Thinking, Wireframing, Figma Proficiency, Prototyping",
        garis_besar: "Pelajari dasar-dasar desain UI/UX yang solid untuk membangun karir di industri kreatif.",
        status: "published",
        curiculum: [
            {
                id: "u1",
                course_id: "2",
                name: "Introduction to UI/UX",
                description: "Difference between UI and UX, Design Principles"
            },
            {
                id: "u2",
                course_id: "2",
                name: "User Research & Persona",
                description: "Understanding user needs and creating personas"
            },
            {
                id: "u3",
                course_id: "2",
                name: "Wireframing & Prototyping",
                description: "Low-fidelity wireframes to interactive prototypes"
            },
            {
                id: "u4",
                course_id: "2",
                name: "Figma Mastery",
                description: "Auto-layout, Components, and Variants"
            },
            {
                id: "u5",
                course_id: "2",
                name: "Design Systems",
                description: "Creating and maintaining consistent design languages"
            }
        ]
    },
    {
        id: "3",
        mentor_id: "3",
        name: "Digital Marketing Mastery",
        title: "Digital Marketing Mastery",
        description: "Dominate the digital landscape. Learn SEO, SEM, Social Media Marketing, and Analytics implementation.",
        price: 349000,
        level: "All Levels",
        rating: 4.7,
        category: "Marketing",
        picture: "/images/course_marketing_analytics_1767037293121.png",
        duration: "4 Weeks",
        total_jp: 16,
        mentor: "Budi Santoso",
        start_date: "2024-03-01",
        end_date: "2024-03-28",
        silabus: "SEO, Social Media Ads, Content Strategy, Analytics",
        garis_besar: "Strategi pemasaran digital komprehensif untuk bisnis modern.",
        status: "published",
        curiculum: [
            {
                id: "m1",
                course_id: "3",
                name: "Digital Marketing Strategy",
                description: "Funnel marketing and customer journey"
            },
            {
                id: "m2",
                course_id: "3",
                name: "SEO Fundamentals",
                description: "On-page and Off-page optimization"
            },
            {
                id: "m3",
                course_id: "3",
                name: "Social Media Marketing",
                description: "Content planning for Instagram and TikTok"
            },
            {
                id: "m4",
                course_id: "3",
                name: "Paid Advertising (Ads)",
                description: "Facebook Ads and Google Ads basics"
            },
            {
                id: "m5",
                course_id: "3",
                name: "Analytics & Reporting",
                description: "Reading data to make business decisions"
            }
        ]
    },
    {
        id: "4",
        mentor_id: "1",
        name: "Fullstack Python Bootcamp",
        title: "Fullstack Python Bootcamp",
        description: "From Zero to Hero in Python. specific focus on Django and FastAPI for building robust backend systems.",
        price: 599000,
        level: "Beginner to Advanced",
        rating: 4.8,
        category: "Programming",
        picture: "/images/course_coding_coffee_1767037262713.png",
        duration: "10 Weeks",
        total_jp: 40,
        mentor: "Andi Pratama",
        start_date: "2024-02-10",
        end_date: "2024-04-20",
        silabus: "Python Basics, OOP, Django, FastAPI, Deployment",
        garis_besar: "Program intensif untuk menjadi Fullstack Python Developer.",
        status: "draft",
        curiculum: [
            {
                id: "p1",
                course_id: "4",
                name: "Python Fundamentals",
                description: "Syntax, Data Structures, and Algorithms"
            },
            {
                id: "p2",
                course_id: "4",
                name: "Object-Oriented Programming",
                description: "Classes, Inheritance, and Polymorphism"
            },
            {
                id: "p3",
                course_id: "4",
                name: "Web Development with Django",
                description: "MVT Architecture, ORM, and Admin Panel"
            },
            {
                id: "p4",
                course_id: "4",
                name: "High Performance APIs with FastAPI",
                description: "Async/Await, Pydantic, and automatic docs"
            },
            {
                id: "p5",
                course_id: "4",
                name: "Deployment & CI/CD",
                description: "Docker, PostgreSQL, and Cloud Deployment"
            }
        ]
    }
];

export const CURRICULUMS = []; // Keeping it empty or removing if not used anymore, but keeping for safety if referenced elsewhere temporarily.
