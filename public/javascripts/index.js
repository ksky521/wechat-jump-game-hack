function getScreenCap() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/jumponejump/getscreencap',
            type: 'POST',
            dataType: 'json',
            data: {},
            success: function(result) {
                if (result.error) {
                    reject(result.error);
                } else {
                    console.log('获取图片成功');
                    resolve(`/images/jump_screencap/screencap.png?_t=${Date.now()}`);
                }
            }
        });
    });
}
function jump({pos1, pos2, width}) {
    return new Promise((resolve, reject) => {
        if (pos1[0] > 10 && pos2[0] > 10 && pos1[1] > 10 && pos2[1] > 10 && pos1[0] < 3e4 && pos2[1] < 3e4) {
        } else {
            reject(pos1, pos2, width);
        }
        // 720修正
        let scale = 720 / width;
        pos1[0] = pos1[0] * scale;
        pos1[1] = pos1[1] * scale;
        pos2[0] = pos2[0] * scale;
        pos2[1] = pos2[1] * scale;

        const distance = Math.sqrt(Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2));
        $.ajax({
            url: '/jumponejump/',
            type: 'POST',
            dataType: 'json',
            data: {
                distance: distance
            },
            success: function(result) {
                if (result.error) {
                    reject(result.error);
                } else {
                    console.log('跳转成功');
                    resolve();
                }
            }
        });
    });
}
function start() {
    getScreenCap()
        .then(getPosition)
        .then(jump)
        .then(function() {
            setTimeout(start, 1e3);
        })
        .catch((e) => {
            console.error(e);
            if (e.code === 1) {
                //发现存在图片获取失败的问题，增加reload页面
                location.reload();
            }
        });
}

start();
