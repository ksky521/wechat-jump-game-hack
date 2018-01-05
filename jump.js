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

const BOOM = 2.04;

jumpGo = async (timeout) => {
    let r = Math.random() * 20;
    if (timeout > 0 && !isNaN(timeout)) {
        const {stdout} = await exec(`${ADB_PATH} shell input swipe ${r + 10} ${r + 20} ${r - 10} ${r - 2} ${timeout}`);
        console.log(stdout, timeout);
    }
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
