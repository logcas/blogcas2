(function () {

    var currentPage = 1;
    var totalPage = 1;

    window.onload = function () {

        // 请求评论列表
        getCommentList(1);

        // 请求页码
        getSum();

        // 翻页按钮事件处理程序
        $('a[href="#pre"]').click((e) => {
            if (currentPage == 1) {
                alert('已经是第一页了');
            } else {
                getCommentList(--currentPage);
            }
        });

        $('a[href="#next"]').click((e) => {
            if (currentPage == totalPage) {
                alert('已经是最后一页了');
            } else {
                getCommentList(++currentPage);
            }
        });

        // 删除按钮事件处理程序
        $('body').click((e) => {
            if (e.target.value == '删除评论') {
                var comments = document.querySelectorAll('input[name="comments"]');
                var len = comments.length;
                var deleteArr = [];
                for (let i = 0; i < len; i++) {
                    if (comments[i].checked) {
                        deleteArr.push(Number(comments[i].value));
                    }
                }
                console.log(deleteArr);
                if (deleteArr.length != 0) {
                    $.ajax({
                        url: '/api/deletecomments',
                        type: 'POST',
                        data: {
                            arr: deleteArr.slice(0)
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data.done) {
                                alert('删除成功！');
                                window.location.reload();
                            } else {
                                alert('删除失败');
                            }
                        }, error: function () {
                            console.log('删除请求失败');
                            alert('删除请求失败');
                        }
                    });
                } else {
                    alert('请选择需要删除的对象');
                }
            }

            if (e.target.value == '审核评论') {
                var comments = document.querySelectorAll('input[name="comments"]');
                var len = comments.length;
                var deleteArr = [];
                for (let i = 0; i < len; i++) {
                    if (comments[i].checked) {
                        deleteArr.push(Number(comments[i].value));
                    }
                }
                console.log(deleteArr);
                if (deleteArr.length != 0) {
                    $.ajax({
                        url: '/api/checkcomments',
                        type: 'POST',
                        data: {
                            id: deleteArr.slice(0),
                            ispublish: 1
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data.done) {
                                alert('审核成功！');
                                window.location.reload();
                            } else {
                                alert('审核失败');
                            }
                        }, error: function () {
                            console.log('审核请求失败');
                            alert('审核请求失败');
                        }
                    });
                } else {
                    alert('请选择需要审核的对象');
                }
            }

            if (e.target.value == '关闭评论') {
                var comments = document.querySelectorAll('input[name="comments"]');
                var len = comments.length;
                var deleteArr = [];
                for (let i = 0; i < len; i++) {
                    if (comments[i].checked) {
                        deleteArr.push(Number(comments[i].value));
                    }
                }
                console.log(deleteArr);
                if (deleteArr.length != 0) {
                    $.ajax({
                        url: '/api/checkcomments',
                        type: 'POST',
                        data: {
                            id: deleteArr.slice(0),
                            ispublish: 0
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data.done) {
                                alert('关闭评论成功！');
                                window.location.reload();
                            } else {
                                alert('关闭评论失败');
                            }
                        }, error: function () {
                            console.log('关闭评论请求失败');
                            alert('关闭评论请求失败');
                        }
                    });
                } else {
                    alert('请选择需要关闭的对象');
                }
            }

        });
    }

    function createTableRow(row) {
        var trow = document.createElement('tr'),
            tdSelect = document.createElement('td'),
            tdContent = document.createElement('td'),
            tdDate = document.createElement('td'),
            tdCheckBox = document.createElement('input');

        tdCheckBox.value = row.id;
        tdCheckBox.name = 'comments';
        tdCheckBox.type = 'checkbox';
        tdSelect.appendChild(tdCheckBox);

        var content = document.createElement('h4'),
            topic = document.createElement('p'),
            email = document.createElement('p'),
            username = document.createElement('p');
        if(row.ispublish == 1){
            content.appendChild(document.createTextNode('内容：' + row.content));
        } else {
            content.appendChild(document.createTextNode('【未审核】内容：' + row.content));
        }
        topic.appendChild(document.createTextNode('TO: ' + row.posttitle));
        username.appendChild(document.createTextNode('FROM: ' + row.username));
        email.appendChild(document.createTextNode('Email: ' + row.email));
        tdContent.appendChild(username);
        tdContent.appendChild(topic);
        tdContent.appendChild(content);
        tdContent.appendChild(email);

        tdDate.appendChild(document.createTextNode(row.publishdate));
        tdDate.style.width = '90px';
        tdDate.style.cssFloat = 'right';

        trow.appendChild(tdSelect);
        trow.appendChild(tdContent);
        trow.appendChild(tdDate);

        return trow;
    }

    function getSum() {
        $.ajax({
            url: '/api/getSum',
            dataType: 'json',
            data: {
                table: 'comments'
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
    }

    function getCommentList(page) {
        $.ajax({
            url: '/api/getcomments',
            type: 'GET',
            data: {
                page: page
            },
            dataType: 'json',
            success: function (data) {
                var tbody = document.querySelector('tbody');

                // 移除旧元素
                var len = tbody.children.length;
                for (let i = 0; i < len; i++) {
                    tbody.removeChild(tbody.children[0]);
                }

                // 加入新的评论
                data.forEach((row) => {
                    tbody.appendChild(createTableRow(row));
                });

                document.querySelector('#current').innerHTML = currentPage;
            },
            error: function () {
                alert('加载评论时发生了错误');
                console.log('error occured when loading posts');
            }
        });
    }

})()