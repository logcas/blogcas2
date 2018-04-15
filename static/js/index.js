(function () {

    window.onload = function () {

        // 移动设备自适应
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
        var header = document.querySelector('.header');
        window.addEventListener('scroll',function(e){
            if(window.scrollY>60){
                header.classList.add('scrollHeader');
            }
            if(window.scrollY<=60){
                header.classList.remove('scrollHeader');
            }
        });

        // ajax 请求文章列表
        $.ajax({
            url:'/api/getpostlist',
            type:'GET',
            data:{
                page:1
            },
            dataType:'json',
            success:function(data){
                var postList = document.querySelector('#posts-list');
                var postLoadingText = document.querySelector('#post-loading-text');
                postList.removeChild(postLoadingText);
                data.forEach(po => {
                    let mainContent = po.content.length>400 ? po.content.trim().slice(0,400) : po.content;
                    postList.appendChild(createPost(po.title, mainContent, `/post/${po.id}`));
                });
            },
            error:function(){
                alert('加载文章时发生了错误');
                console.log('error occured when loading posts');
            }
        });
        

        // ajax 请求tags
        $.ajax({
            url:'/api/gettags',
            type:'GET',
            dataType:'json',
            success:function(data){
                var tagList = document.querySelector('#tags-list');
                var tagLoadingText = document.querySelector('#tag-loading-text');
                tagList.removeChild(tagLoadingText);
                data.forEach(el => {
                    tagList.appendChild(createTag(el, '/tags'));
                });
            },
            error:function(){
                alert('加载Tag时发生了错误');
                console.log('error occured when loading tags');
            }
        });
    }

    function createPost(title, content, hrefLink) { // 创建新的文章显示卡
        var post = document.createElement('div');
        post.classList.add('card');

        var postTitle = document.createElement('div');
        postTitle.classList.add('card-header');
        var link = document.createElement('a');
        link.setAttribute('href', hrefLink);
        link.appendChild(document.createTextNode(title));
        postTitle.appendChild(link);

        var postContent = document.createElement('div');
        postContent.classList.add('card-body');
        postContent.appendChild(document.createTextNode(content));

        post.appendChild(postTitle);
        post.appendChild(postContent);
        return post;
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

})();