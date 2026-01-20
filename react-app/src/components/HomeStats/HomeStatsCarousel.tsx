import { useEffect, useState, useRef } from "react";
import { Carousel, CarouselApi, CarouselContent } from "../ui/carousel";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import ImageSlide from "./slides/ImageSlide";
import dashboardImage from "@/assets/dashboard.jpg";
import dashboardImage2 from "@/assets/dashboard2.png";
import JaneSlide from "./slides/JaneSlide";
import AcuitySlide from "./slides/AcuitySlide";
import BooqableSlide from "./slides/BooqableSlide";

export default function HomeStatsCarousel() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const plugin = useRef(Autoplay({ delay: 10000, stopOnInteraction: true }));

  useEffect(() => {
    if (!carouselApi) return;

    const updateCarouselState = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
      setTotalItems(carouselApi.scrollSnapList().length);
    };

    updateCarouselState();

    carouselApi.on("select", updateCarouselState);

    return () => {
      carouselApi.off("select", updateCarouselState); // Clean up on unmount
    };
  }, [carouselApi]);

  const scrollToIndex = (index: number) => {
    carouselApi?.scrollTo(index);
  };

  return (
    <div className="relative h-128 max-h-[500px] w-full max-w-7xl">
      <Carousel
        setApi={setCarouselApi}
        opts={{ loop: true }}
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="w-full max-w-7xl h-128 max-h-[500px] z-10 overflow-clip rounded-3xl"
      >
        <CarouselContent>
          <JaneSlide />
          <AcuitySlide />
          <BooqableSlide />
          <ImageSlide
            image={dashboardImage}
            message="Supporting Mothers Every Step Of The Way"
          />
          <ImageSlide
            image={dashboardImage2}
            message="Supporting Mothers Every Step Of The Way"
          />
        </CarouselContent>
      </Carousel>

      <div className="absolute inset-0 z-20 flex items-center justify-between pointer-events-none text-white">
        <Button
          onClick={() => scrollToIndex(currentIndex - 1)}
          className="pointer-events-auto rounded-full p-1 bg-transparent shadow-none hover:bg-transparent"
        >
          <ChevronLeft className="size-10 lg:size-18" strokeWidth={1.5} />
        </Button>
        <Button
          onClick={() => scrollToIndex(currentIndex + 1)}
          className="pointer-events-auto rounded-full p-1 bg-transparent shadow-none hover:bg-transparent"
        >
          <ChevronRight className="size-10 lg:size-18" strokeWidth={1.5} />
        </Button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
        {Array.from({ length: totalItems }).map((_, index) => (
          <Button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`w-3 h-3 p-0 rounded-full ${
              currentIndex === index ? "bg-bcgw-yellow-dark" : "bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
