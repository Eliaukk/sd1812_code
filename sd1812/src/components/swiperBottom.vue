<template>
  <div>
    <!-- 底部广告轮播 -->
    <div
      class="swiper-container swiper-banner"
      id="swiperCon"
      v-show="bottomList.length > 0"
    >
      <div class="swiper-wrapper">
        <a
          v-for="(itemBanner, itemIndex) in bottomList"
          :key="itemIndex"
          class="swiper-slide"
          :href="itemBanner.HREF_A"
        >
          <img :src="itemBanner.IMG_A" />
        </a>
      </div>
      <!-- Add Pagination -->
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script>
import Swiper from "swiper/dist/js/swiper.js";
export default {
  name: "swiper-bottom",
  props: ["bottomList"],
  data() {
    return {};
  },
  watch: {
    bottomList(newValue, oldValue) {
      let _this = this;
      //图片只有一张时不滚动
      if (_this.bottomList.length > 1) {
        _this.swiperInit();
      }
    }
  },
  methods: {
    /**
     * 轮播
     */
    swiperInit() {
      new Swiper("#swiperCon", {
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        pagination: {
          el: ".swiper-pagination"
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.swiper-banner {
  width: 690px;
  height: 184px;
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
