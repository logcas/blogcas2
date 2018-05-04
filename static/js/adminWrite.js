(function () {

    function checkValid() {
        if ($('input[name="title"]').val() == '') {
            alert('标题不能为空');
            return false;
        }
        if ($('textarea[name="content"]').val() == '') {
            alert('文章内容不能为空');
            return false;
        }
        return true;
    }

    window.onload = function () {

        $('input[value="公开发表"]').click(e => {

            if (checkValid()) {

                $(e.target).attr('disabled', 'true');
                $(e.target).val('正在发布..');

                $.ajax({
                    url: "/api/publishpost",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        title: $('input[name="title"]').val(),
                        content: $('textarea[name="content"]').val(),
                        tags: $('input[name="tags"]').val(),
                        isPrivate: 0
                    },
                    success: function (data) {
                        if (data.done) {
                            alert('发表成功！');
                            window.location = '/admin/posts';
                        } else {
                            alert('发表失败');
                        }
                    },
                    error: function () {
                        alert('发表文章请求出错');
                    }
                });
            }


        });

        $('input[value="保存到草稿箱"]').click(e => {

            if (checkValid()) {

                e.target.attr('disabled', 'true');
                e.target.val('正在保存..');

                $.ajax({
                    url: "/api/publishpost",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        title: $('input[name="title"]').val(),
                        content: $('textarea[name="content"]').val(),
                        tags: $('input[name="tags"]').val(),
                        isPrivate: 1
                    },
                    success: function (data) {
                        if (data.done) {
                            alert('保存成功！');
                            window.location = '/admin/posts';
                        } else {
                            alert('保存失败');
                        }
                    },
                    error: function () {
                        alert('保存文章请求出错');
                    }
                });
            }

        });


    }

})()