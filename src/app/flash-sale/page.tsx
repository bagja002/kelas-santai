import PlaceholderPage from "@/components/layout/placeholder-page";
import { Badge } from "@/components/ui/badge";

export default function FlashSalePage() {
    return (
        <div className="flex flex-col items-center">
            <div className="w-full bg-red-600 text-white text-center py-2 font-bold animate-pulse">
                🔥 FLASH SALE BERAKHIR DALAM 02:23:12
            </div>
            <PlaceholderPage
                title="Flash Sale"
                description="Nantikan promo spesial potongan harga hingga 80% untuk kelas-kelas pilihan!"
            />
        </div>
    );
}
