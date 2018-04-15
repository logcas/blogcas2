function loginRequest() {
    $.ajax({
        url: '/api/login',
        type: 'GET',
        data: {
            username: $('input[name="username"]').val(),
            password: $('input[name="password"]').val()
        },
        dataType: 'json',
        success: function (data) {
            if (data.check) {
                alert('登陆成功');
                window.location = '/admin';
            } else {
                alert('登陆失败');
            }
        },
        error: function () {
            alert('发生错误')
        }
    })
}

document.querySelector('#login').onclick = function(){
    loginRequest();
}