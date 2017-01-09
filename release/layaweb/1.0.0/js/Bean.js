var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Bean extends laya.display.Sprite
 */
var Bean = (function (_super) {
    __extends(Bean, _super);
    function Bean(x, y, colorNum) {
        if (x === void 0) { x = Math.random() * game.gameMainUI.map.width; }
        if (y === void 0) { y = Math.random() * game.gameMainUI.map.height; }
        if (colorNum === void 0) { colorNum = Math.floor(Math.random() * (6 - 1 + 1) + 1); }
        _super.call(this);
        this.haveEaten = false;
        this.speed = 2;
        this.eatenTargetPos = { x: 0, y: 0 };
        this.haveEatenDis = 4;
        this.eatenPos = { x: 0, y: 0 };
        this.eatenInitPos = { x: 0, y: 0 };
        this.colorNum = colorNum;
        this.zOrder = 0;
        this.visible = false;
        this.eatenInitPos["x"] = x;
        this.eatenInitPos["y"] = y;
        this.init(x, y);
    }
    Bean.prototype.init = function (x, y) {
        this.loadImage("images/bean" + this.colorNum + ".png", 0, 0, 0, 0, new Handler(this, this.loaded, [x, y]));
    };
    Bean.prototype.loaded = function (x, y) {
        this.zOrder = 0;
        this.pivot(this.width / 2, this.height / 2);
        this.pos(x, y);
        this.visible = true;
    };
    return Bean;
}(laya.display.Sprite));
//# sourceMappingURL=Bean.js.map