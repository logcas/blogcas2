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
            url:'/api/gettags',
            type:'GET',
            dataType:'json',
            success:function(data){
                var tagsBody = document.querySelector('#tags');
                data.forEach((tag)=>{
                    tagsBody.appendChild(createTag(tag,`#${tag}`));
                });
                console.log('getting tags successfully');
            },
            error:function(){
                console.log('getting tags error');
            }
        });

        // 标签的事件处理程序
        

    }

    function createTag(tagName, tagHref) {
        var tag = document.createElement('span');
        tag.classList.add('tag');
        var tagLink = document.createElement('a');
        tagLink.setAttribute('href', tagHref);
        tagLink.appendChild(document.createTextNode(tagName));
        tag.appendChild(tagLink);
        return tag;
    }

    function createTableRow(title,id,date){
        var trow = document.createElement('tr'),
            tdTitle = document.createElement('td'),
            tdDate = document.createElement('td'),
            tdTitleLink = document.createElement('a');

        tdTitleLink.href = `/post/${id}`;
        tdTitleLink.appendChild(document.createTextNode(title));
        tdTitle.appendChild(tdTitleLink);

        tdDate.appendChild(document.createTextNode(date));

        trow.appendChild(tdTitle);
        trow.appendChild(tdDate);

        return trow;
    }

})();