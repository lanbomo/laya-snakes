var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * GameMain extends ui.GameMainUI
 */
var GameMain = (function (_super) {
    __extends(GameMain, _super);
    function GameMain() {
        _super.call(this);
        this.keySpaceDown = false;
        this.init();
    }
    GameMain.prototype.init = function () {
        this.ctrl_flash.on("mousedown", this.ctrl_flash, this.ctrlFlashDown);
        this.ctrl_flash.on("mouseup", this.ctrl_flash, this.ctrlFlashUp);
        Laya.stage.on("mouseup", this, this.ctrlRockerUp);
        Laya.stage.on("mousemove", this, this.ctrlRockerDown);
        Laya.stage.on("keydown", this, this.keyDown);
        Laya.stage.on("keyup", this, this.keyUp);
    };
    GameMain.prototype.keyUp = function (e) {
        if (e.keyCode == 32) {
            this.ctrlFlashUp();
        }
    };
    GameMain.prototype.keyDown = function (e) {
        if (e.keyCode == 32) {
            this.ctrlFlashDown();
        }
    };
    GameMain.prototype.ctrlFlashDown = function () {
        game.snakeSelf.speedNow = "fast";
    };
    GameMain.prototype.ctrlFlashUp = function () {
        game.snakeSelf.speedNow = "slow";
    };
    GameMain.prototype.ctrlRockerUp = function () {
        if (Laya.stage.mouseX <= game.stageW / 1.5) {
            this.ctrl_rocker.visible = true;
            this.ctrl_rocker_move.visible = false;
        }
    };
    GameMain.prototype.ctrlRockerDown = function () {
        if (Laya.stage.mouseX <= game.stageW / 1.5) {
            this.ctrl_rocker.visible = false;
            this.ctrl_rocker_move.visible = true;
            if (distance(Laya.stage.mouseX, Laya.stage.mouseY, this.ctrl_back.x, this.ctrl_back.y) <= (this.ctrl_back.width / 2 - this.ctrl_rocker.width / 2)) {
                this.ctrl_rocker_move.pos(Laya.stage.mouseX, Laya.stage.mouseY);
            }
            else {
                this.ctrl_rocker_move.pos(this.ctrl_back.x + (this.ctrl_back.width / 2 - this.ctrl_rocker.width / 2) * Math.cos(Math.atan2(Laya.stage.mouseY - this.ctrl_back.y, Laya.stage.mouseX - this.ctrl_back.x)), this.ctrl_back.y + (this.ctrl_back.width / 2 - this.ctrl_rocker.width / 2) * Math.sin(Math.atan2(Laya.stage.mouseY - this.ctrl_back.y, Laya.stage.mouseX - this.ctrl_back.x)));
            }
            game.snakeSelf.targetR = Math.atan2(Laya.stage.mouseY - this.ctrl_back.y, Laya.stage.mouseX - this.ctrl_back.x) * 180 / Math.PI;
        }
    };
    return GameMain;
}(ui.GameMainUI));
//# sourceMappingURL=GameMain.js.map