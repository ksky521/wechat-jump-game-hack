/**
 * Created by beiwan on 2017/12/29.
 */
const util = require('util');
const fs = require('fs');
const path = require('path');
const exec = util.promisify(require('child_process').exec);

const ADB_PATH = 'adb';
const SCREENCAP_REMOTE_PATH = '/sdcard/screencap.png';
const SCREENCAP_PATH = path.resolve('.', 'public/images/jump_screencap');

const BOOM = 4.88;

jumpGo = async (timeout) => {
    const r = Math.random() * 20;
    const {stdout} = await exec(
        `${ADB_PATH} shell input touchscreen swipe ${150 + r} ${200 + r} ${140 + r} ${100 + r} ${timeout}`
    );
    console.log(stdout);
};

fetchScreenCap = async () => {
    const {stdout, stderr} = await exec(`${ADB_PATH} shell screencap -p ${SCREENCAP_REMOTE_PATH}`);
    console.log('fetch...');
};

pullScreenCap = async () => {
    const {stdout, stderr} = await exec(
        `${ADB_PATH} pull ${SCREENCAP_REMOTE_PATH} ${SCREENCAP_PATH}/screencap.png`,
        []
    );
    console.log('pull...');
};

distance = (start, end) => {
    return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
};

iJump = async (distance) => {
    await jumpGo(parseInt(distance * BOOM));
    await setTimeout(async () => {
        await fetchScreenCap();
        await pullScreenCap();
    }, 2000);
};

refreshScreencap = async () => {
    await fetchScreenCap();
    await pullScreenCap();
};

module.exports = {
    iJump,
    refreshScreencap
};
