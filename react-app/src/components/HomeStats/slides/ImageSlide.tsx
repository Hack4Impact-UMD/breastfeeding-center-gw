import { cn } from "@/lib/utils"
import HomeCarouselSlide from "../HomeCarouselSlide"

type ImageSlideProps = {
  image: string,
  message: string,
  imageClassName?: string
  className?: string
}

export default function ImageSlide({ image, message, className, imageClassName }: ImageSlideProps) {
  return (
    <HomeCarouselSlide className={cn("relative items-center justify-center h-128 max-h-[500px] p-6 overflow-clip", className)}>
      <img src={image} className={cn("absolute w-full h-full inset-0 object-cover", imageClassName)} />
      <div className="absolute inset-0 bg-[#1A70C24D]/30 z-10"></div>

      <div className="absolute bottom-0 left-0 right-0 bg-[#05182AB8]/72 h-32">
        <div className="w-full h-full p-4 py-8">
          <h1 className="text-center text-base md:text-xl lg:text-3xl font-semibold">
            {message}
          </h1>
        </div>
      </div>
    </HomeCarouselSlide>
  )
}
