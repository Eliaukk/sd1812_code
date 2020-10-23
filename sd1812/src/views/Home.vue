<template>
  <div class="container">
    <!-- 
      * title :周末抢神券
    -->
    <!-- 主页面 -->
    <div class="wrapper" v-wechat-title="($route.meta.title = pageData.title)">
      <header>
        <!-- 不配banner时展示一张默认图 -->
        <img
          :src="pageData.bannerImg"
          v-if="
            bannerList == null ||
              bannerList == undefined ||
              bannerList.length == 0
          "
        />
        <!-- 配banner时开启轮播 -->
        <swiper
          :bannerLists="bannerList"
          v-if="bannerList != null && bannerList.length > 0"
        ></swiper>
        <a :href="pageData.actExplain" class="btn_rule">活动规则</a>
        <a @click="showPopHoney" class="btn_about" href="javscript:;"
          >关于蜂蜜</a
        >
        <!-- 活动已开始展示样式 距离结束时间倒计时 -->
        <div class="activity_info" v-if="showFlag == true">
          <span class="time">{{ countDownTime }}</span>
          <span class="myfm">{{ pageData.honey }}</span>
          <a
            class="receive-honey"
            @click="receiveHoney"
            v-if="pageData.honeyButton == 'show'"
            >收蜂蜜</a
          >
        </div>
        <!-- 活动未开始展示样式 距离开始时间倒计时 -->
        <div class="activity_info activity_noStart" v-if="showFlag == false">
          <span class="time">{{ countDownTime }}</span>
          <span class="myfm">{{ pageData.honey }}</span>
          <a
            class="receive-honey"
            @click="receiveHoney"
            v-if="pageData.honeyButton == 'show'"
            >收蜂蜜</a
          >
        </div>
        <!-- 用户反馈 -->
        <a class="feedback" @click="goFeedBack"></a>
      </header>
      <main>
        <van-tabs scrollspy sticky :ellipsis="false" @click="onClick">
          <van-tab
            class="floorBox"
            v-for="(itemFloor, indexFloor) in pageData.resList"
            :key="indexFloor"
            :title="itemFloor.tabName"
          >
            <template #title>
              <i v-if="itemFloor.MODULE_NAME == 'ms'">
                <van-icon name="fire" color="#e71437"></van-icon>
              </i>
              {{ itemFloor.tabName }}
            </template>
            <!-- 爆款秒杀 start-->
            <div class="ms_list" v-if="itemFloor.MODULE_NAME == 'ms'">
              <p class="title clear">
                <span class="name">{{ itemFloor.NAME }}</span>
                <span class="tip">同一神券限领一次</span>
              </p>
              <ul class="li_list">
                <li
                  v-for="(item, index) in itemFloor.data"
                  :key="index"
                  class="clear"
                >
                  <a
                    class="coupon_link"
                    :href="item.coupLink"
                    :style="{
                      backgroundImage: 'url(' + item.P_IMG + ')',
                    }"
                  >
                    <div
                      class="help_hand"
                      @click.prevent="
                        toggleList(index, indexFloor, item.helpCount)
                      "
                    >
                      <p
                        :class="[
                          {
                            help_active: activeIndex != index,
                          },
                          'help_num',
                        ]"
                      >
                        {{ item.helpCount }}/{{ item.HELP_NUM }}人助力
                      </p>
                      <ul class="schedule">
                        <li
                          v-for="(items, indexs) in item.HELP_NUM"
                          :key="indexs"
                          :class="[
                            {
                              active: indexs < item.helpCount,
                              actives: item.HELP_NUM == 1,
                            },
                          ]"
                        ></li>
                      </ul>
                    </div>
                    <div class="btn_type">
                      <!-- 提醒我 -->
                      <a
                        class="btn btn_same"
                        v-if="item.buttonStatus == 'remind'"
                        @click.prevent="remind(item, 'TXW')"
                        >提醒我</a
                      >
                      <!-- 取消提醒 -->
                      <a
                        class="btn btn_use"
                        v-if="item.buttonStatus == 'cancel'"
                        @click.prevent="remind(item)"
                        >取消提醒</a
                      >
                      <!-- 立即领取 -->
                      <a
                        href="javascript:;"
                        class="btn btn_common"
                        v-if="item.buttonStatus == 'getNow'"
                        @click.prevent="getNow(item, 'MSLQ')"
                        >立即参与</a
                      >
                      <!-- 去邀请 -->
                      <a
                        href="javascript:;"
                        class="btn btn_same"
                        v-if="item.buttonStatus == 'toInvite'"
                        @click.prevent="invite(item.PID, 'MSQYQ')"
                        >去邀请</a
                      >
                      <!-- 领取使用 -->
                      <a
                        class="btn btn_use"
                        v-if="item.buttonStatus == 'kqGet'"
                        @click.prevent="
                          kqGet(item.verifyStatus, item.PID, 'MXLQSY')
                        "
                        >获取使用</a
                      >
                      <!-- 去使用 -->
                      <a
                        class="btn btn_use"
                        v-if="item.buttonStatus == 'toUse'"
                        @click.prevent="goUse(item, '')"
                        >去使用</a
                      >
                      <!-- 已抢完 -->
                      <a
                        href="javascript:;"
                        class="btn btn_end"
                        v-if="item.buttonStatus == 'sellOut'"
                        >已抢完</a
                      >
                      <!-- 立即抢 -->
                      <a
                        href="javascript:;"
                        class="btn btn_common"
                        v-if="item.buttonStatus == 'msGet'"
                        @click.prevent="
                          kqGet(item.verifyStatus, item.PID, 'BKLJQ')
                        "
                        >立即参与</a
                      >
                      <p
                        v-if="item.transferButton != 'show'"
                        :class="[
                          {
                            limit_end: item.buttonStatus == 'sellOut',
                            limit_num: item.buttonStatus != 'sellOut',
                          },
                          'limit',
                        ]"
                      >
                        {{ item.P_STOCK }}
                      </p>
                      <p
                        v-if="
                          item.transferButton == 'show' &&
                            item.buttonStatus == 'sellOut'
                        "
                        class="p-transfer"
                        @click.prevent="transfer(item)"
                      >
                        助力转移
                      </p>
                    </div>
                    <div
                      class="tag clear"
                      v-if="item.P_BG_IMG"
                      :style="{
                        backgroundImage: 'url(' + item.P_BG_IMG + ')',
                      }"
                    >
                      <span class="tag_title fl">{{ item.leftIcon }}</span>
                      <span class="tag_subtitle fl">
                        {{ item.rightIcon ? item.rightIcon : item.timeValue }}
                      </span>
                    </div>
                  </a>
                  <div
                    class="help_info"
                    v-show="activeIndex == index && activeItem == indexFloor"
                  >
                    <ul class="clear">
                      <div class="title">助力详情</div>
                      <li
                        class="fl clear"
                        v-for="(itemUser, indexUser) in item.helpUserInfo"
                        :key="indexUser"
                      >
                        <img :src="itemUser.HELP_IMG" class="fl" />
                        <span class="help_tel fl">{{ itemUser.H_MOBILE }}</span>
                        <span class="help_time fl">{{ itemUser.H_TIME }}</span>
                      </li>
                    </ul>
                    <div
                      class="toggle"
                      @click.prevent="
                        toggleList(index, indexFloor, item.helpCount)
                      "
                    >
                      收起
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 爆款秒杀 end -->
            <!-- 精品优惠券start -->
            <div class="ms_list yh_list" v-if="itemFloor.MODULE_NAME == 'yhq'">
              <p class="title clear">
                <span class="fl">{{ itemFloor.NAME }}</span>
              </p>
              <ul class="li_list">
                <li
                  v-for="(item, index) in itemFloor.data"
                  :key="index"
                  v-show="num ? index < num : true"
                  class="clear"
                >
                  <a
                    class="coupon_link"
                    :href="item.coupLink"
                    :style="{
                      backgroundImage: 'url(' + item.P_IMG + ')',
                    }"
                  >
                    <div
                      class="help_hand"
                      @click.prevent="
                        toggleList(index, indexFloor, item.helpCount)
                      "
                    >
                      <p
                        :class="[
                          {
                            help_active: activeIndex != index,
                          },
                          'help_num',
                        ]"
                      >
                        {{ item.helpCount }}/{{ item.HELP_NUM }}人助力
                      </p>
                      <ul class="schedule">
                        <li
                          v-for="(items, indexs) in item.HELP_NUM"
                          :key="indexs"
                          :class="[
                            {
                              active: indexs < item.helpCount,
                              actives: item.HELP_NUM == 1,
                            },
                          ]"
                        ></li>
                      </ul>
                    </div>
                    <div class="btn_type">
                      <!-- 立即领取 -->
                      <a
                        href="javascript:;"
                        class="btn btn_common"
                        v-if="item.buttonStatus == 'getNow'"
                        @click.prevent="getNow(item, 'JPLQ')"
                        >立即参与</a
                      >
                      <!-- 去邀请 -->
                      <a
                        href="javascript:;"
                        class="btn btn_same"
                        v-if="item.buttonStatus == 'toInvite'"
                        @click.prevent="invite(item.PID, 'JPQYQ')"
                        >去邀请</a
                      >
                      <!-- 领取使用 -->
                      <a
                        class="btn btn_use"
                        v-if="item.buttonStatus == 'kqGet'"
                        @click.prevent="
                          kqGet(item.verifyStatus, item.PID, 'JPLQSY')
                        "
                        >获取使用</a
                      >
                      <!-- 去使用 -->
                      <a
                        class="btn btn_use"
                        v-if="item.buttonStatus == 'toUse'"
                        @click.prevent="goUse(item, 'JPQSY')"
                        >去使用</a
                      >
                      <!-- 已抢完 -->
                      <a
                        href="javascript:;"
                        class="btn btn_end"
                        v-if="item.buttonStatus == 'sellOut'"
                        >已抢完</a
                      >
                      <p
                        v-if="item.transferButton != 'show'"
                        :class="[
                          {
                            limit_end: item.buttonStatus == 'sellOut',
                            limit_num: item.buttonStatus != 'sellOut',
                          },
                          'limit',
                        ]"
                      >
                        {{ item.P_STOCK }}
                      </p>
                      <p
                        v-if="
                          item.transferButton == 'show' &&
                            item.buttonStatus == 'sellOut'
                        "
                        class="p-transfer"
                        @click.prevent="transfer(item)"
                      >
                        助力转移
                      </p>
                    </div>
                    <div
                      v-if="item.P_BG_IMG"
                      class="tag clear"
                      :style="{
                        backgroundImage: 'url(' + item.P_BG_IMG + ')',
                      }"
                    >
                      <span class="tag_title fl">{{ item.ICON_WORD }}</span>
                      <span class="tag_subtitle fl">
                        {{ item.ICON_WORD_ING }}
                      </span>
                    </div>
                  </a>
                  <div
                    class="help_info"
                    v-show="activeIndex == index && activeItem == indexFloor"
                  >
                    <ul class="clear">
                      <div class="title">助力详情</div>
                      <li
                        class="fl clear"
                        v-for="(itemUser, indexUser) in item.helpUserInfo"
                        :key="indexUser"
                      >
                        <img :src="itemUser.HELP_IMG" class="fl" />
                        <span class="help_tel fl">{{ itemUser.H_MOBILE }}</span>
                        <span class="help_time fl">{{ itemUser.H_TIME }}</span>
                      </li>
                    </ul>
                    <div
                      class="toggle"
                      @click.prevent="
                        toggleList(index, indexFloor, item.helpCount)
                      "
                    >
                      收起
                    </div>
                  </div>
                </li>
              </ul>
              <a
                v-show="itemFloor.SHOW_DEFAULT"
                :class="[
                  {
                    open: showBoxCoupon,
                    retract: !showBoxCoupon,
                  },
                  'btnToggle',
                ]"
                @click="
                  showMoreCoupon(itemFloor.data.length, itemFloor.SHOW_DEFAULT)
                "
              ></a>
            </div>
            <!-- 精品优惠券 end -->
            <!-- 特惠业务 start -->
            <div class="th_list" v-if="itemFloor.MODULE_NAME == 'th'">
              <p class="title clear">
                <span class="fl">{{ itemFloor.NAME }}</span>
              </p>
              <ul class="li_list">
                <li
                  v-for="(item, index) in itemFloor.data"
                  :key="index"
                  v-show="nums ? index < nums : true"
                  :style="{
                    backgroundImage: 'url(' + item.P_IMG + ')',
                  }"
                  class="clear"
                >
                  <a class="coupon_link" :href="item.REMAKE"></a>
                </li>
              </ul>
              <a
                v-show="itemFloor.SHOW_DEFAULT"
                :class="[{ open: showBoxTH, retract: !showBoxTH }, 'btnToggle']"
                @click="
                  showMoreTH(itemFloor.data.length, itemFloor.SHOW_DEFAULT)
                "
              ></a>
            </div>
            <!-- 特惠业务 end -->
            <!-- 专享券模块 start -->
            <div class="zx_list" v-if="itemFloor.MODULE_NAME == 'zx'">
              <p class="title clear">
                <span class="fl">{{ itemFloor.NAME }}</span>
              </p>
              <ul class="li_list">
                <li
                  v-for="(item, index) in itemFloor.data"
                  :key="index"
                  class="clear"
                >
                  <a
                    class="coupon_link"
                    :href="item.coupLink"
                    :style="{
                      backgroundImage: 'url(' + item.P_IMG + ')',
                    }"
                  >
                    <div
                      class="help_hand"
                      @click.prevent="
                        toggleList(index, indexFloor, item.helpCount)
                      "
                    >
                      <p
                        :class="[
                          {
                            help_active: activeIndex != index,
                          },
                          'help_num',
                        ]"
                      >
                        {{ item.helpCount }}/{{ item.HELP_NUM }}人助力
                      </p>
                      <ul class="schedule">
                        <li
                          v-for="(items, indexs) in item.HELP_NUM"
                          :key="indexs"
                          :class="[
                            {
                              active: indexs < item.helpCount,
                              actives: item.HELP_NUM == 1,
                            },
                          ]"
                        ></li>
                      </ul>
                    </div>
                    <div class="tel_btn">
                      <!-- 立即领取 -->
                      <a
                        href="javascript:;"
                        class="btn btn_common"
                        v-if="item.buttonStatus == 'getNow'"
                        @click.prevent="getNow(item, 'ZXLQ')"
                        >立即参与</a
                      >
                      <!-- 去邀请 -->
                      <a
                        href="javascript:;"
                        class="btn btn_same"
                        v-if="item.buttonStatus == 'toInvite'"
                        @click.prevent="invite(item.PID, 'ZXQYQ')"
                        >去邀请</a
                      >
                      <!-- 领取使用 -->
                      <a
                        class="btn btn_use"
                        v-if="item.buttonStatus == 'kqGet'"
                        @click.prevent="
                          kqGet(item.verifyStatus, item.PID, 'ZXLQSY')
                        "
                        >获取使用</a
                      >
                      <!-- 去使用 -->
                      <a
                        class="btn btn_use"
                        v-if="item.buttonStatus == 'toUse'"
                        @click.prevent="goUse(item, 'ZXQSY')"
                        >去使用</a
                      >
                      <!-- 已抢完 -->
                      <a
                        href="javascript:;"
                        class="btn btn_end"
                        v-if="item.buttonStatus == 'sellOut'"
                        >已抢完</a
                      >
                      <p
                        v-if="item.transferButton != 'show'"
                        :class="[
                          {
                            limit_end: item.buttonStatus == 'sellOut',
                            limit_num: item.buttonStatus != 'sellOut',
                          },
                          'limit',
                        ]"
                      >
                        {{ item.P_STOCK }}
                      </p>
                      <p
                        v-if="
                          item.transferButton == 'show' &&
                            item.buttonStatus == 'sellOut'
                        "
                        class="p-transfer"
                        @click.prevent="transfer(item)"
                      >
                        助力转移
                      </p>
                    </div>
                  </a>
                  <div
                    class="help_info"
                    v-show="activeIndex == index && activeItem == indexFloor"
                  >
                    <ul class="clear">
                      <div class="title">助力详情</div>
                      <li
                        class="fl clear"
                        v-for="(itemUser, indexUser) in item.helpUserInfo"
                        :key="indexUser"
                      >
                        <img :src="itemUser.HELP_IMG" class="fl" />
                        <span class="help_tel fl">{{ itemUser.H_MOBILE }}</span>
                        <span class="help_time fl">{{ itemUser.H_TIME }}</span>
                      </li>
                    </ul>
                    <div
                      class="toggle"
                      @click.prevent="
                        toggleList(index, itemIndexs, item.helpCount)
                      "
                    >
                      收起
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 专享券模块 end -->
            <!-- 话费券模块 start -->
            <div class="hf_list" v-if="itemFloor.MODULE_NAME == 'hf'">
              <p class="title clear">
                <span class="fl">{{ itemFloor.NAME }}</span>
              </p>
              <ul class="li_list">
                <li
                  v-for="(item, index) in itemFloor.data"
                  :key="index"
                  class="clear"
                >
                  <a
                    class="coupon_link"
                    :href="item.coupLink"
                    :style="{
                      backgroundImage: 'url(' + item.P_IMG + ')',
                    }"
                  >
                    <div
                      class="help_hand"
                      @click.prevent="
                        toggleList(index, indexFloor, item.helpCount)
                      "
                    >
                      <p
                        :class="[
                          {
                            help_active: activeIndex != index,
                          },
                          'help_num',
                        ]"
                      >
                        {{ item.helpCount }}/{{ item.HELP_NUM }}人助力
                      </p>
                      <ul class="schedule">
                        <li
                          v-for="(items, indexs) in item.HELP_NUM"
                          :key="indexs"
                          :class="[
                            {
                              active: indexs < item.helpCount,
                              actives: item.HELP_NUM == 1,
                            },
                          ]"
                        ></li>
                      </ul>
                    </div>
                    <div class="tel_btn">
                      <!-- 立即领取 -->
                      <a
                        href="javascript:;"
                        class="btn btn_common"
                        v-if="item.buttonStatus == 'getNow'"
                        @click.prevent="getNow(item, 'HFLQ')"
                        >立即参与</a
                      >
                      <!-- 去邀请 -->
                      <a
                        href="javascript:;"
                        class="btn btn_same"
                        v-if="item.buttonStatus == 'toInvite'"
                        @click.prevent="invite(item.PID, 'HFQYQ')"
                        >去邀请</a
                      >
                      <!-- 领取使用 -->
                      <a
                        class="btn btn_use"
                        v-if="item.buttonStatus == 'kqGet'"
                        @click.prevent="
                          kqGet(item.verifyStatus, item.PID, 'HFLQSY')
                        "
                        >获取使用</a
                      >
                      <!-- 去使用 -->
                      <a
                        class="btn btn_use"
                        v-if="item.buttonStatus == 'toUse'"
                        @click.prevent="goUse(item, 'HFQSY')"
                        >去使用</a
                      >
                      <!-- 已抢完 -->
                      <a
                        href="javascript:;"
                        class="btn btn_end"
                        v-if="item.buttonStatus == 'sellOut'"
                        >已抢完</a
                      >
                      <p
                        v-if="item.transferButton != 'show'"
                        :class="[
                          {
                            limit_end: item.buttonStatus == 'sellOut',
                            limit_num: item.buttonStatus != 'sellOut',
                          },
                          'limit',
                        ]"
                      >
                        {{ item.P_STOCK }}
                      </p>
                      <p
                        v-if="
                          item.transferButton == 'show' &&
                            item.buttonStatus == 'sellOut'
                        "
                        class="p-transfer"
                        @click.prevent="transfer(item)"
                      >
                        助力转移
                      </p>
                    </div>
                  </a>
                  <div
                    class="help_info"
                    v-show="activeIndex == index && activeItem == indexFloor"
                  >
                    <ul class="clear">
                      <div class="title">助力详情</div>
                      <li
                        class="fl clear"
                        v-for="(itemUser, indexUser) in item.helpUserInfo"
                        :key="indexUser"
                      >
                        <img :src="itemUser.HELP_IMG" class="fl" />
                        <span class="help_tel fl">{{ itemUser.H_MOBILE }}</span>
                        <span class="help_time fl">{{ itemUser.H_TIME }}</span>
                      </li>
                    </ul>
                    <div
                      class="toggle"
                      @click.prevent="
                        toggleList(index, indexFloor, item.helpCount)
                      "
                    >
                      收起
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 话费券模块 end -->
            <!-- 流量券模块 start -->
            <div class="ll_list" v-if="itemFloor.MODULE_NAME == 'll'">
              <p class="title clear">
                <span class="fl">{{ itemFloor.NAME }}</span>
              </p>
              <ul class="li_list">
                <li
                  v-for="(item, index) in itemFloor.data"
                  :key="index"
                  class="clear"
                >
                  <a
                    class="coupon_link"
                    :href="item.coupLink"
                    :style="{
                      backgroundImage: 'url(' + item.P_IMG + ')',
                    }"
                  >
                    <div
                      class="help_hand"
                      @click.prevent="
                        toggleList(index, indexFloor, item.helpCount)
                      "
                    >
                      <p
                        :class="[
                          {
                            help_active: activeIndex != index,
                          },
                          'help_num',
                        ]"
                      >
                        {{ item.helpCount }}/{{ item.HELP_NUM }}人助力
                      </p>
                      <ul class="schedule">
                        <li
                          v-for="(items, indexs) in item.HELP_NUM"
                          :key="indexs"
                          :class="[
                            {
                              active: indexs < item.helpCount,
                              actives: item.HELP_NUM == 1,
                            },
                          ]"
                        ></li>
                      </ul>
                    </div>
                    <div class="tel_btn">
                      <!-- 立即领取 -->
                      <a
                        href="javascript:;"
                        class="btn btn_common"
                        v-if="item.buttonStatus == 'getNow'"
                        @click.prevent="getNow(item, 'LLLQ')"
                        >立即参与</a
                      >
                      <!-- 去邀请 -->
                      <a
                        href="javascript:;"
                        class="btn btn_same"
                        v-if="item.buttonStatus == 'toInvite'"
                        @click.prevent="invite(item.PID, 'LLQYQ')"
                        >去邀请</a
                      >
                      <!-- 领取使用 -->
                      <a
                        class="btn btn_use"
                        v-if="item.buttonStatus == 'kqGet'"
                        @click.prevent="
                          kqGet(item.verifyStatus, item.PID, 'LLLQSY')
                        "
                        >获取使用</a
                      >
                      <!-- 去使用 -->
                      <a
                        class="btn btn_use"
                        v-if="item.buttonStatus == 'toUse'"
                        @click.prevent="goUse(item, 'LLQSY')"
                        >去使用</a
                      >
                      <!-- 已抢完 -->
                      <a
                        href="javascript:;"
                        class="btn btn_end"
                        v-if="item.buttonStatus == 'sellOut'"
                        >已抢完</a
                      >
                      <p
                        v-if="item.transferButton != 'show'"
                        :class="[
                          {
                            limit_end: item.buttonStatus == 'sellOut',
                            limit_num: item.buttonStatus != 'sellOut',
                          },
                          'limit',
                        ]"
                      >
                        {{ item.P_STOCK }}
                      </p>
                      <p
                        v-if="
                          item.transferButton == 'show' &&
                            item.buttonStatus == 'sellOut'
                        "
                        class="p-transfer"
                        @click.prevent="transfer(item)"
                      >
                        助力转移
                      </p>
                    </div>
                  </a>
                  <div
                    class="help_info"
                    v-show="activeIndex == index && activeItem == indexFloor"
                  >
                    <ul class="clear">
                      <div class="title">助力详情</div>
                      <li
                        class="fl clear"
                        v-for="(itemUser, indexUser) in item.helpUserInfo"
                        :key="indexUser"
                      >
                        <img :src="itemUser.HELP_IMG" class="fl" />
                        <span class="help_tel fl">{{ itemUser.H_MOBILE }}</span>
                        <span class="help_time fl">{{ itemUser.H_TIME }}</span>
                      </li>
                    </ul>
                    <div
                      class="toggle"
                      @click.prevent="
                        toggleList(index, itemIndexs, item.helpCount)
                      "
                    >
                      收起
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 流量券模块 end -->
            <!-- 开抢 start -->
            <div class="ms_list" v-if="itemFloor.MODULE_NAME == 'kq'">
              <p class="title clear">
                <span class="name">{{ itemFloor.NAME }}</span>
                <span class="tip">同一神券限领一次</span>
              </p>
              <ul class="li_list">
                <li
                  v-for="(item, index) in itemFloor.data"
                  :key="index"
                  class="clear"
                >
                  <a
                    class="coupon_link"
                    :href="item.coupLink"
                    :style="{
                      backgroundImage: 'url(' + item.P_IMG + ')',
                    }"
                  >
                    <div
                      class="help_hand"
                      @click.prevent="
                        toggleList(index, indexFloor, item.helpCount)
                      "
                    >
                      <p
                        :class="[
                          {
                            help_active: activeIndex != index,
                          },
                          'help_num',
                        ]"
                      >
                        {{ item.helpCount }}/{{ item.HELP_NUM }}人助力
                      </p>
                      <ul class="schedule">
                        <li
                          v-for="(items, indexs) in item.HELP_NUM"
                          :key="indexs"
                          :class="[
                            {
                              active: indexs < item.helpCount,
                              actives: item.HELP_NUM == 1,
                            },
                          ]"
                        ></li>
                      </ul>
                    </div>
                    <div class="btn_type">
                      <!-- 提醒我 -->
                      <a
                        class="btn btn_same"
                        v-if="item.buttonStatus == 'remind'"
                        @click.prevent="remind(item, 'TXW')"
                        >提醒我</a
                      >
                      <!-- 取消提醒 -->
                      <a
                        class="btn btn_use"
                        v-if="item.buttonStatus == 'cancel'"
                        @click.prevent="remind(item)"
                        >取消提醒</a
                      >
                      <!-- 立即领取 -->
                      <a
                        href="javascript:;"
                        class="btn btn_common"
                        v-if="item.buttonStatus == 'getNow'"
                        @click.prevent="getNow(item, 'MSLQ')"
                        >立即参与</a
                      >
                      <!-- 去邀请 -->
                      <a
                        href="javascript:;"
                        class="btn btn_same"
                        v-if="item.buttonStatus == 'toInvite'"
                        @click.prevent="invite(item.PID, 'MSQYQ')"
                        >去邀请</a
                      >
                      <!-- 领取使用 -->
                      <a
                        class="btn btn_use"
                        v-if="item.buttonStatus == 'kqGet'"
                        @click.prevent="
                          kqGet(item.verifyStatus, item.PID, 'MXLQSY')
                        "
                        >获取使用</a
                      >
                      <!-- 去使用 -->
                      <a
                        class="btn btn_use"
                        v-if="item.buttonStatus == 'toUse'"
                        @click.prevent="goUse(item, '')"
                        >去使用</a
                      >
                      <!-- 已抢完 -->
                      <a
                        href="javascript:;"
                        class="btn btn_end"
                        v-if="item.buttonStatus == 'sellOut'"
                        >已抢完</a
                      >
                      <!-- 立即抢 -->
                      <a
                        href="javascript:;"
                        class="btn btn_common"
                        v-if="item.buttonStatus == 'msGet'"
                        @click.prevent="
                          kqGet(item.verifyStatus, item.PID, 'BKLJQ')
                        "
                        >立即参与</a
                      >
                      <p
                        v-if="item.transferButton != 'show'"
                        :class="[
                          {
                            limit_end: item.buttonStatus == 'sellOut',
                            limit_num: item.buttonStatus != 'sellOut',
                          },
                          'limit',
                        ]"
                      >
                        {{ item.P_STOCK }}
                      </p>
                      <p
                        v-if="
                          item.transferButton == 'show' &&
                            item.buttonStatus == 'sellOut'
                        "
                        class="p-transfer"
                        @click.prevent="transfer(item)"
                      >
                        助力转移
                      </p>
                    </div>
                    <div
                      class="tag clear"
                      v-if="item.P_BG_IMG"
                      :style="{
                        backgroundImage: 'url(' + item.P_BG_IMG + ')',
                      }"
                    >
                      <span class="tag_title fl">{{ item.leftIcon }}</span>
                      <span class="tag_subtitle fl">
                        {{ item.rightIcon ? item.rightIcon : item.timeValue }}
                      </span>
                    </div>
                  </a>
                  <div
                    class="help_info"
                    v-show="activeIndex == index && activeItem == indexFloor"
                  >
                    <ul class="clear">
                      <div class="title">助力详情</div>
                      <li
                        class="fl clear"
                        v-for="(itemUser, indexUser) in item.helpUserInfo"
                        :key="indexUser"
                      >
                        <img :src="itemUser.HELP_IMG" class="fl" />
                        <span class="help_tel fl">{{ itemUser.H_MOBILE }}</span>
                        <span class="help_time fl">{{ itemUser.H_TIME }}</span>
                      </li>
                    </ul>
                    <div
                      class="toggle"
                      @click.prevent="
                        toggleList(index, indexFloor, item.helpCount)
                      "
                    >
                      收起
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 开抢 end -->
          </van-tab>
        </van-tabs>

        <!-- 底部广告轮播 start -->
        <swiper-bottom :bottomList="bottomList"></swiper-bottom>
        <!-- 底部广告轮播 end -->
        <p class="notice">-每周六、周日福利活动-</p>
      </main>
    </div>
    <!-- 主页面end -->
    <!-- 遮罩层 -->
    <div class="mask" v-show="showModal" @click="closePop"></div>
    <!-- 成功弹框start -->
    <div class="pop_suc" v-if="altFlag == 'popSuc'">
      <div class="left_num">
        <!-- 立即领取 -->
        <p v-if="typeHelp == 'lq'">
          邀请
          <span class="num">{{ receiveData.helpNum }}位</span>好友助力
        </p>
        <!-- 助力转移成功 -->
        <p v-if="typeHelp == 'zy'">转入成功</p>
        <p v-if="typeHelp == 'zy'">
          还需{{ receiveData.need }}人助力，快去邀请好友助力吧
        </p>
        <!-- 开抢去邀请 -->
        <p v-if="typeHelp == 'kq'">
          已有{{ receiveData.have }}位助力，还差
          <span class="num">{{ receiveData.need }}位</span>好友
        </p>
        <!-- 秒杀去邀请 -->
        <p v-if="typeHelp == 'ms'" style="margin:.45rem auto">
          需
          <span class="num">{{ receiveData.need }}人</span>助力再获取此神券
        </p>
        <p v-if="typeHelp == 'lq' || typeHelp == 'kq'">即可完成助力</p>
      </div>

      <div class="choose_haibao clear">
        <img :src="haibaoInfo.IMG_A" />
        <p class="codeMa">
          <img :src="receiveData.base64" />
        </p>
      </div>
      <div class="btn_arr clear">
        <a class="bg_change fl" @click="change(haibaoInfo)" href="javascript:;"
          >换一张海报</a
        >
        <a
          class="btn_invit fr"
          @click="shareImg(receiveData.PID, haibaoInfo)"
          href="javascript:;"
          >分享给好友</a
        >
      </div>
      <span class="icon_iclose" @click="closePop"></span>
    </div>
    <!-- 成功弹框end -->
    <!-- 失败弹框start -->
    <div class="pop_fail" v-if="altFlag == 'popFail'">
      <img src="../assets/images/fm_fail.png" />
      <p class="fail_text">啊哦~蜂蜜不足了</p>
      <p class="fail_text">快去蜂蜜乐园赚蜂蜜吧~</p>
      <a class="btn_go" @click="goHoneyPark" href="javascript:;">赚蜂蜜</a>
      <p class="tips">偷偷告诉你:掌厅签到1次即可获得1g蜂蜜哦</p>
      <a class="btn_closes" @click="closePop" href="javascript:;">
        <span class="btn_close"></span>
      </a>
    </div>
    <!-- 失败弹框end -->
    <!--关于蜂蜜start-->
    <div class="pop_honey" v-if="altFlag == 'popAbout'">
      <h1>关于蜂蜜</h1>
      <h2 class="title1">什么是蜂蜜？</h2>
      <p>
        蜂蜜是山东移动用户专属优惠，可以通过完成查询流量、话费等任务获得，获得的蜂蜜可以兑换流量和话费，也可以用来参与专属活动。
      </p>
      <a class="btn_gofm" @click="goHoneyPark" href="javascript:;"
        >去蜂蜜乐园</a
      >
      <a class="fm_close" @click="closePop" href="javascript:;"></a>
    </div>
    <!--关于蜂蜜end-->
    <!-- 助力弹框start -->
    <div class="pop_help" v-if="altFlag == 'popHelp'">
      <a :href="pageData.popHref" class="pop_info">
        <img :src="pageData.popImg" />
        <span class="answer" v-if="pageData.popWord">
          <span>{{ pageData.popWord }}</span>
        </span>
      </a>
      <a class="btn_help" @click="helpHand(pageData.crId)" href="javascript:;"
        >助力领券</a
      >
    </div>
    <!-- 助力弹框end-->
    <!-- 邀请弹框start -->
    <div class="pop_share" v-if="altFlag == 'popShare'">
      <img :src="shareImage" />
      <p>请长按保存图片分享给好友</p>
    </div>
    <!-- 邀请弹框end-->
    <!-- 赠送流量弹框start -->
    <div class="pop_send" v-if="altFlag == 'popSend'">
      <img class="img-mf" src="../assets/images/tp_xiaomifeng .png" />
      <p>手慢了，{{ pageData.tc_info && pageData.tc_info.thisName }}已抢完</p>
      <span>
        奉上
        <i>{{ pageData.tc_info && pageData.tc_info.defaultName }}</i
        >,请收下我的心意吧
      </span>
      <a
        class="btn_help"
        @click="receiveCoupon(pageData.tc_info.pId, 'ZD100M')"
        href="javascript:;"
        >立即收下</a
      >
      <i class="icon_iclose" @click="closePop"></i>
    </div>
    <!-- 赠送流量弹框end-->
    <!-- 卡券领取成功弹框start -->
    <div class="pop_sendSuc" v-if="altFlag == 'popSendSuc'">
      <img class="pop_img" src="../assets/images/send_suc.png" />
      <p>收取成功</p>
      <span>可进入“我的卡券”查看使用~</span>
      <span>本周周日24点前有效哦~</span>
      <a class="btn_help" @click="checkNow">立即查看</a>
      <i class="icon_iclose" @click="closePop"></i>
    </div>
    <!-- 卡券领取成功弹框end-->
    <!-- 新人礼送蜂蜜弹框start -->
    <div class="pop_sendSuc" v-if="altFlag == 'popReceive'">
      <img class="pop_img" src="../assets/images/send_suc.png" />
      <p>见面礼</p>
      <span>奉上{{ pageData.honeyGift }}蜂蜜，快去参加活动吧</span>
      <div class="notice">悄悄告诉你：可以到蜂蜜乐园做任务赚蜂蜜</div>
      <a class="btn_help" href="javascript:;" @click="honeyGift">立即收下</a>
      <i class="icon_iclose" @click="closePop"></i>
    </div>
    <!-- 新人礼送蜂蜜弹框end-->
    <!-- 异网用户助力弹框start -->
    <div class="pop_other" v-show="altFlag == 'popOther'">
      <img src="../assets/images/tp.png" />
      <span>加入移动大家庭，惊喜福利等你拿</span>
      <a class="btn_help" href="https://m.sd.10086.cn/sdSLServer/YlbnyOv"
        >去看看</a
      >
      <i class="icon_iclose" @click="closePop"></i>
    </div>
    <!-- 异网用户助力弹框end-->
    <!-- 助力转移弹框start -->
    <div class="pop_transfer" v-if="altFlag == 'popTransfer'">
      <img class="headerImg" src="../assets/images/tp_xiaomifeng .png" alt />
      <p class="title">
        {{ pageData.tc_info && pageData.tc_info.thisName }}已抢完
      </p>
      <p class="subtitle">您获得的助力次数可转至下面的卡券</p>
      <ul class="coupon">
        <li
          v-for="(item, index) in pageData.tc_info &&
            pageData.tc_info.transferList"
          :key="index"
          :style="{
            backgroundImage: 'url(' + item.img + ')',
          }"
          :class="chooseIndex == index ? 'icon-active' : 'icon-default'"
          @click="toggleCoupon(item, index)"
        >
          <span></span>
          <p class="needNum">转入后还需要{{ item.needNum }}人助力</p>
        </li>
      </ul>
      <a class="btn-transer" href="javascript:;" @click="transferCoupon()"
        >去转入</a
      >
      <p
        class="notice"
        v-if="
          pageData.tc_info.defaultName != null &&
            pageData.tc_info.defaultName != ''
        "
      >
        不想转入可直接收下{{ pageData.tc_info && pageData.tc_info.defaultName }}
        <span @click="receiveCoupon(pageData.tc_info.pId, 'SD100M')"
          >立即收下</span
        >
      </p>
      <span class="icon-close" @click="closePop"></span>
    </div>
    <!-- 助力转移弹框弹框end-->
    <!-- 提示助力转移蒙版 -->
    <div class="pop-sellout" v-if="altFlag == 'popSellOut'">
      <img src="../assets/images/sellout.png" alt />
      <img src="../assets/images/button_1.png" alt />
      <a href="javascript:;" class="btn-know" @click="closePop"></a>
    </div>
    <!-- 提示助力转移蒙版 end-->
    <!-- 助力转移成功弹框start -->
    <div class="pop_trSuc" v-if="altFlag == 'popTrSuc'">
      <img src="../assets/images/tp_cg.png" />
      <p>助力次数转移成功</p>
      <span>快去获取{{ lqName }}吧</span>
      <a class="btn_help" @click="kqGet(verifyStatus, ppId)">立即获取</a>
      <span class="icon-close" @click="closePop"></span>
    </div>
    <!-- 助力转移成功弹框end-->
    <!--滑动图片验证码-->
    <div class="hink_main" v-show="altFlag == 'popCheck'">
      <em class="close_em1" @click="closePop"></em>
      <h3>验证</h3>
      <div class="bgimg">
        <ins class="refresh"></ins>
        <img class="bg_img" src="../assets/images/icon_bg.png" />
        <img class="img_code" src="../assets/images/icon_spellCode.png" />
      </div>
      <div class="control" id="code-box">
        <div class="item_track">
          <p>按住滑块，拖动完成上方拼图</p>
        </div>
        <input type="hidden" name="code" class="code-input" />
        <h4></h4>
        <span class="item_btn"></span>
      </div>
    </div>
  </div>
</template>

<script>
/* global plugTool */
/* global sdDefaults*/
/* global appObj*/
import swiper from "@/components/swiper.vue";
import swiperBottom from "@/components/swiperBottom.vue";

export default {
  components: {
    swiper,
    swiperBottom,
  },
  name: "Home",
  data() {
    return {
      pageData: {
        tc_info: {},
      }, //初始化页面数据
      bannerList: [], //头部轮播
      bottomList: [], //底部轮播
      receiveData: {}, //立即领取
      telUserList: [], //话费券中奖列表
      flowUserList: [], //流量券中奖列表
      shareImage: "", //分享生成的海报
      showModal: false, //蒙版遮罩
      altFlag: null, //弹框类型
      countDownTime: "", //倒计时
      crId: "", //助力参数
      jumpLink: "", //卡包链接
      activeIndex: -1, //卡券索引
      activeItem: -1, //楼层索引
      timerStart: null, //活动已开始定时器
      timerNotStart: null, //活动未开始定时器
      showFlag: null, //活动是否开始标识
      typeHelp: null, //立即领取or开抢去邀请or秒杀去邀请
      haiBaoIndex: 0, //海报图索引
      secondFlag: false, //秒杀倒计时是否展示
      haibaoInfo: {}, //海报信息
      num: null, //查看更多默认展示的数量
      nums: null,
      showBoxCoupon: true,
      showBoxTH: true,
      secondList: {},
      kqList: {},
      chooseIndex: 0,
      couponType: "",
      lqName: "",
      verifyStatus: "",
      ppId: "",
      verifyFlag: null,
    };
  },
  mounted() {
    let _this = this;
    window.atouse = _this.atouse;
    //获取手机号
    _this.telMobile =
      _this.$route.query && _this.$route.query.entel
        ? _this.$route.query.entel
        : "";
    //获取助力参数
    _this.crId =
      _this.$route.query && _this.$route.query.crId
        ? _this.$route.query.crId
        : "";
    //获取海报id
    _this.posterId =
      _this.$route.query && _this.$route.query.posterId
        ? _this.$route.query.posterId
        : "";
    //初始化页面
    plugTool.JLoading("数据加载中...");
    setTimeout(() => {
      _this.initPage(_this.crId, _this.posterId);
    }, 500);
    _this.showNavigation();
    if (plugTool.isWeChat()) {
      let shareStrArr = _this.shareRandomNum();
      plugTool.weChatShare(
        shareStrArr[0],
        shareStrArr[1],
        `${sdDefaults.ActBaseAPI}fe/sd1812/index.do`,
        `${sdDefaults.BaseURL}sd1812/img/fx.png`
      );
    }
  },
  destroyed() {
    let _this = this;
    clearInterval(_this.timerStart);
    clearInterval(_this.timerNotStart);
  },
  methods: {
    /**
     * 获取随机号码
     */
    getModel() {
      let prefixArray = [
        "134",
        "135",
        "136",
        "137",
        "138",
        "139",
        "147",
        "150",
        "151",
        "152",
        "157",
        "158",
        "159",
        "182",
        "183",
        "184",
        "187",
        "188",
        "178",
      ];
      let i = parseInt(Math.random() * prefixArray.length, 10);
      let prefix = prefixArray[i];
      return prefix;
    },
    getHuafei() {
      let prefixArray = ["5元话费券", "2元话费券", "1元话费券"];
      let i = parseInt(Math.random() * prefixArray.length, 10);
      let prefix = prefixArray[i];
      return prefix;
    },
    getLiuliang() {
      let prefixArray = ["300MB流量券", "500MB流量券", "1GB流量券"];
      let i = parseInt(Math.random() * prefixArray.length, 10);
      let prefix = prefixArray[i];
      return prefix;
    },
    showNavigation() {
      let _this = this;
      for (let j = 0; j < 12; j++) {
        let telHuafei =
          _this.getModel() +
          "****" +
          parseInt(Math.random() * (9999 - 1001 + 1) + 1001, 10);
        let telLiuliang =
          _this.getModel() +
          "****" +
          parseInt(Math.random() * (9999 - 1001 + 1) + 1001, 10);
        let num = _this.getHuafei();
        let liuliang = _this.getLiuliang();
        let Navigation = `${telHuafei}获取${num}`;
        let Navigations = `${telLiuliang}获取${liuliang}`;
        _this.telUserList.push(Navigation);
        _this.flowUserList.push(Navigations);
      }
    },
    /**
     * 初始化页面数据
     */
    initPage(crid, posterId, tc) {
      let _this = this;
      _this
        .axios({
          method: "get",
          url: `${
            sdDefaults.ActBaseAPI
          }weekendCoupon/doCheckom/initPage.do?crId=${crid}&posterId=${posterId}&tc=${
            tc ? tc : ""
          }&v=${Date.parse(new Date())}`,
        })
        // _this.axios
        //   .get(
        //     `mock/init.json?crId=${crid}&posterId=${posterId}&tc=${
        //       tc ? tc : ""
        //     }&v=${Date.parse(new Date())}`
        //   )
        .then((res) => {
          plugTool.JHideLoading();
          let data = res.data;
          if (data.resCode == "suc") {
            plugTool.insertCode("HDZYM", _this.telMobile, "", "", "20");
            _this.pageData = data; //初始化数据
            _this.bottomList = _this.pageData.bottomList
              ? _this.pageData.bottomList
              : []; //底部轮播图
            _this.bannerList = _this.pageData.bannerAdList
              ? _this.pageData.bannerAdList
              : []; //头部轮播图
            for (let e of _this.pageData.resList) {
              if (e.MODULE_NAME == "th") {
                _this.nums = Number(e.SHOW_DEFAULT); //初始化拿到特惠业务楼层默认展示卡券的数量
              }
              if (e.MODULE_NAME == "yhq") {
                _this.num = Number(e.SHOW_DEFAULT); //初始化拿到精品优惠券楼层默认展示卡券的数量
              }
              if (e.MODULE_NAME == "ms") {
                _this.secondList = e; //秒杀数据
              }
              if (e.MODULE_NAME == "kq") {
                _this.kqList = e; //开抢数据
              }
            }
            //卡券抢光，弹助力转移
            if (data.tc_flag == "yes") {
              _this.showModal = true;
              _this.altFlag = "popTransfer";
              _this.couponType = "ZDQZR";
            }
            // 如果卡券已抢光且无可转移卡券，弹赠送小额流量弹框
            if (data.tc_info != null && !data.tc_info.transferList.length) {
              _this.showModal = true;
              _this.altFlag = "popSend";
            }
            //如果是需要助力，弹出助力弹框
            if (data.zl_flag == "isHelp") {
              _this.showModal = true;
              _this.altFlag = "popHelp";
            }
            //距离开始/结束时间倒计时
            _this.CountDown(
              Math.ceil(_this.pageData.nowTime / 1000) * 1000,
              Math.ceil(_this.pageData.endTime / 1000) * 1000,
              Math.ceil(_this.pageData.startTime / 1000) * 1000
            );
            if (_this.secondList.data) {
              _this.timeDownSecond();
            }
            if (_this.kqList.data) {
              _this.timeDownKq();
            }
            //没有手机号
          } else if (data.resCode == "noMobile") {
            plugTool.Jtoast(data.msg, "bottom");
          }
        })
        .catch(() => {
          plugTool.JHideLoading();
          plugTool.Jtoast("数据加载失败", "bottom");
          console.log("数据加载失败");
        });
    },
    /**
     * 秒杀倒计时
     */
    timeDownSecond() {
      let _this = this;
      let resList = _this.secondList.data.filter((item) => item.startTime);
      if (resList) {
        const nowTime = parseInt(_this.pageData.nowTime);
        const difference = Date.parse(new Date()) - nowTime;
        for (let e of resList) {
          let item = e;
          let timer = setInterval(() => {
            const startTime = item.startTime;
            const curserver = Date.parse(new Date()) - difference;
            const leftTime = startTime - curserver;
            let d, h, m, s;
            d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
            h = Math.floor((leftTime / 1000 / 60 / 60) % 48);
            m = Math.floor((leftTime / 1000 / 60) % 60);
            s = Math.floor((leftTime / 1000) % 60);
            h = h >= 10 ? "" + h : "0" + h;
            m = m >= 10 ? "" + m : "0" + m;
            s = s >= 10 ? "" + s : "0" + s;
            if (leftTime > 172800000) {
              item.timeValue = d + "天";
            } else if (leftTime > 0) {
              item.timeValue = h + ":" + m + ":" + s;
            } else if (leftTime <= 0) {
              clearInterval(timer);
              setTimeout(() => {
                _this.initPage("", "");
                item.timeValue = "进行中";
              }, 1000);
            }
          }, 1000);
        }
      }
    },
    /**
     * 开抢倒计时
     */
    timeDownKq() {
      let _this = this;
      let resList = _this.kqList.data.filter((item) => item.startTime);
      if (resList) {
        const nowTime = parseInt(_this.pageData.nowTime);
        const difference = Date.parse(new Date()) - nowTime;
        for (let e of resList) {
          let item = e;
          let timer = setInterval(() => {
            const startTime = item.startTime;
            const curserver = Date.parse(new Date()) - difference;
            const leftTime = startTime - curserver;
            let d, h, m, s;
            d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
            h = Math.floor((leftTime / 1000 / 60 / 60) % 48);
            m = Math.floor((leftTime / 1000 / 60) % 60);
            s = Math.floor((leftTime / 1000) % 60);
            h = h >= 10 ? "" + h : "0" + h;
            m = m >= 10 ? "" + m : "0" + m;
            s = s >= 10 ? "" + s : "0" + s;
            if (leftTime > 172800000) {
              item.timeValue = d + "天";
            } else if (leftTime > 0) {
              item.timeValue = h + ":" + m + ":" + s;
            } else if (leftTime <= 0) {
              clearInterval(timer);
              setTimeout(() => {
                _this.initPage("", "");
                item.timeValue = "进行中";
              }, 1000);
            }
          }, 1000);
        }
      }
    },
    /**
     * 提醒我
     */
    remind(item, code) {
      let _this = this;
      plugTool.insertCode("HDZYM", _this.telMobile, code, "", "26", "");
      plugTool.JLoading("请稍后...");
      _this
        .axios({
          method: "get",
          url: `${sdDefaults.ActBaseAPI}weekendCoupon/doCheck/remind.do?pId=${
            item.PID
          }&v=${Date.parse(new Date())}`,
        })
        .then((res) => {
          plugTool.JHideLoading();
          let data = res.data;
          if (data.resCode == "remindSuc") {
            //设置提醒成功
            plugTool.Jtoast(data.remindWord, "bottom");
            item.buttonStatus = "cancel";
          } else if (data.resCode == "cancelSuc") {
            //取消提醒成功
            plugTool.Jtoast("已取消", "bottom");
            item.buttonStatus = "remind";
          } else if (data.resCode == "fail") {
            //设置提醒失败
            plugTool.Jtoast("设置提醒失败", "bottom");
          } else if (data.resCode == "isSend") {
            plugTool.Jtoast("提醒短信已下发，记得来参与活动哦~", "bottom");
          }
        })
        .catch(() => {
          plugTool.JHideLoading();
          plugTool.Jtoast("设置提醒失败", "bottom");
        });
    },
    /**
     * 领券
     */
    getNow(tsObj, code) {
      let _this = this;
      plugTool.insertCode("HDZYM", _this.telMobile, code, "", "21", "");
      plugTool.JLoading("正在获取，请稍后...");
      _this
        .axios({
          method: "get",
          url: `${
            sdDefaults.ActBaseAPI
          }weekendCoupon/doCheckom/creatTeam.do?pId=${tsObj.PID}&v=${Date.parse(
            new Date()
          )}`,
        })
        .then((res) => {
          plugTool.JHideLoading();
          let data = res.data;
          if (data.resCode == "suc") {
            _this.typeHelp = "lq";
            //领取成功 赋值
            _this.receiveData = data;
            _this.receiveData.PID = tsObj.PID;
            //初始化默认展示第一张海报
            _this.haibaoInfo = _this.receiveData.posterModule[0];
            //支付成功之后弹框
            plugTool.Jtoast("已支付1g蜂蜜", "bottom");
            setTimeout(() => {
              _this.showModal = true;
              _this.altFlag = "popSuc";
              tsObj.buttonStatus = "toInvite"; //领取成功之后按钮变为去邀请
            }, 600);
          } else if (data.resCode == "notEnough") {
            //蜂蜜不足
            _this.showModal = true;
            _this.altFlag = "popFail";
          } else if (data.resCode == "isOther") {
            //异网
            plugTool.Jtoast("您还不是移动用户，快加入移动大家庭吧", "bottom");
            setTimeout(() => {
              window.location.href = "http://m.sd.10086.cn/sdSLServer/YdkjHtH";
            }, 3000);
          } else if (data.resCode == "end") {
            plugTool.Jtoast("活动结束啦，下个周末早来吧", "bottom");
          } else if (data.resCode == "wks") {
            plugTool.Jtoast("尚未开始，请耐心等待", "bottom");
          } else if (data.resCode == "sell_out") {
            plugTool.Jtoast("来晚一步，下次早来哦", "bottom");
          } else if (data.resCode == "monthLimit") {
            plugTool.Jtoast("亲亲，本面值卡券本月只能领一张哦~", "bottom");
          } else if (data.resCode == "onlyOne") {
            plugTool.Jtoast("爆款神券限领1次哦，看看其他神券吧~", "bottom");
          } else if (data.resCode == "quota") {
            plugTool.Jtoast(data.message, "bottom");
          } else {
            plugTool.Jtoast("获取失败，别着急，再试一次", "bottom");
          }
        })
        .catch(() => {
          plugTool.JHideLoading();
          plugTool.Jtoast("获取失败，别着急，再试一次", "bottom");
        });
    },
    /**
     * 去邀请
     */
    invite(objPid, code) {
      let _this = this;
      plugTool.JLoading("数据加载中...");
      _this
        .axios({
          method: "get",
          url: `${
            sdDefaults.ActBaseAPI
          }weekendCoupon/doCheckom/qyq.do?pId=${objPid}&v=${Date.parse(
            new Date()
          )}`,
        })
        .then((res) => {
          plugTool.JHideLoading();
          let data = res.data;
          if (data.resCode == "suc") {
            //成功 赋值
            _this.receiveData = data;
            _this.receiveData.PID = objPid;
            //初始化默认展示第一张海报
            _this.haibaoInfo = _this.receiveData.posterModule[0];
            if (data.skType == "ms") {
              // 秒杀去邀请
              plugTool.insertCode(
                "HDZYM",
                _this.telMobile,
                "BKQYQ",
                "",
                "21",
                ""
              );
              if (data.useHoney) {
                //秒杀去邀请
                plugTool.Jtoast(
                  `已支付蜂蜜${data.useHoney}g
                `,
                  "bottom"
                );
              }
              _this.typeHelp = "ms";
              setTimeout(() => {
                _this.showModal = true;
                _this.altFlag = "popSuc";
              }, 600);
            } else {
              //开抢去邀请
              plugTool.insertCode("HDZYM", _this.telMobile, code, "", "22", "");
              _this.typeHelp = "kq";
              _this.showModal = true;
              _this.altFlag = "popSuc";
            }
          } else if (data.resCode == "sell_out") {
            plugTool.Jtoast("来晚一步，下次早来哦", "bottom");
          } else if (data.resCode == "notEnough") {
            //蜂蜜不足
            _this.showModal = true;
            _this.altFlag = "popFail";
          } else if (data.resCode == "end") {
            plugTool.Jtoast("活动结束啦，下个周末早来吧", "bottom");
          } else if (data.resCode == "wks") {
            plugTool.Jtoast("尚未开始，请耐心等待", "bottom");
          } else if (data.resCode == "monthLimit") {
            plugTool.Jtoast("亲亲，本面值卡券本月只能领一张哦~", "bottom");
          } else if (data.resCode == "onlyOne") {
            plugTool.Jtoast("爆款神券限领1次哦，看看其他神券吧~", "bottom");
          } else if (data.resCode == "quota") {
            plugTool.Jtoast(data.message, "bottom");
          } else {
            plugTool.Jtoast("获取失败，别着急，再试一次", "bottom");
          }
        })
        .catch(() => {
          plugTool.JHideLoading();
          plugTool.Jtoast("数据加载失败", "bottom");
          console.log("数据加载失败");
        });
    },
    /**
     * 生成分享海报
     */
    //分享活动图片
    shareImg(objPid, posterList) {
      let _this = this;
      plugTool.insertCode("HDZYM", _this.telMobile, "FXTC", "", "22", "");
      _this.showModal = false;
      plugTool.JLoading("请稍后...");
      _this
        .axios({
          method: "get",
          url: `${
            sdDefaults.ActBaseAPI
          }weekendCoupon/doCheck/invite.do?pId=${objPid}&posterId=${
            posterList.posterId
          }&v=${Date.parse(new Date())}`,
        })
        // _this.axios
        //     .get("mock/invite.json")
        .then((res) => {
          plugTool.JHideLoading();
          let data = res.data;
          if (data.resCode == "suc") {
            //成功
            _this.altFlag = null;
            _this.shareImage = data.base64;
            if (window.share && appObj.version() > "4.2.0") {
              //满足图片分享
              _this.shareImage = data.base64.replace(
                "data:image/png;base64,",
                ""
              );
              plugTool.shareH5Img(_this.shareImage);
            } else {
              //标题语分享
              _this.altFlag = "popShare";
              _this.showModal = true;
              let shareStrArr = _this.shareRandomNum();
              plugTool.weChatShare(
                shareStrArr[0],
                shareStrArr[1],
                `${sdDefaults.ActBaseAPI}fe/sd1812/index.do`,
                `${sdDefaults.BaseURL}sd1812/img/fx.png`
              );
            }
          } else if (data.resCode == "fail") {
            //失败
            plugTool.Jtoast("邀请失败，别着急，再试一次", "bottom");
            _this.altFlag = null;
          } else if (data.resCode == "isOther") {
            plugTool.Jtoast("您还不是移动用户，快加入移动大家庭吧", "bottom");
            setInterval(() => {
              window.location.href = "http://m.sd.10086.cn/sdSLServer/YdkjHtH";
            }, 3000);
          } else if (data.resCode == "end") {
            plugTool.Jtoast("活动结束啦，下个周末早来吧", "bottom");
            _this.altFlag = null;
          } else if (data.resCode == "monthLimit") {
            plugTool.Jtoast("亲亲，本面值卡券本月只能领一张哦~", "bottom");
            _this.altFlag = null;
          } else {
            plugTool.Jtoast("邀请失败，别着急，再试一次", "bottom");
            _this.altFlag = null;
          }
        })
        .catch(() => {
          plugTool.JHideLoading();
        });
    },
    /**
     * 助力
     */
    helpHand(crid) {
      let _this = this;
      plugTool.insertCode("ZLYM", _this.telMobile, "ZLLQ", "", "21", "");
      plugTool.JLoading("请稍后...");
      _this
        .axios({
          method: "get",
          url:
            sdDefaults.ActBaseAPI +
            `weekendCoupon/doCheckom/help.do?crId=` +
            crid +
            `&v=` +
            Date.parse(new Date()),
        })
        .then((res) => {
          plugTool.JHideLoading();
          let data = res.data;
          if (data.resCode == "suc") {
            plugTool.Jtoast("助力成功", "bottom");
            _this.altFlag = null;
            _this.showModal = false;
          } else if (data.resCode == "fail") {
            plugTool.Jtoast("助力失败，别着急，再试一次", "bottom");
          } else if (data.resCode == "repeat") {
            plugTool.Jtoast("您太热情了，已助力成功", "bottom");
            _this.altFlag = null;
            _this.showModal = false;
          } else if (data.resCode == "self") {
            plugTool.Jtoast("太调皮了，不能给自己助力哦", " bottom");
            _this.altFlag = null;
            _this.showModal = false;
          } else if (data.resCode == "noChance") {
            plugTool.Jtoast("您的助力机会已用完，快去领券吧", "bottom");
            _this.altFlag = null;
            _this.showModal = false;
          } else if (data.resCode == "full") {
            plugTool.Jtoast("您的好友已助力完成，您也去领一张神券吧", "bottom");
            _this.altFlag = null;
            _this.showModal = false;
          } else if (data.resCode == "end") {
            plugTool.Jtoast("活动结束啦，下个周末早来吧", "bottom");
          } else if (data.resCode == "sx") {
            plugTool.Jtoast("活动已结束", "bottom");
          } else {
            plugTool.Jtoast("助力失败，别着急，再试一次", "bottom");
          }
          if (data.otherFlag == "yes") {
            _this.altFlag = "popOther";
            _this.showModal = true;
          }
        })
        .catch(() => {
          plugTool.JHideLoading();
          plugTool.Jtoast("助力失败，别着急，再试一次", "bottom");
        });
    },
    /**
     * 秒杀验证
     */
    kqGet(verifyStatus, ppId, code) {
      let _this = this;
      console.log(verifyStatus, this.verifyFlag);
      code =
        code == undefined
          ? _this.couponType == "ZDQZR"
            ? "ZDCGLQ"
            : "SDCGLQ"
          : code;
      plugTool.insertCode("HDZYM", _this.telMobile, code, "", "28", "");
      //如果需要验证 弹出验证弹框
      if (verifyStatus == 1 && _this.verifyFlag != false) {
        _this.showModal = true;
        _this.altFlag = "popCheck";
        _this.ppId = ppId;
        plugTool.insertCode("HDZYM", _this.telMobile, code, "", "24", "");
        return;
        //不需要验证 不弹框
      } else if (verifyStatus == 0 || _this.verifyFlag == false) {
        _this.showModal = false;
        _this.altFlag = null;
        _this.toUse(ppId);
      }
    },
    atouse() {
      this.toUse(this.ppId);
    },
    /**
     *领取使用
     */
    toUse(ppId) {
      let _this = this;
      plugTool.JLoading("请稍后...");
      _this.altFlag = null;
      _this
        .axios({
          method: "get",
          url: `${
            sdDefaults.ActBaseAPI
          }weekendCoupon/doCheck/coupon.do?pId=${ppId}&v=${Date.parse(
            new Date()
          )}`,
        })
        // _this.axios
        //     .get(`mock/coupon.json?pId=${ppId}`)
        .then((res) => {
          plugTool.JHideLoading();
          let data = res.data;
          _this.altFlag = null;
          _this.showModal = false;
          if (data.resCode == "suc") {
            window.location.href = data.jumpLink;
          } else if (data.resCode == "isOther") {
            plugTool.Jtoast("您还不是移动用户，快加入移动大家庭吧", "bottom");
            setTimeout(() => {
              window.location.href = "http://m.sd.10086.cn/sdSLServer/YdkjHtH";
            }, 3000);
          } else if (data.resCode == "c_max") {
            window.location.href = data.jumpLink;
          } else if (data.resCode == "m_max") {
            plugTool.Jtoast("不要贪心哦，您已使用一张", "bottom");
            _this.verifyFlag = false;
          } else if (data.resCode == "fail") {
            plugTool.Jtoast("获取失败了，别着急，再试一次", "bottom");
            _this.verifyFlag = false;
            console.log(_this.verifyFlag);
          } else if (data.resCode == "end") {
            plugTool.Jtoast("活动结束啦，下个周末早来吧", "bottom");
            _this.verifyFlag = false;
          } else if (data.resCode == "wks") {
            plugTool.Jtoast("尚未开始，请耐心等待", "bottom");
          } else if (data.resCode == "sell_out") {
            if (data.tc_flag == "yes") {
              if (!_this.pageData.tc_info) {
                _this.pageData.tc_info = {};
              }
              _this.pageData.tc_info.thisName = data.tc_info.thisName;
              _this.pageData.tc_info.transferList = data.tc_info.transferList;
              _this.pageData.tc_info.defaultName = data.tc_info.defaultName;
              _this.pageData.tc_info.pId = data.tc_info.pId;
              _this.showModal = true;
              _this.pageData.tc_info.transferList.length == 0
                ? (_this.altFlag = "popSend")
                : (_this.altFlag = "popTransfer");
              _this.verifyFlag = false;
            } else {
              plugTool.Jtoast("来晚一步，下次早来哦", "bottom");
              _this.verifyFlag = false;
            }
          } else if (data.resCode == "monthLimit") {
            plugTool.Jtoast("亲亲，本面值卡券本月只能领一张哦~", "bottom");
            _this.verifyFlag = false;
          } else if (data.resCode == "quota") {
            plugTool.Jtoast(data.message, "bottom");
          } else if (data.resCode == "quota_final") {
            plugTool.Jtoast(
              "您本月的领券额度已达上限，不要太贪心哦~",
              "bottom"
            );
          } else {
            plugTool.Jtoast("获取失败了，别着急，再试一次", "bottom");
            _this.showModal = false;
            _this.verifyFlag = false;
          }
        })
        .catch((err) => {
          console.log(err);
          plugTool.JHideLoading();
          plugTool.Jtoast("获取失败，别着急，再试一次", "bottom");
          // itemObj.verifyStatus = 0;
          _this.verifyFlag = false;
        });
    },
    /**
     * 去使用
     */
    goUse(item, code) {
      let _this = this;
      item.SECKILL_TYPE == "ms" ? (code = "BKQSY") : (code = "MSQSY");
      plugTool.insertCode("HDZYM", _this.telMobile, code, "", "24", "");
      window.location.href = item.jumpLink;
    },
    /**
     * 特惠业务立即办理
     */
    handle(itemObj) {
      plugTool.insertCode("HDZYM", this.telMobile, "LJBL", "", "25", "");
      window.location.href = itemObj.REMAKE;
    },
    honeyGift() {
      let _this = this;
      plugTool.JLoading("请稍后...");
      // _this.axios
      //     .get("mock/honeyGift.json")
      _this
        .axios({
          method: "get",
          url: `${
            sdDefaults.ActBaseAPI
          }weekendCoupon/doCheck/honeyGift.do?v=${Date.parse(new Date())}`,
        })
        .then((res) => {
          plugTool.JHideLoading();
          let data = res.data;
          if (data.resCode == "suc") {
            plugTool.Jtoast("收取成功，快去参与活动吧~", "bottom");
            _this.pageData.honey = data.haveHoneyNum;
            setTimeout(() => {
              _this.altFlag = null;
              _this.showModal = false;
              _this.pageData.honeyButton = "notShow";
            }, 1000);
          } else if (data.resCode == "fail") {
            plugTool.Jtoast("收取失败，换个姿势再试一次~", "bottom");
          } else if (data.resCode == "have") {
            plugTool.Jtoast("已经领过蜂蜜啦，快去参与活动吧~", "bottom");
            setTimeout(() => {
              _this.altFlag = null;
              _this.showModal = false;
              _this.pageData.honeyButton = "notShow";
            }, 1000);
          } else {
            plugTool.Jtoast("获取失败", "bottom");
            setTimeout(() => {
              _this.altFlag = null;
              _this.showModal = false;
            }, 1000);
          }
        })
        .catch(() => {
          plugTool.JHideLoading();
          plugTool.Jtoast("数据加载失败", "bottom");
          console.log("数据加载失败");
        });
    },
    /**
     * 赠送卡券
     */
    receiveCoupon(pid, code) {
      let _this = this;
      plugTool.JLoading("请稍后...");
      plugTool.insertCode("HDZYM", _this.telMobile, code, "", "25", "");
      _this
        .axios({
          method: "get",
          url: `${
            sdDefaults.ActBaseAPI
          }weekendCoupon/doCheck/tcCoupon.do?pId=${pid}&v=${Date.parse(
            new Date()
          )}`,
        })
        .then((res) => {
          plugTool.JHideLoading();
          let data = res.data;
          if (data.resCode == "suc") {
            plugTool.Jtoast("获取成功", "bottom");
            _this.jumpLink = data.link;
            _this.altFlag = "popSendSuc";
          } else if (data.resCode == "fail") {
            plugTool.Jtoast("获取失败", "bottom");
          } else if (data.resCode == "ylq") {
            plugTool.Jtoast("已经获取成功，不要太贪心哦~", "bottom");
          } else if (data.resCode == "end") {
            plugTool.Jtoast("活动结束了", "bottom");
          } else if (data.resCode == "sell_out") {
            plugTool.Jtoast("来晚了，卡券已被抢光~", "bottom");
          } else if (data.resCode == "quota_final") {
            plugTool.Jtoast(
              "您本月的领券额度已达上限，不要太贪心哦~",
              "bottom"
            );
          } else {
            plugTool.Jtoast("获取失败", "bottom");
          }
        })
        .catch(() => {
          plugTool.JHideLoading();
          plugTool.Jtoast("数据加载失败", "bottom");
          console.log("数据加载失败");
        });
    },
    /**
     * 弹出关于蜂蜜弹窗
     */
    showPopHoney() {
      let _this = this;
      _this.showModal = true;
      _this.altFlag = "popAbout";
      plugTool.insertCode("HDZYM", _this.telMobile, "GYFM", "", "21", "");
    },
    /**
     * 点击遮罩关闭相关弹窗
     */
    closePop() {
      let _this = this;
      if (_this.altFlag == "popTransfer") {
        _this.axios
          .get(
            `${
              sdDefaults.ActBaseAPI
            }weekendCoupon/doCheck/transferMatte.do?v=${Date.parse(new Date())}`
          )
          // .get("mock/close.json")
          .then((res) => {
            if (res.data.resCode == "show") {
              _this.altFlag = "popSellOut";
            } else {
              _this.altFlag = null;
              _this.showModal = false;
            }
          });
      } else if (
        (_this.typeHelp == "zy" && _this.altFlag == "popSuc") ||
        _this.altFlag == "popTrSuc" ||
        _this.altFlag == "popShare"
      ) {
        _this.initPage(_this.crId, _this.posterId, "notTc");
        _this.altFlag = null;
        _this.showModal = false;
      } else if (_this.altFlag == "popHelp") {
        if (_this.pageData.tc_flag == "yes") {
          !_this.pageData.tc_info.transferList.length
            ? (_this.altFlag = "popSend")
            : (_this.altFlag = "popTransfer");
        } else {
          _this.altFlag = null;
          _this.showModal = false;
        }
      } else {
        _this.altFlag = null;
        _this.showModal = false;
      }

      plugTool.insertCode("HDZYM", _this.telMobile, "TCGB", "", "32", "");
    },
    checkNow() {
      let _this = this;
      plugTool.insertCode("HDZYM", _this.telMobile, "100MLJLQ", "", "25", "");
      window.location.href = _this.jumpLink;
    },
    /**
     * 查看更多
     */
    showMoreCoupon(length, limit) {
      let _this = this;
      _this.showBoxCoupon = !_this.showBoxCoupon;
      _this.num = _this.showBoxCoupon ? Number(limit) : length;
    },
    showMoreTH(length, limit) {
      let _this = this;
      _this.showBoxTH = !_this.showBoxTH;
      _this.nums = _this.showBoxTH ? Number(limit) : length;
    },
    onClick(name, title) {
      switch (title) {
        case "专享福利":
          plugTool.insertCode("HDZYM", this.telMobile, "ZXFL", "", "21", "");
          break;
        case "话费券":
          plugTool.insertCode("HDZYM", this.telMobile, "HF", "", "21", "");
          break;
        case "流量券":
          plugTool.insertCode("HDZYM", this.telMobile, "LL", "", "21", "");
          break;
        case "精品优惠":
          plugTool.insertCode("HDZYM", this.telMobile, "JPYY", "", "21", "");
          break;
        case "特惠业务":
          plugTool.insertCode("HDZYM", this.telMobile, "THYW", "", "21", "");
          break;
        case "爆款好券":
          plugTool.insertCode("HDZYM", this.telMobile, "BKMS", "", "21", "");
          break;
        case "好券推荐":
          plugTool.insertCode("HDZYM", this.telMobile, "XSMS", "", "21", "");
          break;
      }
    },
    /**
     * 跳转蜂蜜乐园
     */
    goHoneyPark() {
      plugTool.insertCode("HDZYM", this.telMobile, "", "", "22", "");
      if (window.share) {
        //掌厅环境内
        var version = window.share.version();
        if (version >= "4.5.0") {
          //打开蜂蜜乐园原生链接
          window.location.href = "sdmccweb://sd.10086.cn/honeybeeEden";
        } else {
          window.location.href =
            "https://m.sd.10086.cn/sd_h5_service/taskCenter/taskIndex.do";
        }
      } else {
        window.location.href =
          "https://m.sd.10086.cn/sd_act_service/download/initPage.do?module=fmly20191125";
      }
    },
    //点击查看好友助力表
    toggleList(index, itemIndexs, helpNum) {
      let _this = this;
      if (helpNum == 0) {
        return;
      }
      _this.activeIndex = _this.activeIndex == index ? -1 : index; //卡券索引
      _this.activeItem = itemIndexs; //楼层索引
    },
    /**
     * 点击换一换更换海报
     */
    change(haibaoInfo) {
      let _this = this;
      plugTool.insertCode("HDZYM", _this.telMobile, "HYH", "", "25", "");
      _this.getImg(haibaoInfo.posterId);
    },
    /**
     * 顺序切换海报
     */
    getImg() {
      let _this = this;
      _this.haiBaoIndex++;
      if (_this.haiBaoIndex >= _this.receiveData.posterModule.length) {
        _this.haiBaoIndex = 0;
      }
      _this.haibaoInfo = _this.receiveData.posterModule[_this.haiBaoIndex];
    },
    /**
     * 用户反馈
     */
    goFeedBack() {
      plugTool.insertCode("HDZYM", this.telMobile, "WXS", "", "21", "");
      window.location.href =
        "https://m.sd.10086.cn/sd_h5_service/middlePage/jumpPage.do?resourceMenu=周末抢神券&resourceUrl=https://m.sd.10086.cn/sd_act_service/fe/sd1806/index.do";
    },
    toggleCoupon(item, index) {
      this.chooseIndex = index;
    },
    receiveHoney() {
      plugTool.insertCode("HDZYM", this.telMobile, "SFM", "", "21", "");
      this.altFlag = "popReceive";
      this.showModal = true;
    },
    /**
     * 助力转移
     */
    transfer(item) {
      let _this = this;
      plugTool.insertCode("HDZYM", _this.telMobile, "SDZLZY", "", "33", "");
      if (!_this.pageData.tc_info) {
        _this.pageData.tc_info = {};
      }
      _this.showModal = true;
      _this.couponType = "SDQZR";
      _this.pageData.tc_info.thisName = item.tc_info.thisName;
      _this.pageData.tc_info.transferList = item.tc_info.transferList;
      _this.pageData.tc_info.defaultName = item.tc_info.defaultName;
      _this.pageData.tc_info.pId = item.tc_info.pId;
      if (_this.pageData.tc_info.transferList.length == 0) {
        _this.altFlag = "popSend";
        item.transferButton = "notShow";
      } else {
        _this.altFlag = "popTransfer";
      }
    },
    /**
     * 去转入
     */
    transferCoupon() {
      let _this = this;
      plugTool.JLoading("请稍后...");
      _this
        .axios({
          method: "get",
          url: `${sdDefaults.ActBaseAPI}weekendCoupon/doCheck/transfer.do?pId=${
            _this.pageData.tc_info.pId
          }&tId=${
            _this.pageData.tc_info.transferList[_this.chooseIndex].tId
          }&v=${Date.parse(new Date())}`,
        })
        // _this.axios
        //     .get(
        //         `mock/transfer3.json?pId=${
        //             _this.pageData.tc_info.pId
        //         }&tId=${
        //             _this.pageData.tc_info.transferList[_this.chooseIndex]
        //                 .tId
        //         }`
        //     )
        .then((res) => {
          plugTool.JHideLoading();
          let data = res.data;
          let codeType = _this.couponType == "SDQZR" ? "SD" : "ZD";
          switch (data.resCode) {
            case "suc_yq":
              //转入成功 未满团 去邀请
              plugTool.insertCode(
                "HDZYM",
                _this.telMobile,
                codeType + "CGYQ",
                "",
                "22",
                ""
              );
              _this.altFlag = "popSuc";
              _this.typeHelp = "zy";
              _this.receiveData.need = data.needNum;
              _this.receiveData.base64 = data.base64;
              _this.receiveData.posterModule = data.posterModule;
              _this.receiveData.PID = data.pId;
              _this.haibaoInfo = _this.receiveData.posterModule[0];
              break;
            case "suc_lq":
              //转入成功恰好满团  弹领取卡券的弹框
              _this.altFlag = "popTrSuc";
              _this.lqName = data.lqName;
              _this.verifyStatus = data.verifyStatus;
              _this.ppId = data.pId;
              break;
            case "sellOut":
              //已抢光 弹助力转移
              plugTool.insertCode(
                "HDZYM",
                _this.telMobile,
                codeType + "SBXW",
                "",
                "29",
                ""
              );
              _this.pageData.tc_info = {};
              _this.altFlag = null;
              if (data.tc_flag == "yes") {
                if (!_this.pageData.tc_info) {
                  _this.pageData.tc_info = {};
                }
                _this.pageData.tc_info.thisName = data.tc_info.thisName;
                _this.pageData.tc_info.transferList = data.tc_info.transferList;
                _this.pageData.tc_info.defaultName = data.tc_info.defaultName;
                _this.pageData.tc_info.pId = data.tc_info.pId;
                if (_this.pageData.tc_info.transferList.length == 0) {
                  _this.altFlag = "popSend";
                } else {
                  _this.altFlag = "popTransfer";
                }
                // _this.pageData.tc_info.transferList.length == 0
                //     ? (_this.altFlag = "popSend")
                //     : (_this.altFlag = "popTransfer");
              } else {
                plugTool.Jtoast("来晚一步，下次早来哦", "bottom");
                _this.altFlag = null;
                _this.showModal = false;
              }
              break;
            case "fail":
              plugTool.Jtoast("转入失败", "bottom");
              break;
            case "getllq":
              plugTool.Jtoast("您已经获取过100M流量了", "bottom");
              break;
            default:
              plugTool.Jtoast("转入失败", "bottom");
          }
        })
        .catch((err) => {
          console.log(err);
          plugTool.JHideLoading();
          plugTool.Jtoast("转入失败", "bottom");
        });
    },
    //随机分享
    shareRandomNum() {
      //标语随机
      let shareStringArr = [
        [
          "曾几何时，也曾追求轰轰烈烈，而今，我只想要这张大额券~",
          "快来看看这张大额福利券~",
        ],
      ];
      let strArrLeng = shareStringArr.length - 1;
      let randomVal = "";
      randomVal = shareStringArr[this.randomNum(0, strArrLeng)];
      return randomVal;
    },
    /**
     * 倒计时
     */
    CountDown: function CountDown(curTime, endTime, startTime) {
      let _this = this;
      const difference = Date.parse(new Date()) - curTime;
      //活动已开始，计算结束时间倒计时
      if (curTime > startTime && curTime < endTime) {
        _this.showFlag = true;
        if (_this.timerNotStart) clearInterval(_this.timerNotStart);
        _this.timerStart = setInterval(() => {
          _this.countDownStart(difference, endTime);
        }, 1000);
      } else if (curTime < startTime) {
        _this.showFlag = false;
        //活动未开始，计算开始时间倒计时
        if (_this.timerStart) clearInterval(_this.timerStart);
        _this.timerNotStart = setInterval(() => {
          _this.countDownNotStart(difference, startTime, endTime);
        }, 1000);
      } else {
        //活动已结束
        _this.showFlag = false;
        if (_this.timerStart) clearInterval(_this.timerStart);
        if (_this.timerNotStart) clearInterval(_this.timerNotStart);
        _this.countDownTime = "活动未开始";
      }
    },
    //活动已开始倒计时
    countDownStart(difference, endTime) {
      let _this = this;
      const curserver = Date.parse(new Date()) - difference;
      let timeLeft = endTime - curserver;
      let d, h, m, s;
      d = Math.floor(timeLeft / 1000 / 60 / 60 / 24);
      h = Math.floor((timeLeft / 1000 / 60 / 60) % 48);
      m = Math.floor((timeLeft / 1000 / 60) % 60);
      s = Math.floor((timeLeft / 1000) % 60);
      h = h >= 10 ? "" + h : "0" + h;
      m = m >= 10 ? "" + m : "0" + m;
      s = s >= 10 ? "" + s : "0" + s;
      if (timeLeft > 172800000) {
        _this.countDownTime = d + "天";
      } else {
        _this.countDownTime = h + ":" + m + ":" + s;
      }
      if (timeLeft < 0) {
        clearInterval(_this.timerStart);
        _this.showFlag = false;
        _this.countDownTime = "活动未开始";
      }
    },
    //活动未开始倒计时
    countDownNotStart(difference, startTime, endTime) {
      let _this = this;
      const curserver = Date.parse(new Date()) - difference;
      let timeLeft = startTime - curserver;
      let d, h, m, s;
      d = Math.floor(timeLeft / 1000 / 60 / 60 / 24);
      h = Math.floor((timeLeft / 1000 / 60 / 60) % 24);
      m = Math.floor((timeLeft / 1000 / 60) % 60);
      s = Math.floor((timeLeft / 1000) % 60);
      h = h >= 10 ? "" + h : "0" + h;
      m = m >= 10 ? "" + m : "0" + m;
      s = s >= 10 ? "" + s : "0" + s;
      if (timeLeft > 86400000) {
        _this.countDownTime = d + "天";
      } else if (timeLeft > 0) {
        _this.countDownTime = h + ":" + m + ":" + s;
      } else if (timeLeft <= 0) {
        //清除未开始定时器
        clearInterval(_this.timerNotStart);
        _this.timerStart = setInterval(() => {
          _this.countDownStart(difference, endTime);
          _this.showFlag = true;
        }, 1000);
      }
    },
  },
};
</script>
<style lang="scss">
.container {
  width: 750px;
  height: 100%;
  overflow-y: hidden;
  .wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    header {
      position: relative;
      width: 100%;
      height: 492px;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
      .feedback {
        position: absolute;
        top: 70px;
        right: 0;
        width: 34px;
        height: 138px;
        z-index: 20;
        border-radius: 8px 0px 0px 8px;
        background: url("../assets/images/icon-chat.png") no-repeat;
        background-size: 100% 100%;
      }
      .btn_rule {
        position: absolute;
        top: 20px;
        left: 30px;
        padding-left: 30px;
        font-size: 24px;
        color: #fff;
        opacity: 0.6;
        z-index: 20;
        &:before {
          display: inline-block;
          vertical-align: middle;
          margin-right: 10px;
          content: "";
          position: absolute;
          left: 0;
          top: 5px;
          width: 21px;
          height: 24px;
          background: url("../assets/images/icon_rule.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .btn_about {
        position: absolute;
        padding-left: 30px;
        top: 18px;
        right: 30px;
        font-size: 24px;
        color: #fff;
        opacity: 0.6;
        z-index: 20;
        &:before {
          position: absolute;
          left: 0;
          top: 4px;
          vertical-align: middle;
          margin-right: 10px;
          content: "";
          width: 26px;
          height: 26px;
          background: url("../assets/images/icon_about.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .activity_noStart {
        background: url("../assets/images/tab1.png") no-repeat;
        background-size: 100% 100%;
        z-index: 2;
      }
      @at-root.activity_info {
        position: absolute;
        left: 0;
        right: 0;
        top: 190px;
        margin: auto;
        width: 708px;
        height: 98px;
        background: url("../assets/images/tab2.png") no-repeat;
        background-size: 100% 100%;
        z-index: 2;
        .time {
          position: absolute;
          left: 220px;
          top: 25px;
          font-size: 24px;
          color: #fff;
        }
        .myfm {
          position: absolute;
          left: 525px;
          top: 25px;
          font-size: 24px;
          color: #fff;
        }
        .receive-honey {
          position: absolute;
          right: 20px;
          top: 25px;
          width: 80px;
          height: 32px;
          background-image: linear-gradient(0deg, #ffc424 0%, #feec62 100%),
            linear-gradient(#fee857, #fee857);
          box-shadow: inset -1px -3px 9px 0px rgba(254, 160, 50, 0.82);
          border-radius: 16px;
          font-size: 18px;
          font-weight: bold;
          line-height: 32px;
          color: #b72328;
          text-align: center;
        }
      }
    }
    main {
      position: absolute;
      top: 492px;
      width: 750px;
      background: #fff;
      border-radius: 24px;
      padding: 0 30px 30px;
      .title {
        font-size: 32px;
        color: #232323;
        margin-bottom: 18px;
        .tip {
          font-size: 26px;
          color: #888;
          margin-left: 20px;
        }
      }
      .li_list {
        & > li {
          width: 690px;
          position: relative;
          background-size: 100% 100%;
          margin-bottom: 25px;
          border-radius: 10px;
        }
        .coupon_link {
          position: relative;
          display: inline-block;
          height: 200px;
          width: 100%;
          background-size: 100% 100%;
          border-radius: 10px;
          box-shadow: 0px 4px 8px 0px rgba(226, 204, 204, 0.4);
          .help_hand {
            position: absolute;
            left: 290px;
            bottom: 35px;
            width: 200px;
            @at-root.schedule {
              display: flex;
              width: 180px;
              height: 24px;
              .active {
                opacity: 1;
              }
              .actives {
                border-radius: 8px !important;
              }
              li {
                flex: 1;
                border-left: 2px solid #fff;
                background: #ff6478;
                opacity: 0.3;
                &:first-child {
                  border-left: 0;
                  border-radius: 8px 0 0 8px;
                }
                &:last-child {
                  border-radius: 0 8px 8px 0;
                }
              }
            }
            .help_num {
              font-size: 20px;
              color: #ff6478;
              margin-bottom: 10px;
              &:after {
                content: "";
                display: inline-block;
                margin-left: 5px;
                width: 15px;
                height: 9px;
                background: url("../assets/images/icon_num2.png");
                background-size: 100% 100%;
                vertical-align: middle;
                margin-top: 3px;
              }
            }
            .help_active {
              &:after {
                content: "";
                display: inline-block;
                margin-left: 5px;
                width: 9px;
                height: 15px;
                background: url("../assets/images/icon_num1.png");
                background-size: 100% 100%;
                vertical-align: middle;
                margin-top: 3px;
              }
            }
          }
        }
        .help_info {
          .title {
            position: relative;
            font-size: 20px;
            color: #232323;
            text-align: center;
            padding-left: 0;
            margin: 25px auto;
            &:before {
              content: "";
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              margin: auto;
              display: block;
              width: 272px;
              height: 4px;
              background: url("../assets/images/detail_title.png") no-repeat;
              background-size: 100% 100%;
            }
          }
          li {
            width: 50%;
            position: relative;
            margin-bottom: 10px;
            padding-left: 85px;
          }
          img {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 20px;
            margin: auto;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            vertical-align: middle;
          }
          .help_tel {
            font-size: 20px;
            color: #666;
            overflow: hidden;
            padding-top: 15px;
          }
          .help_time {
            font-size: 18px;
            color: #999;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .toggle {
          font-size: 20px;
          color: #e30c32;
          text-align: center;
          padding: 10px 0 30px;
          &:after {
            content: "";
            display: inline-block;
            vertical-align: middle;
            width: 16px;
            height: 14px;
            background: url("../assets/images/icon_toggle.png") no-repeat;
            background-size: 100% 100%;
            margin-left: 10px;
          }
        }
        .tel_btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          bottom: 0;
          right: 28px;
          margin: auto;
        }
        .btn {
          display: block;
          width: 144px;
          height: 56px;
          border-radius: 10px 10px 0px 0px;
          font-size: 28px;
          color: #fff;
          text-align: center;
          line-height: 56px;
        }
        .btn_same {
          background-image: linear-gradient(-90deg, #ff1e63 0%, #ff5c8e 100%);
        }
        .btn_common {
          background-image: linear-gradient(-90deg, #e10930 0%, #fe2843 100%);
        }
        .btn_use {
          background: #fff;
          color: #ef1839;
        }
        .btn_end {
          background: #b0b0b0;
          color: #fff;
        }
        .limit {
          font-size: 20px;
          text-align: center;
          width: 144px;
          height: 36px;
          line-height: 36px;
          background-color: #fff;
          border-radius: 0px 0px 10px 10px;
          opacity: 0.5;
        }
        .limit_num {
          color: #e30c32;
        }
        .limit_end {
          color: #b0b0b0;
        }
        .p-transfer {
          width: 144px;
          height: 36px;
          background-color: #ff7038;
          border-radius: 0px 0px 10px 10px;
          font-size: 20px;
          color: #fff;
          text-align: center;
          line-height: 36px;
          &::before {
            content: "";
            display: inline-block;
            width: 19px;
            height: 21px;
            background: url("../assets/images/icon_zhuanyi.png");
            background-size: 100% 100%;
            vertical-align: middle;
          }
        }
      }
      .btnToggle {
        display: block;
        margin: 30px auto;
        width: 220px;
        height: 56px;
      }
      .open {
        background: url("../assets/images/open.png") no-repeat;
        background-size: 100% 100%;
      }
      .retract {
        background: url("../assets/images/retract.png") no-repeat;
        background-size: 100% 100%;
      }
      .ms_list {
        .title {
          position: relative;
          padding-left: 38px;
          .name {
            &:before {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              margin-right: 10px;
              width: 31px;
              height: 35px;
              background: url("../assets/images/icon_hot.png") no-repeat;
              background-size: 100% 100%;
              vertical-align: middle;
              border-radius: 5px;
            }
          }
        }
        li {
          height: auto;
          .coupon_link {
            position: relative;
            height: 280px;
          }
          .btn_type {
            position: absolute;
            bottom: 25px;
            right: 30px;
          }
          .tag {
            position: absolute;
            left: 20px;
            bottom: 20px;
            width: 240px;
            height: 56px;
            background: url("../assets/images/sunday.png") no-repeat;
            background-size: 100% 100%;
            span {
              font-size: 24px;
              color: #fff;
            }
            .tag_title {
              width: 88px;
              height: 56px;
              line-height: 56px;
              margin: auto;
              text-align: center;
            }
            .tag_subtitle {
              width: 140px;
              height: 40px;
              line-height: 40px;
              margin: 16px 0 0 10px;
              text-align: center;
            }
          }
        }
      }
      .th_list {
        .title {
          position: relative;
          padding-left: 20px;

          .fl {
            &:before {
              content: "";
              position: absolute;
              top: 4px;
              left: 0;
              margin-right: 10px;
              width: 10px;
              height: 35px;
              background-image: linear-gradient(
                -90deg,
                #dd824a 0%,
                #ffbf7a 100%
              );
              border-radius: 5px;
              vertical-align: middle;
              border-radius: 5px;
            }
          }
        }
      }
      .yh_list {
        .title {
          position: relative;
          padding-left: 20px;
          .fl {
            &:before {
              content: "";
              position: absolute;
              top: 4px;
              left: 0;
              margin-right: 10px;
              width: 10px;
              height: 35px;
              background-image: linear-gradient(
                -90deg,
                #ff0066 0%,
                #ff7a93 100%
              );
              border-radius: 5px;
              vertical-align: middle;
              border-radius: 5px;
            }
          }
        }
      }
      .hf_list {
        .title {
          position: relative;
          padding-left: 20px;
          .fl {
            &:before {
              content: "";
              position: absolute;
              top: 4px;
              left: 0;
              margin-right: 10px;
              width: 10px;
              height: 35px;
              background-image: linear-gradient(
                -90deg,
                #e10930 0%,
                #fe2843 100%
              );
              border-radius: 5px;
              vertical-align: middle;
              border-radius: 5px;
            }
          }
        }
        .li_list {
          .help_hand {
            left: 225px;
            bottom: 25px;
          }
        }
      }
      .ll_list {
        .title {
          position: relative;
          padding-left: 20px;
          .fl {
            &:before {
              content: "";
              position: absolute;
              top: 4px;
              left: 0;
              margin-right: 10px;
              width: 10px;
              height: 35px;
              background-image: linear-gradient(
                -90deg,
                #0964e1 0%,
                #2892fe 100%
              );
              border-radius: 5px;
              vertical-align: middle;
              border-radius: 5px;
            }
          }
        }

        .li_list {
          .help_hand {
            left: 225px;
            bottom: 25px;
          }
        }
      }
      .zx_list {
        .title {
          position: relative;
          padding-left: 20px;
          .fl {
            &:before {
              content: "";
              position: absolute;
              top: 4px;
              left: 0;
              margin-right: 10px;
              width: 10px;
              height: 35px;
              background-image: linear-gradient(
                -90deg,
                #fc9958 0%,
                #ffde6c 100%
              );
              border-radius: 5px;
              vertical-align: middle;
              border-radius: 5px;
            }
          }
        }

        .li_list {
          .help_hand {
            left: 225px;
            bottom: 25px;
          }
        }
      }
    }
  }
  .notice {
    font-size: 20px;
    color: #bbb;
    text-align: center;
    margin-top: 20px;
  }
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  overflow: hidden;
  z-index: 2;
}
.pop_check {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 560px;
  height: 460px;
  background-color: #fff;
  border-radius: 10px;
  z-index: 3;
  padding: 0 50px;
  h2 {
    font-size: 32px;
    color: #483f3f;
    margin: 64px auto;
    text-align: center;
  }
  .icon_before {
    display: inline-block;
    width: 36px;
    height: 72px;
    background: url("../assets/images/reload.png") no-repeat;
    background-size: 100% 100%;
  }
  .checkcode {
    position: relative;
    width: 268px;
    height: 72px;
    background-color: #f9e4e4;
    border: solid 2px #d8d8d8;
  }
  input {
    width: 144px;
    height: 74px;
    background-color: #fff;
    border-radius: 8px;
    border: solid 2px #d8d8d8;
    margin-left: 10px;
    text-align: center;
  }
  .btn_checkSure {
    display: block;
    width: 320px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    background-color: #ed2142;
    border-radius: 40px;
    font-size: 32px;
    color: #fff;
    margin: 70px auto;
  }
  .icon_sclose {
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    i {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: 20px;
      height: 20px;
      background-color: #232323;
      opacity: 0.4;
      background: url("../assets/images/icon_close.png") no-repeat;
      background-size: 100% 100%;
    }
  }
}
.pop-sellout {
  position: absolute;
  top: 555px;
  left: 50%;
  transform: translateX(-50%);
  right: 0;
  z-index: 2;
  width: 690px;
  box-shadow: 0px 0px 32px 0px #a99e9e;
  border-radius: 10px;
  .btn-know {
    display: block;
    width: 361px;
    height: 72px;
    border-radius: 36px;
    background: url("../assets/images/buitton_zhidaola.png");
    background-size: 100% 100%;
    margin: 50px auto;
  }
}
.pop_trSuc {
  width: 560px;
  height: 600px;
  background-image: linear-gradient(0deg, #ffffff 0%, #f42448 100%),
    linear-gradient(#ffffff, #ffffff);
  border-radius: 20px;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  z-index: 2;
  margin: auto;
  img {
    display: block;
    margin: auto;
    width: 267px;
    height: 217px;
    margin: 60px auto;
  }
  p {
    font-size: 32px;
    font-weight: bold;
    color: #232323;
    text-align: center;
    margin-bottom: 20px;
  }
  span {
    display: block;
    margin: auto;
    font-size: 28px;
    text-align: center;
    color: #473a3a;
  }
  .icon-close {
    position: absolute;
    right: 30px;
    top: 30px;
    width: 20px;
    height: 20px;
    background: url("../assets/images/icon_gb.png");
    background-size: 100% 100%;
  }
}
.pop_transfer {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  width: 560px;
  height: auto;
  background-image: linear-gradient(0deg, #ffffff 0%, #f42448 100%),
    linear-gradient(0deg, #ffffff 0%, #ffe6df 100%);
  border-radius: 20px;
  margin: auto;
  padding-bottom: 30px;
  z-index: 2;
  .headerImg {
    position: absolute;
    top: -60px;
    left: 230px;
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
  .title {
    font-size: 32px;
    letter-spacing: 2px;
    color: #232323;
    margin: 90px auto 15px;
    text-align: center;
  }
  .subtitle {
    font-size: 28px;
    font-weight: bold;
    color: #fff;
    text-align: center;
    margin-bottom: 30px;
  }
  .coupon {
    text-align: center;
    max-height: 370px;
    overflow-y: scroll;
    li {
      position: relative;
      width: 480px;
      height: 140px;
      box-shadow: 0px 2px 2px 0px rgba(168, 103, 112, 0.5);
      border-radius: 16px;
      margin: 0 auto 18px;
      background-size: 100% 100%;
      img {
        display: block;
        width: 480px;
        height: 140px;
      }
      .needNum {
        font-size: 20px;
        color: #aaa;
        text-align: left;
        padding: 80px 0 0 142px;
      }
    }
    .icon-default span {
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
      background: url("../assets/images/icon_wxz.png");
      background-size: 100% 100%;
    }
    .icon-active span {
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
      background: url("../assets/images/icon_xz.png");
      background-size: 100% 100%;
    }
  }
  .notice {
    font-size: 24px;
    color: #473a3a;
    margin: 30px auto 0;
    span {
      font-size: 24px;
      color: #3ea4f2;
    }
  }
  .btn-transer {
    display: block;
    margin: auto;
    width: 361px;
    height: 72px;
    line-height: 72px;
    background-image: linear-gradient(-90deg, #e10930 0%, #fe2843 100%);
    border-radius: 36px;
    font-size: 36px;
    font-weight: bold;
    color: #fff;
    text-align: center;
    margin: 30px auto 0;
  }
  .icon-close {
    position: absolute;
    right: 30px;
    top: 30px;
    width: 20px;
    height: 20px;
    background: url("../assets/images/icon_gb.png");
    background-size: 100% 100%;
  }
}
.pop_suc {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 610px;
  height: 900px;
  background-image: linear-gradient(0deg, #fff 0%, #f23d5d 100%),
    linear-gradient(#fff, #fff);
  border-radius: 20px;
  z-index: 3;
  .left_num {
    font-size: 32px;
    font-weight: bold;
    color: #fff;
    text-align: center;
    margin: 25px auto 20px;
    .num {
      color: #ffe596;
    }
  }
  .choose_haibao {
    position: relative;
    width: 472px;
    height: 647px;
    border-radius: 10px;
    margin: 20px auto 25px;
    .codeMa {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 80px;
      margin: auto;
      width: 126px;
      height: 125px;
      img {
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
    }
  }
  .btn_arr {
    padding: 0 60px;
    .btn_invit {
      display: block;
      width: 216px;
      height: 72px;
      background-image: linear-gradient(-90deg, #e10930 0%, #ff425a 100%);
      border-radius: 36px;
      text-align: center;
      line-height: 72px;
      font-size: 32px;
      color: #fff;
    }
    .icon_iclose {
      position: absolute;
      right: 30px;
      top: 30px;
      width: 20px;
      height: 20px;
      background: url("../assets/images/invit_close.png") no-repeat;
      background-size: 100%;
    }
    .bg_change {
      width: 216px;
      height: 72px;
      line-height: 72px;
      border-radius: 36px;
      border: solid 1px #fc2642;
      text-align: center;
      font-size: 32px;
      color: #f52f4c;
    }
  }
}
.pop_fail {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 600px;
  height: 610px;
  background: #fff;
  border-radius: 20px;
  z-index: 3;
  img {
    display: block;
    margin: 40px auto 20px;
    width: 180px;
    height: 211px;
  }
  .fail_text {
    font-size: 32px;
    color: #232323;
    text-align: center;
    margin-bottom: 10px;
  }
  .btn_go {
    display: block;
    margin: 30px auto 70px;
    width: 420px;
    height: 80px;
    background-image: linear-gradient(-90deg, #e10930 0%, #fe2843 100%);
    border-radius: 40px;
    text-align: center;
    line-height: 80px;
    font-size: 36px;
    color: #fff;
  }
  .tips {
    font-size: 24px;
    color: #999;
    text-align: center;
  }
}
.pop_honey {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 560px;
  height: 640px;
  background-image: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.48) 0%,
      rgba(255, 216, 199, 0.48) 100%
    ),
    linear-gradient(#fff, #fff);
  border-radius: 20px;
  padding: 0 60px;
  z-index: 3;
  h1 {
    font-size: 36px;
    color: #232323;
    text-align: center;
    margin: 55px auto 30px;
    &:before {
      content: "";
      display: inline-block;
      margin-right: 10px;
      width: 33px;
      height: 45px;
      background: url("../assets/images/title_fm.png") no-repeat;
      background-size: 100% 100%;
      vertical-align: bottom;
    }
  }
  h2 {
    font-size: 28px;
    color: #232323;
    font-weight: normal;
  }
  .title1 {
    &:before {
      content: "";
      display: inline-block;
      width: 10px;
      height: 30px;
      background-image: linear-gradient(-90deg, #e10930 0%, #fe2843 100%);
      border-radius: 5px;
      opacity: 0.6;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  p {
    font-size: 28px;
    color: #887777;
    margin: 15px 0;
  }
  .btn_gofm {
    display: block;
    margin: 160px auto 0;
    width: 420px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    background-image: linear-gradient(-90deg, #e10930 0%, #fe2843 100%);
    border-radius: 40px;
    font-size: 36px;
    font-weight: bold;
    color: #fff;
  }
  .fm_close {
    position: absolute;
    right: 30px;
    top: 30px;
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url("../assets/images/fm_close.png") no-repeat;
    background-size: 100% 100%;
  }
}
.pop_help {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 584px;
  height: 664px;
  z-index: 4;
  background: url("../assets/images/pop_help.png") no-repeat;
  background-size: 100% 100%;
  .pop_info {
    position: absolute;
    left: 0;
    right: 0;
    top: 130px;
    margin: auto;
    width: 461px;
    height: 377px;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
    .answer {
      position: absolute;
      right: 20px;
      top: 50px;
      width: 240px;
      height: 255px;
      padding: 20px;
      span {
        margin: auto;
        font-size: 24px;
        line-height: 42px;
        text-align: left;
        color: #7c2534;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        white-space: normal;
        width: 100%;
        padding: 0 25px 0 35px;
      }
    }
  }
}
.pop_share {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 584px;
  height: 800px;
  z-index: 3;
  p {
    font-size: 24px;
    color: #fff;
    text-align: center;
    margin-top: 20px;
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
.pop_other {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 560px;
  height: 567px;
  background-image: linear-gradient(0deg, #ffffff 0%, #ffdfdf 100%);
  border-radius: 20px;
  z-index: 3;
  img {
    display: block;
    width: 273px;
    height: 207px;
    margin: 86px auto 60px;
  }
  span {
    display: block;
    font-size: 28px;
    color: #473a3a;
    text-align: center;
  }
}
.pop_send {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 560px;
  height: 388px;
  background-image: linear-gradient(0deg, #ffffff 0%, #f42448 100%),
    linear-gradient(0deg, #ffffff 0%, #ffe6df 100%);
  border-radius: 20px;
  z-index: 3;
  padding-top: 110px;
  .img-mf {
    position: absolute;
    width: 120px;
    height: 120px;
    top: -60px;
    left: 0;
    right: 0;
    margin: auto;
  }
  p {
    font-size: 32px;
    color: #232323;
    opacity: 0.5;
    text-align: center;
    margin-bottom: 20px;
  }
  span {
    display: block;
    font-size: 28px;
    font-weight: bold;
    color: #473a3a;
    text-align: center;
    i {
      color: #f9223f;
    }
  }
  .icon_iclose {
    position: absolute;
    top: 30px;
    right: 30px;
    width: 20px;
    height: 20px;
    background: url("../assets/images/icon_gb.png");
    background-size: 100% 100%;
  }
}
.pop_sendSuc {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 560px;
  height: 600px;
  background-image: linear-gradient(0deg, #ffffff 0%, #f42448 100%),
    linear-gradient(#ffffff, #ffffff);
  border-radius: 20px;
  z-index: 3;
  background-size: 100% 100%;
  .pop_img {
    display: block;
    margin: auto;
    width: 300px;
    height: 300px;
  }
  p {
    font-size: 32px;
    color: #232323;
    text-align: center;
    font-weight: bold;
    margin: 20px auto 15px;
  }
  span {
    display: block;
    font-size: 28px;
    color: #473a3a;
    text-align: center;
  }
  .notice {
    font-size: 24px;
    color: #473a3a;
    opacity: 0.5;
    margin: 10px auto;
  }
  .icon_iclose {
    position: absolute;
    right: 30px;
    top: 30px;
    width: 20px;
    height: 20px;
    background: url("../assets/images/invit_close.png") no-repeat;
    background-size: 100%;
  }
}
.clear {
  &:after {
    clear: both;
    display: block;
    height: 0;
    content: "";
  }
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.btn_help {
  position: absolute;
  bottom: 45px;
  left: 0;
  right: 0;
  margin: 10px auto 0;
  width: 420px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  background-image: linear-gradient(-90deg, #e10930 0%, #fe2843 100%);
  border-radius: 40px;
  font-size: 36px;
  font-weight: bold;
  color: #fff;
}
.btn_closes {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 80px;
  height: 80px;
  .btn_close {
    position: absolute;
    right: 30px;
    top: 30px;
    width: 20px;
    height: 20px;
    background: url("../assets/images/icon_close.png") no-repeat;
    background-size: 100%;
  }
}
.swiper-container-horizontal
  > .swiper-pagination-bullets
  .swiper-pagination-bullet {
  background: #fff;
  opacity: 0.3;
}
.swiper-pagination-bullet-active {
  background: #fff !important;
  opacity: 1 !important;
}
</style>
<style>
.van-tabs__nav {
  margin-bottom: 0.267rem;
}
.van-tabs--line .van-tabs__wrap {
  height: 1.25rem;
}
.van-tab {
  font-size: 0.347rem;
  color: #333;
  line-height: 0.4rem;
}
.van-tab--active {
  color: #e30b31;
}
.van-tabs__line {
  position: absolute;
  bottom: 0.267rem;
  left: 0;
  z-index: 1;
  background: #fff;
  display: none;
}
.van-tabs__wrap--scrollable .van-tab {
  padding: 0 0.09rem;
}
.van-tab__text {
  position: relative;
}
.van-tab--active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0.9rem;
  margin: auto;
  width: 0.427rem;
  height: 0.16rem;
  background: url("../assets/images/icon_yuan.png");
  background-size: 100% 100%;
}
.van-tab--disabled {
  display: none;
}
.van-icon {
  vertical-align: middle;
}
.van-tabs__wrap--scrollable .van-tabs__nav--complete {
  padding: 0;
}
.van-tabs__content {
  margin-top: 0.267rem;
}
</style>
