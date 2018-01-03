const playerR = 40;
const playerG = 43;
const playerB = 86;

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
            reject(e);
        };
        img.src = src;
    });
}
let count = 0;
function tolerenceHelper(r, g, b, rt, gt, bt, t) {
    return r > rt - t && r < rt + t && g > gt - t && g < gt + t && b > bt - t && b < bt + t;
}

function getPlayerPos(img) {
    return new Promise((resolve, reject) => {
        getImageData(img).then(({data, width, height}) => {
            let minX = Infinity;
            let maxX = -1;
            let maxY = -1;
            let minY = Infinity;
            let pos = [0, 0];

            let startY = Math.floor(height / 4);
            let endY = Math.floor(height * 3 / 4);

            for (let x = 0; x < width; x++) {
                for (let y = startY; y < endY; y++) {
                    let pixel = y * (width * 4) + x * 4;
                    let r = data[pixel];
                    let g = data[pixel + 1];
                    let b = data[pixel + 2];
                    if (y > pos[1] && tolerenceHelper(r, g, b, playerR, playerG, playerB, 16)) {
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                }
            }
            pos[0] = (maxX + minX) / 2;
            pos[1] = maxY;
            console.log(`player position (x, y)= (${pos[0]}, ${pos[1]})`);

            // 在当前位置的上面

            let r = data[0],
                g = data[1],
                b = data[2];

            let pixel = [];
            let nextPos = [0, 0];
            let nextMaxY = -1,
                nextMinY = Infinity;
            // 保证从当前小人位置顶点往上
            endY = Math.min(endY, minY + 30);
            let endX = width;
            for (let y = startY; y < endY; y++) {
                for (let x = 0; x < endX; x++) {
                    let i = y * (width * 4) + x * 4;
                    let rt = data[i];
                    let gt = data[i + 1];
                    let bt = data[i + 2];
                    // 不是默认背景颜色
                    if (!tolerenceHelper(rt, gt, bt, r, g, b, 30)) {
                        if (pixel.length === 0) {
                            //找出顶点
                            pixel = [rt, gt, bt];
                            nextPos[0] = x;
                            // 修正范围,只可能是顶点为上中心y+200的
                            endY = y + 200;
                            endX = x + 20;
                            break;
                        } else {
                            if (x > nextPos[0] - 200 && tolerenceHelper(rt, gt, bt, pixel[0], pixel[1], pixel[2], 5)) {
                                // console.log(x, y);
                                //存在顶点了，则根据颜色值开始匹配

                                nextMaxY = Math.max(nextMaxY, y);
                                nextMinY = Math.min(nextMinY, y);
                            }
                        }
                    }
                }
            }
            nextPos[1] = (nextMaxY + nextMinY) / 2;
            // console.log(points_top, points_left, points_right);
            console.log(`next position center (x,y)=${nextPos[0]},${nextPos[1]}`);

            resolve({
                player: pos,
                nextPos
            });
        });
    });
}

let html = '';
for (let i = 1; i <= 12; i++) {
    let url = `/images/demos/${i}.png`;
    html += `<li><img src="${url}" id="img${i}"/></li>`;
    getPlayerPos(url).then(({player, nextPos}) => {
        console.log(i);
        let pos = $(`#img${i}`).position();
        let div = $(`<div style="background:red;width: 10px;height:10px;
        position:absolute;z-index:999;top:${pos.top + player[1] - 5}px;left:${pos.left + player[0] - 5}px"></div>`);

        div.appendTo($('body'));
        let div2 = $(`<div style="background:red;width: 10px;height:10px;
        position:absolute;z-index:999;top:${pos.top + nextPos[1] - 5}px;left:${pos.left + nextPos[0] - 5}px"></div>`);

        div2.appendTo($('body'));
    });
}
$('#list').html(html);
