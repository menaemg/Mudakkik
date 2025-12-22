import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Carousel className="w-[350px] h-[350px] ml-[300px] bg-red-600 text-white">
                <CarouselContent>
                    <CarouselItem>.1.</CarouselItem>
                    <CarouselItem>.2.</CarouselItem>
                    <CarouselItem>.3.</CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>

            <Button
                
                variant="destructive"
            >
                اضغط هنا
            </Button>
        </>
    );
}
