class _Events {
    constructor() {
        document.addEventListener('keydown', this.keyPressed.bind(this));
        document.addEventListener('keyup', this.keyReleased.bind(this));

        this.keyStatus = {};
    }

    keyPressed(event) {
        let key = event.keyCode;
        let keyStr = String.fromCharCode((96 <= key && key <= 105)? key-48 : key);
        this.keyStatus[keyStr] = true;
    }
    keyReleased(event) {
        let key = event.keyCode;
        let keyStr = String.fromCharCode((96 <= key && key <= 105)? key-48 : key);
        this.keyStatus[keyStr] = false;
    }

    isKeyDown(char) {
        return this.keyStatus[char];
    }
}

let Events = new _Events();