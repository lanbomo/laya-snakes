/**
 * GameMain extends ui.GameMainUI
 */
class GameMain extends ui.GameMainUI {

    keySpaceDown: boolean = false

    constructor() {
        super()
        this.init()
    }

    init(): void {
        this.ctrl_flash.on("mousedown", this.ctrl_flash, this.ctrlFlashDown)
        this.ctrl_flash.on("mouseup", this.ctrl_flash, this.ctrlFlashUp)
        Laya.stage.on("mouseup", this, this.ctrlRockerUp)
        Laya.stage.on("mousemove",this, this.ctrlRockerDown)
        Laya.stage.on("keydown",this,this.keyDown)
        Laya.stage.on("keyup",this,this.keyUp)
    }

    keyUp(e):void {
        if(e.keyCode == 32){
            this.ctrlFlashUp()
        }
    }
    keyDown(e):void {
        if(e.keyCode == 32){
            this.ctrlFlashDown()
        }
    }

    ctrlFlashDown(): void {
        game.snakeSelf.speedNow = "fast"
    }
    ctrlFlashUp(): void {
        game.snakeSelf.speedNow = "slow"
    }

    ctrlRockerUp(): void {
        if (Laya.stage.mouseX <= game.stageW / 1.5) {
            this.ctrl_rocker.visible = true
            this.ctrl_rocker_move.visible = false
        }
    }
    ctrlRockerDown(): void {
        if (Laya.stage.mouseX <= game.stageW / 1.5) {
            this.ctrl_rocker.visible = false
            this.ctrl_rocker_move.visible = true
            if (distance(Laya.stage.mouseX, Laya.stage.mouseY, this.ctrl_back.x, this.ctrl_back.y) <= (this.ctrl_back.width / 2 - this.ctrl_rocker.width / 2)) {
                this.ctrl_rocker_move.pos(Laya.stage.mouseX, Laya.stage.mouseY)
            } else {
                this.ctrl_rocker_move.pos(
                    this.ctrl_back.x + (this.ctrl_back.width / 2 - this.ctrl_rocker.width / 2) * Math.cos(Math.atan2(Laya.stage.mouseY - this.ctrl_back.y, Laya.stage.mouseX - this.ctrl_back.x))
                    ,
                    this.ctrl_back.y + (this.ctrl_back.width / 2 - this.ctrl_rocker.width / 2) * Math.sin(Math.atan2(Laya.stage.mouseY - this.ctrl_back.y, Laya.stage.mouseX - this.ctrl_back.x))
                )
            }
            game.snakeSelf.targetR = Math.atan2(Laya.stage.mouseY - this.ctrl_back.y, Laya.stage.mouseX - this.ctrl_back.x) * 180 / Math.PI
        }
    }

    
}