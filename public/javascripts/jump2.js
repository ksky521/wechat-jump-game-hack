function getImageData(src) {
    const img = new Image();
    return new Promise((resolve, reject) => {
        img.onload = () => {
            img.onerror = img.onload = null;
            let canvas = document.createElement('canvas');
            // 720 * 1280
            let width = img.width;
            let height = img.height;
            let scale = width / 720;
            height = Math.floor(height / scale);
            width = canvas.width = 720;
            canvas.height = height;
            let ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            let imgData = ctx.getImageData(0, 0, width, height);
            resolve(imgData);
        };
        img.onerror = (e) => {
            img.onerror = img.onload = null;
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
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
        }
    }
    pos[0] = Math.floor((maxX + minX) / 2);
    pos[1] = maxY;
    // console.log(`player position (x, y)= (${pos[0]}, ${pos[1]})`);
    return pos;
}
function getGray(r, g, b) {
    return Math.floor((r + g + b) / 3);
}
function grayHelper(a, b, t) {
    if (a > b - t && a < b + t) {
        return true;
    }
    return false;
}
function getNextCenter(data, width, height) {
    let startY = Math.floor(height / 4);
    let endY = Math.floor(height * 3 / 4);
    let startX = startY * width * 4;

    // 边缘检测
    for (let i = startX, len = endY * width * 4; i < len; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        if (!tolerenceHelper(r, g, b, data[i + 8], data[i + 9], data[i + 10], 5)) {
            data[i] = 255;
            data[i + 1] = 0;
            data[i + 2] = 0;
        }
    }

    // 去除背景色
    let r = data[startX],
        g = data[startX + 1],
        b = data[startX + 2];

    let maxY = -1;
    let apex = [];
    let pos = [0, 0];
    // 保证从当前小人位置底部点往上
    let endX = width;
    let gapCount = 0;

    for (let y = startY; y < endY; y++) {
        let find = 0;
        for (let x = 1; x < endX; x++) {
            let i = y * (width * 4) + x * 4;
            let rt = data[i];
            let gt = data[i + 1];
            let bt = data[i + 2];
            // 不是默认背景颜色
            if (!tolerenceHelper(rt, gt, bt, r, g, b, 30) && !tolerenceHelper(rt, gt, bt, 255, 0, 0, 10)) {
                if (apex.length === 0) {
                    //找出顶点
                    apex = [rt, gt, bt, x, y];
                    pos[0] = x;
                    // 减少循环范围
                    endX = x;
                    maxY = y + 60;
                    // y+60行，加快循环，找不到中点也保证不会出去
                    y += 60;
                    break;
                } else if (tolerenceHelper(rt, gt, bt, apex[0], apex[1], apex[2], 10)) {
                    //存在顶点了，则根据顶点颜色值开始匹配
                    maxY = Math.max(maxY, y);
                    find = x;
                    break;
                    // console.log(rt, gt, bt, apex.join(','));
                }
            }
        }
        if (apex.length !== 0 && !find) {
            // console.log(find, maxY);
            gapCount++;
        }
        if (gapCount === 3) {
            //↑次找不到就跳出
            break;
        }
    }

    pos[1] = Math.floor((maxY + apex[4]) / 2);
    // console.log(`next position center (x,y)=${pos[0]},${pos[1]}, ${maxY},${apex[4]}`);
    return pos;
}
async function getPosition(img) {
    let {data, width, height} = await getImageData(img);
    let pos1 = getCurCenter(data, width, height);
    let pos2 = getNextCenter(data, width, height);
    return {pos1, pos2, data, width, height};
}
