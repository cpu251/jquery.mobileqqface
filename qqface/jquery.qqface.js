(function ($) {
  var face = ["微笑", "撇嘴", "色", "发呆", "得意", "流泪", "害羞", "闭嘴", "睡", "大哭", "尴尬", "发怒", "调皮", "呲牙", "惊讶", "难过", "酷", "冷汗", "抓狂", "吐", "偷笑", "可爱", "白眼", "傲慢", "饥饿", "困", "惊恐", "流汗", "憨笑", "装逼", "奋斗", "咒骂", "疑问", "嘘", "晕", "折磨", "衰", "骷髅", "敲打", "再见", "擦汗", "抠鼻", "鼓掌", "糗大了", "坏笑", "左哼哼", "右哼哼", "哈欠", "鄙视", "委屈", "快哭了", "阴险", "亲亲", "吓", "可怜", "菜刀", "西瓜", "啤酒", "篮球", "乒乓", "咖啡", "饭", "猪头", "玫瑰", "凋谢", "示爱", "爱心", "心碎", "蛋糕", "闪电", "炸弹", "刀", "足球", "瓢虫", "便便", "月亮", "太阳", "礼物", "拥抱", "赞", "踩", "握手", "胜利", "抱拳", "勾引", "拳头", "差劲", "爱你", "NO", "OK", "爱情", "飞吻", "跳跳", "发抖", "怄火", "转圈", "磕头", "回头", "跳绳", "挥手", "激动", "街舞", "献吻", "左太极", "右太极", "双喜", "鞭炮", "灯笼", "发财", "K歌", "购物", "邮件", "帅", "喝彩", "祈祷", "爆筋", "棒棒糖", "喝奶", "下面", "香蕉", "飞机", "开车", "高铁左车头", "车厢", "高铁右车头", "多云", "下雨", "钞票", "熊猫", "灯泡", "风车", "闹钟", "打伞", "彩球", "钻戒", "沙发", "纸巾", "药", "手枪", "青蛙"];

  $.fn.extend({
    qqface: function (opt) {
      var dom = this;
      var defaults = {
        facebox: '.qqfacebox',
        facebtn: '.qqfacebtn',
        textarea: '.qqfacetextarea',
        imgPath: 'qqface/face/',
        contenteditable: false
      };

      opt = $.extend(defaults, opt);
      dom.hide().html('<div class="swiper-container"><div class="swiper-wrapper qqface-mian"></div><div class="swiper-pagination"></div></div>');

      for (i in face) {
        if (i % 18 == 0) {
          dom.find('.qqface-mian').append('<div class="swiper-slide"><div class="qqface-box"></div></div>');
        }
        dom.find('.qqface-mian .swiper-slide').eq(-1).find('.qqface-box').append('<div class="box" item="' + i + '" text="' + face[i] + '"><img src="' + opt.imgPath + i + '.png"></div>');
      }
      var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        loop: true,
        observer: true,
        observeParents: true
      });

      var lastvalue = '';
      //表情层事件
      dom.on('click', '.qqface-box .box', function (e) {
        e.stopPropagation();
        if (opt.contenteditable) {
          lastvalue = $('.qqface-textarea-box>textarea').val() + '\\' + $(this).attr('text');
          $('.qqface-textarea-box>textarea').val(lastvalue);
          $('.qqface-textarea-box>.qqface-textarea').html($('.qqface-textarea-box>.qqface-textarea').html() + '<img src="' + opt.imgPath + $(this).attr('item') + '.png" text="' + $(this).attr('text') + '" class="qqface-img">');
        }else{
          lastvalue = $(opt.textarea).val() + '\\' + $(this).attr('text');
          $(opt.textarea).val(lastvalue);
        }
      });

      //输入框事件
      if (opt.contenteditable) {
        $(opt.textarea).each(function(){
          var _class = $(this).attr('class');
          var _placeholder = $(this).attr('placeholder');
          var _name = $(this).attr('name');
          $(this)[0].outerHTML = '<div class="qqface-textarea-box ' + _class + '"><textarea name="' + _name + '"></textarea><div class="qqface-textarea" placeholder="' + _placeholder + '" contenteditable="true"></div><div class="qqface-textarea-text"></div></div>';
        });
        $('.qqface-textarea-box>.qqface-textarea').on('input', function (e) {
          $(this).siblings('.qqface-textarea-text').html($(this).html().replace(/<img src[=]"[^"]*" text="([^"]*)" class[=]"qqface-img">/g, '\\$1'));
          lastvalue = $(this).siblings('.qqface-textarea-text').text();
          $(this).siblings('.textarea').val(lastvalue);
        });
      } else {
        $(opt.textarea).on('input', function (e) {
          if ($(opt.textarea).val().length < lastvalue.length) {
            var start = 0;
            var end = 0;
            var eleng = 0;
            var tempvalue = $(opt.textarea).val();
            for (l = 1, flag = true; flag && l <= lastvalue.length; l++) {
              if (tempvalue.slice(0, l) != lastvalue.slice(0, l)) {
                start = l - 1;
                flag = false;
              }
            }
            end = lastvalue.length - tempvalue.length + start;

            tempvalue = '';
            if (start > 0) {
              for (l = 1; start - l > 0; l++) {
                if (lastvalue.slice(start - l, start) == lastvalue.slice(end - l, end)) {
                  eleng++;
                }
              }
              start -= eleng;
              end -= eleng;
              for (l = start - 1, flag = true; flag && l >= 0 && start - l < 5; l--) {
                if (lastvalue.slice(l, l + 1) == '\\') {
                  for (i = 0; flag && i < face.length; i++) {
                    if (face[i] == lastvalue.slice(l + 1, l + 1 + face[i].length)) {
                      tempstart = l;
                      start = tempstart + face[i].length + 1 > start ? l : start;
                      flag = false;
                    }
                  }
                }
              }
              if (!flag) {
                start += eleng;
                end += eleng;
              }
              tempvalue += lastvalue.slice(0, start);
            }

            if (end < lastvalue.length) {
              for (l = end - 1, flag = true; flag && l > start && end - l < 5; l--) {
                console.log(l)
                if (lastvalue.slice(l, l + 1) == '\\') {
                  for (i = 0; flag && i < face.length; i++) {
                    if (face[i] == lastvalue.slice(l + 1, l + 1 + face[i].length)) {
                      tempend = l + face[i].length + 1;
                      end = tempend > end ? tempend : end;
                      flag = false;
                    }
                  }
                }
              }
              tempvalue += lastvalue.slice(end);
            }
            lastvalue = tempvalue;
            if ($(opt.textarea).val() != lastvalue) {
              $(opt.textarea).val(lastvalue);
              $(opt.textarea)[0].setSelectionRange(start, start);
            }
          } else {
            lastvalue = $(opt.textarea).val();
          }
        });
      }

      //点击打开表情层
      $(opt.facebtn).on('click', function(e) {
        e.stopPropagation();
        dom.show();
      });

      //空白处点击，关闭表情层
      $('body').on('click', function() {
        dom.hide();
      });
    },

    qqfaceimg: function(opt){
      var dom = this;
      var defaults = {
        size: 0,
        facebox: '.qqface',
        imgPath: 'qqface/face/',
        imgclass: ''
      };

      opt = $.extend(defaults, opt);
      dom.each(function(){
        var flag = false;
        var html = $(this).html();
        for (i in face) {
          imghtml = '<img src="' + opt.imgPath + i + '.png"';
          if(opt.imgclass!=''){
            imghtml += ' class="' + opt.imgclass + '"';
          }
          if(opt.size!=0){
            imghtml += ' style="width:' + opt.size + ';"';
          }
          imghtml += '>';
          html = html.replace('\\'+face[i], imghtml)
        }
        $(this).html(html);
      });
    }
  });

})(jQuery);