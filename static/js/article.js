(function () {

    var currentPage = 1; // 保存当前页码
    var totalPages = 10; // 总页面数
    var postID = null; // 文章编号

    window.onload = function () {

        postID = document.querySelector('#post-id').innerHTML;

        // 移动设备折叠导航
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


        // ajax 请求评论内容

        $.ajax({
            url: '/getComments',
            dataType: 'json',
            type: 'GET',
            data: {
                page: 1,
                postID:postID
            },
            success: function (data) {
                var commentBoard = document.querySelector('#comments-board');
                data.comments.forEach(el => {
                    commentBoard.appendChild(createComment(el.username, el.content));
                });
                currentPage = data.currentPage;
                totalPages = data.totalPages;
                document.querySelector('#current-page').innerHTML = currentPage;
                document.querySelector('#total-page').innerHTML = totalPages;
            },
            error: function () {
                alert('error!!!');
            }
        });

    }


    function createComment(username, content) {
        var comment = document.createElement('div');
        comment.classList.add('comment');

        var commentUser = document.createElement('span');
        commentUser.classList.add('comment-user');
        commentUser.appendChild(document.createTextNode(username));

        var commentContent = document.createElement('span');
        commentContent.classList.add('comment-content');
        commentContent.appendChild(document.createTextNode(content));

        comment.appendChild(commentUser);
        comment.appendChild(commentContent);

        return comment;
    }

})();