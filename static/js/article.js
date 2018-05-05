(function () {

    var currentPage = 1; // 保存当前页码
    var totalPage = null; // 总页面数
    var postID = null; // 文章编号
    var postTitle = '';

    window.onload = function () {

        postID = document.querySelector('#post-id').innerHTML;
        postTitle = document.querySelector('.card-header').innerHTML;

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


        // ajax 请求评论内容
        $.ajax({
            url: '/api/getpublishcomments',
            dataType: 'json',
            type: 'GET',
            data: {
                page: 1,
                postID: postID
            },
            success: function (data) {
                var commentBoard = document.querySelector('#comments-board');
                var len = data.length;
                if (len != 0) {
                    data.forEach(el => {
                        commentBoard.appendChild(createComment(el.username, el.content));
                    });
                    // 再去请求页码信息
                    getComments();
                } else {
                    document.querySelector('#comment').style.display = 'none';
                    // 没有评论，不用再发起ajax
                }

            },
            error: function () {
                alert('获取评论失败');
                console.log('获取评论失败');
            }
        });

        // 翻页按钮事件处理程序
        $('a[href="#pre"]').click((e) => {
            if (currentPage == 1) {
                alert('这已经是第一页了');
            } else {
                insertCommentsList(--currentPage);
            }
        });

        $('a[href="#next"]').click((e) => {
            if (currentPage == totalPage) {
                alert('这已经是最后一页了');
            } else {
                insertCommentsList(++currentPage);
            }
        });


        // 发表评论事件处理程序
        $('input[value="发表"]').click((e) => {

            var username = $('input[name="user"]').val(),
                email = $('input[name="email"]').val(),
                content = $('#comment-content').val();

            if (validateComment(username, email, content)) {

                $.ajax({
                    url: '/api/publishcomment',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        username: username,
                        email: email,
                        content: content,
                        postID: postID,
                        postTitle: postTitle,
                        ispublish: 0
                    },
                    success: function (data) {
                        if (data.done) {
                            alert('评论成功！');
                            window.location.reload();
                        } else {
                            alert('评论失败');
                        }
                    },
                    error: function () {
                        console.log('评论请求失败');
                        alert('评论请求失败');
                    }
                });

            }
        });

    }

    // ajax 请求页码信息
    function getComments() {
        $.ajax({
            url: '/api/getSum',
            type: 'GET',
            dataType: 'json',
            data: {
                table: 'comments',
                id: postID
            },
            success: function (sum) {
                totalPage = parseInt(sum / 6) + 1;
                document.querySelector('#current').innerHTML = currentPage;
                document.querySelector('#total').innerHTML = totalPage;
            },
            error: function () {
                console.log('请求页面时发生错误');
            }
        });
    }


    function insertCommentsList(page) {
        $.ajax({
            url: '/api/getpublishcomments',
            dataType: 'json',
            type: 'GET',
            data: {
                page: currentPage,
                postID: postID
            },
            success: function (data) {
                var commentBoard = document.querySelector('#comments-board');
                var commentsLength = commentBoard.children.length;
                for (let i = 0; i < commentsLength; i++) {
                    commentBoard.removeChild(commentBoard.children[0]);
                }
                var len = data.length;
                data.forEach(el => {
                    commentBoard.appendChild(createComment(el.username, el.content));
                });
            },
            error: function () {
                alert('获取评论失败');
                console.log('获取评论失败');
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

    function validateComment(username, email, content) {

        if (username.trim() == '') {
            alert('请输入昵称');
            return false;
        }

        if (!/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(email)) {
            alert('请输入正确的电子邮箱');
            return false;
        }

        if (content.trim() == '') {
            alert('请输入评论内容');
            return false;
        }

        return true;
    }

})();