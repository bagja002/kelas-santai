import Image from "next/image";

export function Partners() {
    // Using placeholder logos for demonstration
    const partners = [
        { name: "GoTo", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/GoTo_logo.svg/2560px-GoTo_logo.svg.png" },
        { name: "Traveloka", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Traveloka_Primary_Logo.svg/1200px-Traveloka_Primary_Logo.svg.png" },
        { name: "Tokopedia", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Tokopedia.svg/1200px-Tokopedia.svg.png" },
        { name: "Shopee", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/2560px-Shopee.svg.png" },
        { name: "Ruangguru", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Ruangguru_Logo.svg/1200px-Ruangguru_Logo.svg.png" },
        { name: "Tiket.com", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Tiket.com_Logos_%28New%29.svg/1200px-Tiket.com_Logos_%28New%29.svg.png" }
    ];

    return (
        <section className="py-12 border-b border-border/50 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <p className="text-center text-sm font-medium text-muted-foreground mb-8">
                    Dipelajari oleh siswa dari berbagai kampus dan perusahaan terkemuka
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Note: In a real app, use local SVGs. These are text placeholders or external images. 
                 For safety/speed, I'll use text with specific fonts or simple blocks if external images fail.
                 Actually, let's use text for safety if I can't guarantee the URLs, but I'll try generic attractive text styling first representing logos.
             */}

                    {/* 
                Since I cannot guarantee external image stability in this environment, 
                I will create stylized text logos that look professional. 
             */}
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">Gojek</div>
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-300">Traveloka</div>
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-300">Tokopedia</div>
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-400">Shopee</div>
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">Tiket.com</div>
                    <div className="text-2xl font-bold italic bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">Ruangguru</div>
                </div>
            </div>
        </section>
    );
}
