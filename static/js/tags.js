(function(){

    window.onload = function(){

        // 移动设备导航折叠
        var navHidden = true;
        var btn = document.querySelector('#collapse-button');
        btn.addEventListener('click',function(e){
            var nav = document.querySelector('#navbar');
            if(nav.style.visibility == 'visible'){
                nav.style.visibility = 'hidden';
            } else {
                nav.style.visibility = 'visible';
            }
        });

        // ajax 获取标签
        $.ajax({
            
        });

    }

})();