/**
 * Bean extends laya.display.Sprite
 */
class Bean extends laya.display.Sprite {
    colorNum: number
    orderNum: number

    haveEaten: boolean = false
    eatenTarget: Snake
    speed: number = 2
    eatenTargetPos: Object = { x: 0, y: 0 }
    haveEatenDis: number = 4
    eatenPos: Object = { x: 0, y: 0 }
    eatenInitPos: Object = { x: 0, y: 0 }

    constructor(
        x: number = Math.random() * game.gameMainUI.map.width
        , y: number = Math.random() * game.gameMainUI.map.height
        , colorNum: number = Math.floor(Math.random() * (6 - 1 + 1) + 1)
    ) {
        super()
        this.colorNum = colorNum
        this.zOrder = 0
        this.visible = false
        this.eatenInitPos["x"] = x
        this.eatenInitPos["y"] = y
        this.init(x, y)
    }

    init(x: number, y: number): void {
        this.loadImage("images/bean" + this.colorNum + ".png", 0, 0, 0, 0, new Handler(this, this.loaded, [x, y]))
    }

    loaded(x: number, y: number): void {
        this.zOrder = 0
        this.pivot(this.width / 2, this.height / 2)
        this.pos(x, y)
        this.visible = true
    }
}