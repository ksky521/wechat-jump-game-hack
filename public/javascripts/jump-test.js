function getImageData(src) {
    const img = new Image();
    return new Promise((resolve, reject) => {
        img.onload = () => {
            img.onerror = img.onload = null;
            let canvas = document.createElement('canvas');
            let width = (canvas.width = img.width);
            let height = (canvas.height = img.height);
            let ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            let imgData = ctx.getImageData(0, 0, width, height);
            resolve(imgData);
        };
        img.onerror = (e) => {
            img.onerror = img.onload = null;
            e.message = '图片获取失败';
            e.code = 1;
            reject(e);
        };
        img.src = src;
    });
}
function tolerenceHelper(r, g, b, rt, gt, bt, t) {
    return r > rt - t && r < rt + t && g > gt - t && g < gt + t && b > bt - t && b < bt + t;
}

function getCurCenter(data, width, height) {
    // 小人的颜色值
    const playerR = 40;
    const playerG = 43;
    const playerB = 86;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -1;
    let maxY = -1;
    // 找到小人当前的底部位置
    let pos = [0, 0];

    let startY = Math.floor(height / 4);
    let endY = Math.floor(height * 3 / 4);
    for (let x = 0; x < width; x++) {
        for (let y = startY; y < endY; y++) {
            let i = y * (width * 4) + x * 4;
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            if (y > pos[1] && tolerenceHelper(r, g, b, playerR, playerG, playerB, 16)) {
                // 将匹配到的像素点设置为红色
                data[i] = 255;
                data[i + 1] = 0;
                data[i + 2] = 0;
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
                minY = Math.min(minY, y);
            }
        }
    }
    pos[0] = Math.floor((maxX + minX) / 2);
    pos[1] = maxY;
    pos[2] = [minX, maxX, minY, maxY];
    // console.log(`player position (x, y)= (${pos[0]}, ${pos[1]})`);
    return pos;
}
function getNextCenter(data, width, height, curPos) {
    let startY = Math.floor(height / 4);
    let endY = Math.floor(height * 3 / 4);

    // 去除背景色
    let startX = startY * width * 4;
    let r = data[startX],
        g = data[startX + 1],
        b = data[startX + 2];

    let maxY = -1;
    let apex = [];
    let pos = [0, 0];
    // 保证从当前小人位置底部点往上
    endY = Math.min(endY, curPos[1]);
    let endX = width;
    let gapCount = 0;
    for (let y = startY; y < endY; y++) {
        let find = 0;
        for (let x = 1; x < endX; x++) {
            // 解决小人比下一个台阶高的情况，需要遇见在小人范围内的值就跳出
            if (curPos[3] && curPos[3].length) {
                let [x1, x2, y1, y2] = curPos[3];
                if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
                    continue;
                }
            }

            let i = y * (width * 4) + x * 4;
            let rt = data[i];
            let gt = data[i + 1];
            let bt = data[i + 2];
            // 不是默认背景颜色
            if (!tolerenceHelper(rt, gt, bt, r, g, b, 30)) {
                if (apex.length === 0) {
                    if (!tolerenceHelper(data[i + 4], data[i + 5], data[i + 6], r, g, b, 30)) {
                        //椭圆形找中心，往后找30个像素点
                        let len = 2;
                        while (len++ !== 30) {
                            i += len * 4;
                            if (tolerenceHelper(data[i + 4], data[i + 5], data[i + 6], r, g, b, 30)) {
                                break;
                            }
                        }
                        x += len;
                    }
                    //找出顶点
                    apex = [rt, gt, bt, x, y];
                    pos[0] = x;
                    // 减少循环范围
                    endX = x;
                    break;
                } else if (tolerenceHelper(rt, gt, bt, apex[0], apex[1], apex[2], 5)) {
                    // 物体顶面边涂红
                    data[i] = 255;
                    data[i + 1] = 0;
                    data[i + 2] = 0;

                    //存在顶点了，则根据颜色值开始匹配
                    maxY = Math.max(maxY, y);
                    find = x;
                    break;
                }
            } else {
                // 背景色涂红
                // data[i] = 255;
                // data[i + 1] = 0;
                // data[i + 2] = 0;
            }
        }
        if (apex.length !== 0 && !find) {
            gapCount++;
        }
        if (gapCount === 3) {
            break;
        }
    }
    pos[1] = Math.floor((maxY + apex[4]) / 2);
    // console.log(points_top, points_left, points_right);
    // console.log(`next position center (x,y)=${pos[0]},${pos[1]}`);
    return pos;
}
async function getPosition(img) {
    let {data, width, height} = await getImageData(img);
    let pos1 = getCurCenter(data, width, height);
    let pos2 = getNextCenter(data, width, height, pos1);
    return {pos1, pos2, data, width, height};
}
