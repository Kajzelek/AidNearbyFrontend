import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';



const FeaturedAds = () => (
  <section className="py-12 bg-white">
    <div className="container mx-auto text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Wyróżnione ogłoszenia</h2>
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000 }}
        slidesPerView={1}
        spaceBetween={20}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        loop={true}
        className="mySwiper"
      >
        {/* Ogłoszenia */}
        <SwiperSlide>
          <div className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-xl transition">
            <h3 className="font-semibold text-gray-800 text-lg mb-2">
              Pomoc z zakupami
            </h3>
            <p className="text-gray-600">Warszawa, pilne</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-xl transition">
            <h3 className="font-semibold text-gray-800 text-lg mb-2">
              Korepetycje z matematyki
            </h3>
            <p className="text-gray-600">Kraków, od zaraz</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-xl transition">
            <h3 className="font-semibold text-gray-800 text-lg mb-2">
              Przeprowadzka
            </h3>
            <p className="text-gray-600">Gdańsk, potrzebna pomoc</p>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
);

export default FeaturedAds;