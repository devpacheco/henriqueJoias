"use client"

import { useState } from "react"
import BannerImg1 from "../../../public/assets/banner(1).png"
import BannerImg2 from "../../../public/assets/Banner(2).png"
import Banner1 from "../../../public/assets/banner-1.png"
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function Slide(){
    return(
        <Swiper
        className="w-full my-5"
        navigation={true}
        pagination={{clickable: true}}
        slidesPerView={1}
        modules={[Pagination, Navigation]}
        >
            <SwiperSlide>
                <Image 
                src={Banner1} 
                alt="Banner1" 
                quality={100}
                priority={true}
                width={1280} 
                height={400} 
                className="rounded-lg" 
                />
            </SwiperSlide>
            <SwiperSlide>
                <Image 
                src={BannerImg2} 
                alt="Banner1" 
                quality={100}
                priority={true}
                width={1280} 
                height={400} 
                className="rounded-lg" 
                />
            </SwiperSlide>
        </Swiper>
    )
}
