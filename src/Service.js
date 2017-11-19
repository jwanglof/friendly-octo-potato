let currentUuid;
const constCookieUuid = 'alumni-game-cookie';

function setUuid(uuid) {
    if (currentUuid) {
        throw new Error('Can\'t set a new UUID yo!');
    }
    currentUuid = uuid;
}

function getUuid() {
    return currentUuid;
}

module.exports = {
    constCookieUuid,
    setUuid,
    getUuid
};
