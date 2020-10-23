window.onload = function () {
  ("use strict");
  (function (m, n) {
    var box = document.querySelector("#code-box"),
      progress = document.querySelector("h4"),
      codeInput = document.querySelector(".code-input"),
      evenBox = document.querySelector(".item_btn");

    //默认事件
    var boxEven = ["mousedown", "mousemove", "mouseup"];
    //改变手机端与pc事件类型
    if (typeof document.ontouchstart == "object") {
      boxEven = ["touchstart", "touchmove", "touchend"];
    }

    var goX, offsetLeft, deviation, evenWidth, endX;

    function moveFn(e) {
      e.preventDefault();
      e = boxEven["0"] == "touchstart" ? e.touches[0] : e || window.event;

      endX = e.clientX - goX;
      endX = endX > 0 ? (endX > evenWidth ? evenWidth : endX) : 0;

      var percent = (endX + deviation) / $(".item_track").width();
      var endleft = endX / $(".item_track").width();
      progress.style.width = percent * 100 + "%";
      evenBox.style.left = endleft * 100 + "%";
      $(".img_code").css("left", endleft * 100 + "%");
    }

    function removeFn() {
      //把位置百分比提交后台进行比对 percent
      document.removeEventListener(boxEven["2"], removeFn, false);
      document.removeEventListener(boxEven["1"], moveFn, false);
      var percent = (endX + deviation) / $(".item_track").width();
      var endleft = endX / $(".item_track").width();
      console.log(percent);
      //验证成功
      $.ajax({
        type: "POST",
        url: "/sd_act_service/spellCode/checkSpellCode.do",
        data: {
          spellCodeId: code,
          moveX: endleft
        },
        dataType: "json",
        cache: false,
        success: function (resp) {
          var status = resp.status; //0：验证成功，1：验证失败，2：验证码已失效，3：验证出现错误
          if (status == "0") {
            //验证成功
            $(".item_btn").replaceWith('<p class="item_btn"></p>');
            $("ins").remove();
            $(".img_code").css("left", endX);
            progress.style.width = percent * 100 + "%";
            //						evenBox.style.left = endleft*100+'%';
            $(".item_btn").css("left", endleft * 100 + "%");
            $(".img_code").css("left", endleft * 100 + "%");
            $(".item_track p").html("验证成功");
            window.atouse();
          } else {
            //验证失败
            code = resp.spellCodeId;
            //获取背景图片的base64
            var img1 = "data:image/png;base64," + resp.imgNameBig;
            //获取滑块图片的base64
            var img2 = "data:image/png;base64," + resp.imgNameLittle;
            $(".bg_img").attr("src", img1);
            $(".img_code").attr("src", img2);
            resetCode();
          }
        },
        error: function () {
          console.log("error");
        }
      });
    }
    evenBox.addEventListener(
      boxEven["0"],
      function (e) {
        e = boxEven["0"] == "touchstart" ? e.touches[0] : e || window.event;
        (goX = e.clientX),
        (offsetLeft = parseInt(box.offsetLeft)),
        (deviation = this.clientWidth),
        (evenWidth = box.clientWidth - deviation),
        endX;

        document.addEventListener(boxEven["1"], moveFn, false);
        document.addEventListener(boxEven["2"], removeFn, false);
      },
      false
    );

    function resetCode() {
      //		ajax();
      evenBox.removeAttribute("style");
      progress.removeAttribute("style");
      $(".img_code").css("left", 0);
      codeInput.value = "";
    }
    var code;
    m.ajax = function () {
      $.ajax({
        type: "GET",
        url: "/sd_act_service/spellCode/createSpellCode.do",
        dataType: "json",
        cache: false,
        async: false,
        success: function (resp) {
          code = resp.spellCodeId;
          //获取背景图片的base64
          var img1 = "data:image/png;base64," + resp.imgNameBig;
          //获取滑块图片的base64
          var img2 = "data:image/png;base64," + resp.imgNameLittle;
          $(".bg_img").attr("src", img1);
          $(".img_code").attr("src", img2);
        },
        error: function () {
          console.log("error");
        }
      });
    };
    ajax();
    $(".refresh").click(function () {
      ajax();
    });
  })(window, document);
};