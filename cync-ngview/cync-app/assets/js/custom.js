 var mqm = window.matchMedia("(min-width: 992px)");
 var mqm_menu = window.matchMedia("(min-width: 768px)");

 var MD5 = function (string) {
    function RotateLeft(lValue, iShiftBits) {
            return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }
 
    function AddUnsigned(lX,lY) {
            var lX4,lY4,lX8,lY8,lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                    return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                    if (lResult & 0x40000000) {
                            return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                    } else {
                            return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                    }
            } else {
                    return (lResult ^ lX8 ^ lY8);
            }
    }
 
    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }
 
    function FF(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function GG(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function HH(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function II(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1=lMessageLength + 8;
            var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
            var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
            var lWordArray=Array(lNumberOfWords-1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while ( lByteCount < lMessageLength ) {
                    lWordCount = (lByteCount-(lByteCount % 4))/4;
                    lBytePosition = (lByteCount % 4)*8;
                    lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                    lByteCount++;
            }
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
            lWordArray[lNumberOfWords-2] = lMessageLength<<3;
            lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
            return lWordArray;
    };
 
    function WordToHex(lValue) {
            var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
            for (lCount = 0;lCount<=3;lCount++) {
                    lByte = (lValue>>>(lCount*8)) & 255;
                    WordToHexValue_temp = "0" + lByte.toString(16);
                    WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
            }
            return WordToHexValue;
    };
 
    function Utf8Encode(string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";
 
            for (var n = 0; n < string.length; n++) {
 
                    var c = string.charCodeAt(n);
 
                    if (c < 128) {
                            utftext += String.fromCharCode(c);
                    }
                    else if((c > 127) && (c < 2048)) {
                            utftext += String.fromCharCode((c >> 6) | 192);
                            utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                            utftext += String.fromCharCode((c >> 12) | 224);
                            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                            utftext += String.fromCharCode((c & 63) | 128);
                    }
 
            }
 
            return utftext;
    };
 
    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;
 
    string = Utf8Encode(string);
 
    x = ConvertToWordArray(string);
 
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
 
    for (k=0;k<x.length;k+=16) {
            AA=a; BB=b; CC=c; DD=d;
            a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
            d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
            c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
            b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
            a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
            d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
            c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
            b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
            a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
            d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
            c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
            b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
            a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
            d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
            c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
            b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
            a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
            d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
            c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
            b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
            a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
            d=GG(d,a,b,c,x[k+10],S22,0x2441453);
            c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
            b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
            a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
            d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
            c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
            b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
            a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
            d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
            c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
            b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
            a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
            d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
            c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
            b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
            a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
            d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
            c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
            b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
            a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
            d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
            c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
            b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
            a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
            d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
            c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
            b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
            a=II(a,b,c,d,x[k+0], S41,0xF4292244);
            d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
            c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
            b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
            a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
            d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
            c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
            b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
            a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
            d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
            c=II(c,d,a,b,x[k+6], S43,0xA3014314);
            b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
            a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
            d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
            c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
            b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
            a=AddUnsigned(a,AA);
            b=AddUnsigned(b,BB);
            c=AddUnsigned(c,CC);
            d=AddUnsigned(d,DD);
            }
 
        var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
 
        return temp.toLowerCase();
 }


 $(function() {
     console.log("===Custmjs is loaded===>");
    var mqm4 = window.matchMedia("(max-width: 768px)");
    /*To resize the height and width of uploaded logo Image*/
    // var logoImage = document.getElementById('logoImageId').style;
    // if(logoImage.height <= 120){
    //     logoImage.width ='120px';
    //     logoImage.height = 'auto';
    //  }
          
             //Changes for CYNCUXT-2811 begin
             $("#statusChangeModalId").hide();
             //Changes for CYNCUXT-2811 ends

             $("#activationEmailModalID").hide();

             (function(){
                var options = $("select option");

                // Clear list
                options.detach();
                // Rebuild list
                options.not(".disabled").appendTo("select");
                // Set Default
                $("select").val("");
            })();

             function fnResndEmail(el) { 
                    $(el).parent().css(
                    { 'opacity' : '1', 'visibility' : 'visible', 'z-index': '10' }
                    );
                    var div = $(el).parent().find('.resendInfo');
                    var interval = 100;
                    var distance = 10;
                    var times = 4;
                    $(div).css('position', 'relative');
                    for (var iter = 0; iter < (times + 1) ; iter++) {
                    $(div).animate(
                    { left: ((iter % 2 == 0 ? distance : distance * -1)) }
                    , interval);
                    } 
                    $(div).animate(
                    { left: 0 }
                    , interval);
                    $(el).parent().css(
                    { 'opacity' : '0', 'visibility' : 'hidden', 'z-index': '10' }
                    ,2000);
                    }
 
     $(document).ready(function() {
         $('[data-toggle="tooltip"]').tooltip();
     });

     (function() {

         "use strict";
         var toggles = document.querySelectorAll(".c-hamburger");

         for (var i = toggles.length - 1; i >= 0; i--) {
             var toggle = toggles[i];
             toggleHandler(toggle);
         };


         $("#dash_cust_button").css('height', ($(document).height() - 90) + "px")
         $("#app_body").css('display', 'block')

         function toggleHandler(toggle) {
             toggle.addEventListener("click", function(e) {
                 sideMenu.toggle();
                 e.preventDefault();
                 appbody_cont = window.innerHeight;
                 (this.classList.contains("is-active") === true) ? this.classList.remove("is-active"): this.classList.add("is-active"); /*Manage the hamburger icons*/
                 (this.classList.contains("is-active") === true) ? document.getElementById('app_body').classList.add("move-to-right"): document.getElementById('app_body').classList.remove("move-to-right"); /*Adjust the positioning of App Body*/
                 (this.classList.contains("is-active") === true) ? (document.getElementById('nav_search').style.display = "block") : (document.getElementById('nav_search').style.display = "none"); /*Show hide the Search Menu*/
                 (this.classList.contains("is-active") === true) ? (document.getElementById('nav_search_a').style.boderBotom = "solid 44px #9CA6AE") : (document.getElementById('nav_search').style.borderBottom = "solid 0px #9CA6AE"); /*Show hide the Search Menu*/

                 (this.classList.contains("is-active") === true) ? (document.getElementById('nav_search').style.height = (appbody_cont + "px")) : (document.getElementById('nav_search').style.height = "auto"); /*Show hide the Search Menu*/
                 if (mqm.matches) {
                     (this.classList.contains("is-active") === true) ? document.getElementById('app_body').style.marginLeft = "200px": document.getElementById('app_body').style.marginLeft = "0px";
                 }

             });
         }


         $('main').mousemove(function(event) {
             return; //Disabling this feature
             var current_post = event.pageX;

             if (current_post > 265) {

                 sideMenu.close();                 
                 document.getElementById('app_body').classList.remove("move-to-right");
                 // document.getElementById('hamburger_m').classList.remove("is-active");
                 document.getElementById('app_body').style.marginLeft = "0px"


             }
         });

     })();

     // Navigation Menu
     $(function() {
         var isTouch = !!('ontouchstart' in window || navigator.maxTouchPoints),
             evt = isTouch ? 'touchend' : 'click';
         var next = function() {
             $(this).attr("disabled", "disabled").parent().next('li').find('button').removeAttr("disabled");
         };

     })
 
     //////////////////////////////////////////////////////////////////////////////
     //Set the height of App body container
     //////////////////////////////////////////////////////////////////////////////

     appbody_cont = window.innerHeight;
     $(window).resize(function() {
         appbody_cont = window.innerHeight;
         if (document.getElementById("app-body-container")) { document.getElementById('app-body-container').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 16) + 'px'; }
        // if (document.getElementById("main_contents")) { document.getElementById('main_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }
         if (document.getElementById("dialog1")) { document.getElementById('dialog1').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }
         if (document.getElementById("dialog2")) { document.getElementById('dialog2').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }
         if (document.getElementById("dialog3")) { document.getElementById('dialog3').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }
         if (document.getElementById("main_contents")) { 
         if(document.getElementById('app-body-container').classList.contains("has-submenu"))
         {  
            document.getElementById('main_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16 - 49 ) + 'px'; console.log('has sub menu');
         }

         else
         {
          document.getElementById('main_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16 ) + 'px'; 
         }
           
         }

     })

     if (document.getElementById("app-body-container")) { document.getElementById('app-body-container').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 16) + 'px'; }

     if (document.getElementById("main_contents")) { 
    if(document.getElementById('app-body-container').classList.contains("has-submenu"))
    {
        document.getElementById('main_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16 - 49) + 'px';   console.log('has sub menu');
    }
    else
    {
       document.getElementById('main_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; 
    }
      
    }

     if (document.getElementById("dialog1")) { document.getElementById('dialog1').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }

     if (document.getElementById("dialog2")) { document.getElementById('dialog2').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }

     if (document.getElementById("dialog3")) { document.getElementById('dialog3').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }

    
 function setModalMaxHeight(element) {
     this.$element = $(element);
     this.$content = this.$element.find('.modal-content');
     var borderWidth = this.$content.outerHeight() - this.$content.innerHeight();
     var dialogMargin = $(window).width() < 768 ? 20 : 60;
     var contentHeight = $(window).height() - (dialogMargin + borderWidth);
     var headerHeight = this.$element.find('.modal-header').outerHeight() || 0;
     var footerHeight = this.$element.find('.modal-footer').outerHeight() || 0;
     var maxHeight = contentHeight - (headerHeight + footerHeight);

     this.$content.css({
         'overflow': 'hidden'
     });
     this.$element.find('.modal-body').css({
             'max-height': maxHeight,
             'overflow-y': 'auto'
         });

}


$('.modal').on('show.bs.modal', function() {
    $(this).show();
    setModalMaxHeight(this);
});

$(window).resize(function() {
    if ($('.modal.in').length != 0) {
        setModalMaxHeight($('.modal.in'));
    }
});

 function cync_modal(type, message, is_prompt, auto_hide) {

     $('#cync_alerts .modal-body').html('<p>' + message + '</p>');
     if (type == 'warning') { $('#cync_alerts .modal-header').css('background', '#ea5859').html('<i class="fa fa-5x fa-exclamation-triangle clr_white f_s_64"></i>'); }
     if (type == 'success') { $('#cync_alerts .modal-header').css('background', 'green').html('<i class="fa fa-5x fa-check clr_white f_s_64"></i>'); }
     if (type == 'info') { $('#cync_alerts .modal-header').css('background', '#4dbbf8').html('<i class="fa fa-5x fa-info-circle clr_white f_s_64"></i>'); }

     if (type == 'danger') { $('#cync_alerts .modal-header').css('background', '#eb595a').html('<i class="fa fa-5x fa-ban clr_white f_s_64"></i>'); }
     if (is_prompt == true) {
         $('#cync_alerts .modal-footer').html('<p><button id="modal_action_yes" type="button" class="noradius btn btn-sm btn-primary p_r_20 p_l_20 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only options-btn" >Yes</button> <button  id="modal_action_no"  type="button" class="noradius btn btn-sm btn-primary p_r_20 p_l_20 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only options-btn" data-dismiss="modal">No</button></p>');

     } else {
         $('#cync_alerts .modal-footer').html('<p><button  id="modal_action_close"  type="button" class="noradius btn btn-sm btn-primary p_r_20 p_l_20 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only options-btn" data-dismiss="modal">Close</button></p>');

     }
     $('#cync_alerts').modal('show');
     if (auto_hide == true) {

         $('#cync_alerts').modal('show');
         setTimeout(function() {
             $('#cync_alerts').modal('hide');
         }, 2000)
     }

 }

 $(function() {

         $(".cync-grid tbody td").click(function() { 
           
           document.location = 'view.html'; 
        
         });

         $(".edit_item").click(function() {
             $('#Delete').removeClass('clr_light_grey');
             $('#Clone').removeClass('clr_light_grey');
             $('#Delete').addClass('clr_grey');
             $('#Edit').removeClass('light').removeClass('clr_light_grey');
             $('#Edit').addClass('clr_grey');
             $('#Clone').addClass('clr_grey');
         });

          $("#action_save").click(function(e) {
            e.preventDefault();
             cync_notify('success', 'Record added successfully',  4000);
             
         });

         $("#Delete").click(function() {
            
            if($('.currency_in_use').prop('checked')) {
            cync_notify('warning', 'Currency in use cannot be deleted.', 3000);
            return ;
        }
             cync_modal('warning', 'Are you sure you want to delete?',  true, false);
         });

         $("#action_cancel, #action_back").click(function() {
             window.history.back();
             return;
         });

         $(".through_currency").click(function() {

             $('.currency_3_d').removeClass('hidden')
         });

     })


 // Module Sub Menu Customize
 if (document.getElementById("subnav_nav")) {
     var SETTINGS = { navBarTravelling: !1, navBarTravelDirection: "", navBarTravelDistance: 150 }
     var colours = { 0: "#666" }
     document.documentElement.classList.remove("no-js");
     document.documentElement.classList.add("js");
     var subadvance_left = document.getElementById("subadvance_left");
     var subadvance_right = document.getElementById("subadvance_right");
     var pnIndicator = document.getElementById("pnIndicator");
     var subnav_nav = document.getElementById("subnav_nav");
     var subnav_navContents = document.getElementById("subnav_navContents");
     subnav_nav.setAttribute("data-overflowing", determineOverflow(subnav_navContents, subnav_nav));
     moveIndicator(subnav_nav.querySelector("[aria-selected=\"true\"]"), colours[0]);
     var last_known_scroll_position = 0;
     var ticking = !1;

     function doSomething(scroll_pos) { subnav_nav.setAttribute("data-overflowing", determineOverflow(subnav_navContents, subnav_nav)) }
     subnav_nav.addEventListener("scroll", function() {
         last_known_scroll_position = window.scrollY;
         if (!ticking) {
             window.requestAnimationFrame(function() {
                 doSomething(last_known_scroll_position);
                 ticking = !1
             })
         }
         ticking = !0
     });
     subadvance_left.addEventListener("click", function() {
         if (SETTINGS.navBarTravelling === !0) { return }
         if (determineOverflow(subnav_navContents, subnav_nav) === "left" || determineOverflow(subnav_navContents, subnav_nav) === "both") {
             var availableScrollLeft = subnav_nav.scrollLeft;
             if (availableScrollLeft < SETTINGS.navBarTravelDistance * 2) { subnav_navContents.style.transform = "translateX(" + availableScrollLeft + "px)" } else { subnav_navContents.style.transform = "translateX(" + SETTINGS.navBarTravelDistance + "px)" }
             subnav_navContents.classList.remove("pn-ProductNav_Contents-no-transition");
             SETTINGS.navBarTravelDirection = "left";
             SETTINGS.navBarTravelling = !0
         }
         subnav_nav.setAttribute("data-overflowing", determineOverflow(subnav_navContents, subnav_nav))
     });
     subadvance_right.addEventListener("click", function() {
         if (SETTINGS.navBarTravelling === !0) { return }
         if (determineOverflow(subnav_navContents, subnav_nav) === "right" || determineOverflow(subnav_navContents, subnav_nav) === "both") {
             var navBarRightEdge = subnav_navContents.getBoundingClientRect().right;
             var navBarScrollerRightEdge = subnav_nav.getBoundingClientRect().right;
             var availableScrollRight = Math.floor(navBarRightEdge - navBarScrollerRightEdge);
             if (availableScrollRight < SETTINGS.navBarTravelDistance * 2) { subnav_navContents.style.transform = "translateX(-" + availableScrollRight + "px)" } else { subnav_navContents.style.transform = "translateX(-" + SETTINGS.navBarTravelDistance + "px)" }
             subnav_navContents.classList.remove("pn-ProductNav_Contents-no-transition");
             SETTINGS.navBarTravelDirection = "right";
             SETTINGS.navBarTravelling = !0
         }
         subnav_nav.setAttribute("data-overflowing", determineOverflow(subnav_navContents, subnav_nav))
     });
     subnav_navContents.addEventListener("transitionend", function() {
         var styleOfTransform = window.getComputedStyle(subnav_navContents, null);
         var tr = styleOfTransform.getPropertyValue("-webkit-transform") || styleOfTransform.getPropertyValue("transform");
         var amount = Math.abs(parseInt(tr.split(",")[4]) || 0);
         subnav_navContents.style.transform = "none";
         subnav_navContents.classList.add("pn-ProductNav_Contents-no-transition");
         if (SETTINGS.navBarTravelDirection === "left") { subnav_nav.scrollLeft = subnav_nav.scrollLeft - amount } else { subnav_nav.scrollLeft = subnav_nav.scrollLeft + amount }
         SETTINGS.navBarTravelling = !1
     }, !1);
     subnav_navContents.addEventListener("click", function(e) {
         var links = [].slice.call(document.querySelectorAll(".subnav_nav_links"));
         links.forEach(function(item) { item.setAttribute("aria-selected", "false") })
         e.target.setAttribute("aria-selected", "true");
         moveIndicator(e.target, colours[links.indexOf(e.target)])
     });

     function moveIndicator(item, color) {
         if(item != null)var textPosition = item.getBoundingClientRect();
         var container = subnav_navContents.getBoundingClientRect().left;
         if(textPosition != undefined)var distance = textPosition.left - container;
         var scroll = subnav_navContents.scrollLeft;
         if(textPosition != undefined)pnIndicator.style.transform = "translateX(" + (distance + scroll) + "px) scaleX(" + textPosition.width * 0.01 + ")";
         if (color) { pnIndicator.style.backgroundColor = color }
     }

     function determineOverflow(content, container) { var containerMetrics = container.getBoundingClientRect(); var containerMetricsRight = Math.floor(containerMetrics.right); var containerMetricsLeft = Math.floor(containerMetrics.left); var contentMetrics = content.getBoundingClientRect(); var contentMetricsRight = Math.floor(contentMetrics.right); var contentMetricsLeft = Math.floor(contentMetrics.left); if (containerMetricsLeft > contentMetricsLeft && containerMetricsRight < contentMetricsRight) { return "both" } else if (contentMetricsLeft < containerMetricsLeft) { return "left" } else if (contentMetricsRight > containerMetricsRight) { return "right" } else { return "none" } }(function(root, factory) { if (typeof define === 'function' && define.amd) { define(['exports'], factory) } else if (typeof exports !== 'undefined') { factory(exports) } else { factory((root.dragscroll = {})) } }(this, function(exports) {
         var _window = window;
         var _document = document;
         var mousemove = 'mousemove';
         var mouseup = 'mouseup';
         var mousedown = 'mousedown';
         var EventListener = 'EventListener';
         var addEventListener = 'add' + EventListener;
         var removeEventListener = 'remove' + EventListener;
         var newScrollX, newScrollY;
         var dragged = [];
         var reset = function(i, el) {
             for (i = 0; i < dragged.length;) {
                 el = dragged[i++];
                 el = el.container || el;
                 el[removeEventListener](mousedown, el.md, 0);
                 _window[removeEventListener](mouseup, el.mu, 0);
                 _window[removeEventListener](mousemove, el.mm, 0)
             }
             dragged = [].slice.call(_document.getElementsByClassName('dragscroll'));
             for (i = 0; i < dragged.length;) {
                 (function(el, lastClientX, lastClientY, pushed, scroller, cont) {
                     (cont = el.container || el)[addEventListener](mousedown, cont.md = function(e) {
                         if (!el.hasAttribute('nochilddrag') || _document.elementFromPoint(e.pageX, e.pageY) == cont) {
                             pushed = 1;
                             lastClientX = e.clientX;
                             lastClientY = e.clientY;
                             e.preventDefault()
                         }
                     }, 0);
                     _window[addEventListener](mouseup, cont.mu = function() { pushed = 0 }, 0);
                     _window[addEventListener](mousemove, cont.mm = function(e) {
                         if (pushed) {
                             (scroller = el.scroller || el).scrollLeft -= newScrollX = (-lastClientX + (lastClientX = e.clientX));
                             scroller.scrollTop -= newScrollY = (-lastClientY + (lastClientY = e.clientY));
                             if (el == _document.body) {
                                 (scroller = _document.documentElement).scrollLeft -= newScrollX;
                                 scroller.scrollTop -= newScrollY
                             }
                         }
                     }, 0)
                 })(dragged[i++])
             }
         }
         if (_document.readyState == 'complete') { reset() } else { _window[addEventListener]('load', reset, 0) }
         exports.reset = reset
     }))

 }

 $(function() {
         setInterval(function() {
             $("#loading_overlay").fadeOut('fast');

         }, 500);

     })

     // Hide the notification on load
   $(function() { $('.master_notification').slideUp(0);  })
    var timeout_notify;

   function cync_notify(type, message, delay) {
    clearTimeout(timeout_notify);
     $('.master_notification').slideUp(0); 
     $('#cync_notifications div').html(message);
     $('#cync_notifications div').removeAttr('class').attr('class', '');
     if (type == 'warning') { $('#cync_notifications div').addClass('warning'); }
     if (type == 'success') { $('#cync_notifications div').addClass('success'); }
     if (type == 'info') { $('#cync_notifications div').addClass('info');  }

     if (type == 'danger') { $('#cync_notifications div').addClass('danger');}
     
     $('.master_notification').slideDown('slow');
     var timeout;
     timeout_notify = setTimeout(function() {
              $('.master_notification').slideUp('slow');
         }, delay)
     }

     function set_modal_width_height()
    {
        var window_height_a=  window.innerHeight;
        $('.max_height').css('height',window_height_a+'px');
        $('.position_modal').css({'height':(window_height_a*60/100)+'px','top':((window_height_a-(window_height_a*60/100))/2)+'px'});
        $('.notification-main').css({'max-height':((window_height_a*60/100)-120)+'px'});
    }

  //set modal height and width on load 
  set_modal_width_height();

  $(window).resize(function(){
    set_modal_width_height();
  })

  // Hiding Menu Panel when click Body
  $(document).on('click','body', function (event) {
      if (!$(event.target).closest('#bookmark-box').length) { 
         $('#bookmark-box:visible').hide();
         $(".fused-label").removeAttr('style');
      }
  });

});
