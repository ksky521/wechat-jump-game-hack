const testUrl = '/images/demos/1.png';
const canvas = document.createElement('canvas');

getPosition(testUrl).then(({pos1, pos2, data, width, height}) => {
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);

    const start = pos1[1] * width * 4 + pos1[0] * 4;
    const end = pos2[1] * width * 4 + pos2[0] * 4;
    for (let i = 0; i < data.length; i += 4) {
        if (near(i, start, end, 16)) {
            imgData.data[i] = 255;
            imgData.data[i + 1] = 0;
            imgData.data[i + 2] = 0;
        } else {
            imgData.data[i] = data[i];
            imgData.data[i + 1] = data[i + 1];
            imgData.data[i + 2] = data[i + 2];
        }
        imgData.data[i + 3] = 255;
    }

    ctx.putImageData(imgData, 0, 0);
    $('#canvas').append(canvas)
});

function near(i, start, end, t) {
    if ((i > start - t && i < start + t) || (i > end - t && i < end + t)) {
        return true;
    }
    return false;
}
