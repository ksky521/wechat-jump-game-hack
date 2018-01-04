function f5() {

    jumpPoint.length = 0
    $.ajax({
            url: 'http://localhost:3000/jumponejump/f5',
            type: 'POST',
            dataType: 'json',
            data: {

            },
            success: function (result) {
                $log.append(result.error ? '环境没配对吧，我这里是好的' : '刷新成功!')
                setTimeout(function () {
                    $screen.attr('src', '/images/jump_screencap/screencap.png?v=' + Math.random())

                }, 2000)
            }
        })
}