import React from "react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


// import required modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from 'swiper/modules';
import Product from "./Product/Product";

const Home = () => {

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Hero Banner Slider */}
      <section className="relative">
        <Swiper
          navigation={true}
          pagination={{ clickable: true }}
          mousewheel={true}
          keyboard={true}
          modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
          autoplay={{ delay: 5000 }}
          loop={true}
          className="w-full h-64 md:h-[500px]"
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <div className="h-64 md:h-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-center rounded-b-xl">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-2">Electronics Sale Up to 50% Off</h2>
                <p className="mb-4 text-lg">Best deals on laptops, phones, headphones, and smartwatches</p>
                <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                  Shop Now
                </button>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <div className="h-64 md:h-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white text-center rounded-b-xl">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-2">New Arrivals for 2025</h2>
                <p className="mb-4 text-lg">Explore the latest gadgets and accessories</p>
                <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                  Shop Now
                </button>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 3 */}
          <SwiperSlide>
            <div className="h-64 md:h-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-white text-center rounded-b-xl">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-2">Best Discounts on Smartwatches</h2>
                <p className="mb-4 text-lg">Grab your favorite wearable gadgets</p>
                <button className="bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                  Shop Now
                </button>
              </div>
            </div>
          </SwiperSlide>

        </Swiper>
      </section>

      {/* Filter and Product Section */}
      <Product />

    </div>
  );
};

export default Home;
