import { useEffect, useState } from "react";
import { Carousel, CarouselApi, CarouselContent } from "../ui/carousel";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HomeCarouselSlide from "./HomeCarouselSlide";

export default function HomeStatsCarousel() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

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
        className="w-full max-w-7xl h-128 max-h-[500px] z-10 overflow-clip rounded-3xl"
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <HomeCarouselSlide key={index} className="relative items-center justify-center h-128 max-h-[500px] p-6">
              <svg className="absolute inset-0" viewBox="0 0 1355 529" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="233" cy="146" r="233" fill="#0F4374" fillOpacity="0.5" />
                <circle cx="1292" cy="379" r="150" fill="#0F4374" fillOpacity="0.5" />
              </svg>
              <div className="flex items-center justify-center w-full h-full">
                <span className="text-4xl font-semibold">{index + 1}</span>
              </div>
            </HomeCarouselSlide>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute inset-0 z-20 flex items-center justify-between pointer-events-none text-white">
        <Button
          onClick={() => scrollToIndex(currentIndex - 1)}
          className="pointer-events-auto rounded-full p-1 bg-transparent shadow-none hover:bg-transparent"
        >
          <ChevronLeft className="size-20" strokeWidth={1.5} />
        </Button>
        <Button
          onClick={() => scrollToIndex(currentIndex + 1)}
          className="pointer-events-auto rounded-full p-1 bg-transparent shadow-none hover:bg-transparent"
        >
          <ChevronRight className="size-20" strokeWidth={1.5} />
        </Button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
        {Array.from({ length: totalItems }).map((_, index) => (
          <Button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`w-3 h-3 p-0 rounded-full ${currentIndex === index ? "bg-bcgw-yellow-dark" : "bg-gray-600"
              }`}
          />
        ))}
      </div>
    </div>
  )
}
