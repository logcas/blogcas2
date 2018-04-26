(function () {

    var currentPage = 1;
    var totalPage = 1;

    window.onload = function () {

        // 移动设备折叠导航
        var navHidden = true;
        var btn = document.querySelector('#collapse-button');
        btn.addEventListener('click', function (e) {
            var nav = document.querySelector('#navbar');
            if (nav.style.visibility == 'visible') {
                nav.style.visibility = 'hidden';
            } else {
                nav.style.visibility = 'visible';
            }

        });

        // 获取页码信息
        $.ajax({
            url: '/api/getSum',
            dataType: 'json',
            data: {
                table: 'posts'
            },
            success: function (sum) {
                totalPage = parseInt(sum / 11) + 1;
                document.querySelector('#current').innerHTML = currentPage;
                document.querySelector('#total').innerHTML = totalPage;
            },
            error: function () {
                console.log('请求页面时发生错误');
            }
        });

        // ajax 获取文章列表信息
        $.ajax({
            url: '/api/getpostlist',
            type: 'GET',
            data: {
                page: 1,
                isPrivate:0
            },
            dataType: 'json',
            success: function (data) {
                var postList = document.querySelector('#posts-list');
                var postLoadingText = document.querySelector('#post-loading-text');
                postList.removeChild(postLoadingText);
                data.forEach(po => {
                    let mainContent = po.content.trim().length > 400 ? po.content.trim().slice(0, 400) : po.content;
                    postList.appendChild(createPost(po));
                });
            },
            error: function () {
                alert('加载文章时发生了错误');
                console.log('error occured when loading posts');
            }
        });

        // 翻页按钮事件处理程序
        $('a[href="#pre"]').click((e) => {
            if(currentPage != 1) {
                insertPostsList(--currentPage);
                document.querySelector('#current').innerHTML = currentPage;
            } else {
                alert('这是第一页了！');
            }
            
        });
        
        $('a[href="#next"]').click((e) => {
            if(currentPage < totalPage) {
                insertPostsList(++currentPage);
                document.querySelector('#current').innerHTML = currentPage;
            } else {
                alert('已经是最后一页了');
            }
            
        });

    };

    function insertPostsList(page) {
        $.ajax({
            url: '/api/getpostlist',
            type: 'GET',
            data: {
                page: page
            },
            dataType: 'json',
            success: function (data) {
                var postList = document.querySelector('#posts-list');
                var postListLength = postList.children.length;
                for (let i = 0; i < postListLength; i++) {
                    postList.removeChild(postList.children[0]);
                }
                console.log(data);
                data.forEach(po => {
                    let mainContent = po.content.trim().length > 400 ? po.content.trim().slice(0, 400) : po.content;
                    postList.appendChild(createPost(po));
                });
            },
            error: function () {
                alert('加载文章时发生了错误');
                console.log('error occured when loading posts');
            }
        });
    }

    function createPost(po) { // 创建新的文章显示卡
        var post = document.createElement('div');
        post.classList.add('card');

        // 添加标题
        var postTitle = document.createElement('div');
        postTitle.classList.add('card-header');
        var link = document.createElement('a');
        link.setAttribute('href', '/post/' + po.id);
        link.appendChild(document.createTextNode(po.title));
        postTitle.appendChild(link);

        // 添加日期
        var postDate = document.createElement('span');
        postDate.classList.add('date');
        postDate.appendChild(document.createTextNode(po.publishDate));

        // 添加所属标签
        var tagsBlock = document.createElement('div');
        tagsBlock.classList.add('tags');
        po.tags.split(',').forEach(t => {
            tagsBlock.appendChild(createTag(t, '/tags'));
        });

        var infoBlock = document.createElement('div');
        infoBlock.classList.add('card-body');
        infoBlock.appendChild(postDate);
        infoBlock.appendChild(tagsBlock);

        // 添加文章内容
        var postContent = document.createElement('div');
        postContent.classList.add('card-body');
        postContent.appendChild(document.createTextNode(po.content));

        post.appendChild(postTitle);
        post.appendChild(infoBlock);
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