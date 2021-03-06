'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserLevel = {
    admin: 0,
    member: 1,
    guest: 2,
    setup: 100,
    unknown: 255,
};
class BluenetSettings {
    constructor() {
        this.adminKey = null;
        this.memberKey = null;
        this.basicKey = null;
        this.sessionNonce = null;
        this.validationKey = null;
        this.initializedKeys = false;
        this.userLevel = exports.UserLevel.unknown;
    }

    /**
     * This method will set the admin, member and guest key to the values of the parameters.
     */
    loadKeys(adminKey = null, memberKey = null, basicKey = null) {
        this.adminKey = this._prepKey(adminKey);
        this.memberKey = this._prepKey(memberKey);
        this.basicKey = this._prepKey(basicKey);
        this.initializedKeys = true;
        this.determineUserLevel();
    }

    /**
     * This method will return the buffer of the key depending on the length of the key.
     */
    _prepKey(key) {
        if (!key) {
            return Buffer.alloc(16);
        }
        if (key.length === 16) {
            return Buffer.from(key, 'ascii');
        } else if (key.length === 32) {
            return Buffer.from(key, 'hex');
        } else {
            throw 'Invalid Key: ' + key;
        }
    }

    /**
     * This method will determine the user level for each key.
     */
    determineUserLevel() {
        if (this.adminKey.length == 16) {
            this.userLevel = exports.UserLevel.admin;
        }
        else if (this.memberKey.length == 16) {
            this.userLevel = exports.UserLevel.member;
        }
        else if (this.basicKey.length == 16) {
            this.userLevel = exports.UserLevel.guest;
        }
        else {
            this.userLevel = exports.UserLevel.unknown;
            this.initializedKeys = false;
        }
    }

    /**
     * This method will set the sessionNonce to the value of the parameter.
     */
    setSessionNonce(sessionNonce) {
        this.sessionNonce = sessionNonce;
    }

    /**
     * This method will set the validation key to the value of the parameter.
     */
    setValidationKey(validationKey) {
        this.validationKey = validationKey;
    }
}
exports.BluenetSettings = BluenetSettings;
