import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import {
  heroBook1,
  heroBook2,
  heroBook3,
  heroBook4,
  heroBook5,
  heroBook6,
} from "../../../assets/images/Image";
import Aos from "aos";
import Button from "../../../components/Button";

const Hero = () => {
  useEffect(() => {
    Aos.init();
  }, []);
  return (
    <div className="hero  min-h-[600px] flex flex-col justify-center">
      <div className="Container  grid grid-cols-1 md:grid-cols-2 items-center ">
        {/* text */}
        <div
          data-aos="fade-up"
          data-aos-easing="ease-out-cubic"
          data-aos-offset={0}
          data-aos-duration={1000}
          className="flex flex-col gap-5  "
        >
          <h1 className="text-black text-[30px]   lg:text-[40px] xl:text-[50px] font-medium tracking-[10px] md:tracking-[15px]">
            Find Your <br />
            Next Book
          </h1>
          <p className="text-black font-normal text-xs md:text-sm sm:w-[350px]">
            Not sure what to read next? Explore our <strong>BOOK SHOP</strong>{" "}
            and find you new friend.
          </p>
          <Button
            to="/books"
            className="w-[150px] md:w-[100px] !bg-black !hover:bg-black/90"
          >
            Explore{" "}
          </Button>
        </div>
        {/* img */}
        <figure
          data-aos="fade-up"
          data-aos-easing="ease-out-cubic"
          data-aos-offset={0}
          data-aos-duration={1000}
          // className="order-1 md:order-2"
        >
          <ImageSwiper />
        </figure>
      </div>
    </div>
  );
};
const ImageSwiper = () => {
  const imgList = [
    heroBook1,
    heroBook2,
    heroBook3,
    heroBook4,
    heroBook5,
    heroBook6,
  ];
  return (
    <Swiper
      effect={"coverflow"}
      grabCursor={false}
      loop={true}
      speed={2000}
      centeredSlides={true}
      autoplay={{
        delay: 2000,
        disableOnInteraction: true,
      }}
      slidesPerView={3}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 400,
        modifier: 3,
        slideShadows: false,
      }}
      modules={[EffectCoverflow, Autoplay]}
      className="swiper-container"
    >
      {imgList?.map((item, index) => (
        <SwiperSlide key={index}>
          <img src={item} className="h-full w-full object-cover" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
export default Hero;
