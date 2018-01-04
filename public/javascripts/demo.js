function getPointHtml(top, left) {
    return `<div class="point" style="top:${top}px;left:${left}px">`;
}
let html = '';
for (let i = 1; i <= 12; i++) {
    let url = `/images/demos/${i}.png`;
    html += `<li><img src="${url}" id="img${i}"/></li>`;
    getPosition(url).then(({pos1, pos2}) => {
        let {top, left} = $(`#img${i}`).position();
        let $curPoint = $(getPointHtml(top + pos1[1] - 5, left + pos1[0] - 5));
        $curPoint.appendTo($('body'));

        let $nextPoint = $(getPointHtml(top + pos2[1] - 5, left + pos2[0] - 5));
        $nextPoint.appendTo($('body'));
    });
}
$('#list').html(html);
