(function () {

    var currentPage = 1;
    var totalPage = 1;
    var tagArr = []; // 保存标签信息
    var currentTag = null;

    window.onload = function () {

        // 获取页码信息
        getSum();

        // ajax 获取文章列表信息
        getPostList(1);

        // 获取标签
        getTags();

        // 翻页按钮事件处理程序
        $('a[href="#pre"]').click((e) => {
            if (currentPage == 1) {
                alert('已经是第一页了');
            } else {
                if (currentTag == null) {
                    getPostList(--currentPage);
                } else {
                    getPostByTag(currentTag, --currentPage);
                }
            }
        });

        $('a[href="#next"]').click((e) => {
            if (currentPage == totalPage) {
                alert('已经是最后一页了');
            } else {
                if (currentTag == null) {
                    getPostList(++currentPage);
                } else {
                    getPostByTag(currentTag, ++currentPage);
                }
            }
        });

        // 标签按钮/删除按钮事件处理程序
        $('body').click((e) => {
            if (e.target.href) {
                var href = e.target.href.slice(e.target.href.indexOf('#') + 1);
                if (href == '') {
                    getPostList(1);
                    getSum();
                    currentTag = null;
                } else if (typeof e.target.href == 'string') {
                    tagArr.forEach(tag => {
                        if (tag == href) {
                            getPostByTag(href);
                            currentTag = href; // 设置当前选择的tag
                            getSumByTag(href);
                            currentPage = 1;
                        }
                    });
                }
            }
            
            if(e.target.value == '删除文章') {
                var posts = document.querySelectorAll('input[name="posts"]');
                var len = posts.length;
                var deleteArr = [];
                for(let i=0;i<len;i++) {
                    if(posts[i].checked) {
                        deleteArr.push(Number(posts[i].value));
                    }
                }
                console.log(deleteArr);
                $.ajax({
                    url:'/api/deleteposts',
                    type:'POST',
                    data:{
                        arr:deleteArr.slice(0)
                    },
                    dataType:'json',
                    success:function(data){
                        if(data.done) {
                            alert('删除成功！');
                            window.location.reload();
                        } else {
                            alert('删除失败');
                        }
                    },error:function(){
                        console.log('删除请求失败');
                        alert('删除请求失败');
                    }
                });
            }

        });
    }

    function createTableRow(title, id, date, isPrivate) {
        var trow = document.createElement('tr'),
            tdSelect = document.createElement('td'),
            tdTitle = document.createElement('td'),
            tdDate = document.createElement('td'),
            tdEdit = document.createElement('td'),
            tdCheckBox = document.createElement('input'),
            tdEditLink = document.createElement('a');

        tdCheckBox.value = id;
        tdCheckBox.name = 'posts';
        tdCheckBox.type = 'checkbox';
        tdSelect.appendChild(tdCheckBox);

        if (isPrivate == 0) {
            var tdTitleLink = document.createElement('a');
            tdTitleLink.href = `/post/${id}`;
            tdTitleLink.appendChild(document.createTextNode(title));
            tdTitle.appendChild(tdTitleLink);
        } else if (isPrivate == 1) {
            var tdTitleText = document.createElement('strong');
            tdTitleText.innerHTML = '【草稿】' + title;
            tdTitle.appendChild(tdTitleText);
        }

        tdEditLink.href = `/admin/edit?id=${id}`;
        tdEditLink.appendChild(document.createTextNode('编辑'));
        tdEdit.appendChild(tdEditLink);
        tdEdit.style.width = '40px';
        tdEdit.style.cssFloat = 'right';

        tdDate.appendChild(document.createTextNode(date));
        tdDate.style.width = '90px';
        tdDate.style.cssFloat = 'right';

        trow.appendChild(tdSelect);
        trow.appendChild(tdTitle);
        trow.appendChild(tdEdit);
        trow.appendChild(tdDate);

        return trow;
    }

    function createTag(tagName, tagHref) {
        var tag = document.createElement('a');
        tag.classList.add('tag');
        tag.setAttribute('href', tagHref);
        tag.appendChild(document.createTextNode(tagName));
        return tag;
    }

    function getSumByTag(tagName) {

        $.ajax({
            url: '/api/getsumbytag',
            dataType: 'json',
            data: {
                tag: tagName
            },
            success: function (sum) {
                console.log(sum);
                totalPage = parseInt(sum / 6) + 1;
                document.querySelector('#current').innerHTML = currentPage;
                document.querySelector('#total').innerHTML = totalPage;
            },
            error: function () {
                console.log('请求页面时发生错误');
            }
        });

    }

    function getSum() {
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
    }

    function getTags() {
        $.ajax({
            url: '/api/gettags',
            type: 'GET',
            dataType: 'json',
            success: function (data) {

                var rootParent = document.querySelector('#post-panel');
                var rel = document.querySelector('#post-list');
                tagArr = data.slice(0);

                data.forEach(t => {
                    rootParent.insertBefore(createTag(t, `#${t}`), rel);
                });

                //TODO...

                /*
                var tagsBody = document.querySelector('#tags');
                data.forEach((tag)=>{
                    tagsBody.appendChild(createTag(tag,`#${tag}`));
                });
                */
                console.log('getting tags successfully');
            },
            error: function () {
                console.log('getting tags error');
            }
        });
    }

    function getPostList(page) {
        $.ajax({
            url: '/api/getpostlist',
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

                // 加入新的文章
                data.forEach((row) => {
                    tbody.appendChild(createTableRow(row.title, row.id, row.publishDate, row.isPrivate));
                });
            },
            error: function () {
                alert('加载文章时发生了错误');
                console.log('error occured when loading posts');
            }
        });
    }

    // 按页和tag获取文章
    function getPostByTag(tagName, page) {
        $.ajax({
            url: '/api/getpostsbytag',
            type: 'GET',
            dataType: 'json',
            data: {
                tag: tagName,
                page: page
            },
            success: function (data) {
                var tbody = document.querySelector('tbody');

                // 移除旧元素
                var len = tbody.children.length;
                for (let i = 0; i < len; i++) {
                    tbody.removeChild(tbody.children[0]);
                }

                // 加入新的文章
                data.forEach((row) => {
                    tbody.appendChild(createTableRow(row.title, row.id, row.publishDate, row.isPrivate));
                });

                document.querySelector('#current').innerHTML = currentPage;

            },
            error: function () {
                console.error('请求文章失败');
            }
        })
    }

})()