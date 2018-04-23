(function(){

    var selectedTag = null;

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
        document.querySelector('body').addEventListener('click',(e)=>{
            var t = e.target;
            var href = t.href.slice(t.href.indexOf('#')+1);
            selectedTag = href; // 保存当前选择的Tag
            getPostByTag(href,1); // ajax 请求第一页
            
            // ajax 请求页码信息
            /*
            $.ajax({
                url:'/api/getsumbytag',
                type:'GET',
                dataType:'json',
                data:{
                    tagName:href
                },
                success:function(sum){
                    console.log(sum);
                    var total = sum;
                    totalPage = parseInt(total/6) + 1;
                    document.querySelector('#total').innerHTML = totalPage;
                },
                error:function(){
                    console.error('请求页码失败');
                }
            })*/
        });

    }

    // 按页和tag获取文章
    function getPostByTag(tagName){
        $.ajax({
            url:'/api/getpostsbytag',
            type:'GET',
            dataType:'json',
            data:{
                tag:tagName,
                isPrivate:0
            },
            success:function(data){
                var tbody = document.querySelector('tbody');

                // 移除旧元素
                var len = tbody.children.length;
                for(let i=0;i<len;i++){
                    tbody.removeChild(tbody.children[0]);
                }

                // 加入新的文章
                data.forEach((row)=>{
                    tbody.appendChild(createTableRow(row.title,row.id,row.publishDate));
                });

            },
            error:function(){
                console.error('请求文章失败');
            }
        })
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