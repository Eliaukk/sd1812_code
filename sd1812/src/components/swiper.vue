<template>
  <!--顶部banner-->
  <div class="overall">
    <div class="vessel">
      <div class="swiper-container swiper-top" id="swiperTop">
        <div class="swiper-wrapper">
          <a
            v-for="(i, index) in bannerLists"
            :key="index"
            class="swiper-slide swiper-no-swiping"
          >
            <img :src="i.IMG_B" style="width:100%" />
          </a>
        </div>
      </div>
      <div class="swiper-container swiper-bottom" id="swiper-container">
        <div class="swiper-wrapper">
          <a
            v-for="(i, index) in bannerLists"
            :key="index"
            class="swiper-slide"
            :href="i.HREF_A"
          >
            <img :src="i.IMG_A" style="width:100%" />
          </a>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from "swiper/dist/js/swiper.js";
export default {
  name: "swiper",
  props: ["bannerLists"],
  data() {
    return {};
  },
  mounted() {
    let _this = this;
    _this.swiperBannerInit();
  },
  methods: {
    /**
     * 轮播
     */
    swiperBannerInit() {
      let Swiper1 = new Swiper("#swiperTop", {
        effect: "fade", //切换效果
        loop: true, //循环播放
        fadeEffect: {
          crossFade: true
        }
      });
      new Swiper("#swiper-container", {
        fadeEffect: {
          crossFade: true
        },
        loop: true, //循环播放
        //显示底部小圆点
        pagination: {
          el: ".swiper-pagination"
        },
        autoplay: {
          disableOnInteraction: false,
          delay: 2500,
          slidesPerView: "auto",
          centeredSlides: true
        },
        controller: {
          control: Swiper1
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.overall {
  position: absolute;
  top: 0;
  overflow: hidden;
  width: 750px;
  height: 492px;
}
.vessel {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bck {
  width: 100%;
}
.swiper-top {
  width: 10rem;
  height: 492px;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  .swiper-wrapper {
    width: 100%;
  }
  .swiper-slide {
    display: inline-block;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
}
.swiper-bottom {
  width: 690px;
  height: 184px;
  transition: 0.5s;
  top: 120px;
  .swiper-wrapper {
    width: 100%;
  }
  .swiper-slide {
    display: inline-block;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    transform: scale(0.4);
    -webkit-transform: scale(0.4);
    -moz-transform: scale(0.4);
    span {
      position: relative;
      z-index: 5;
    }
    img {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }
  .swiper-slide-active {
    transform: scale(1);
    opacity: 1;
    z-index: 10;
  }

  .swiper-slide-prev {
    transform: scale(0.4);
  }

  .swiper-slide.swiper-slide-next {
    transform: scale(0.4);
  }
}
</style>
