/**
 * Snake extends laya.display.Sprite
 */
class Snake extends laya.display.Sprite {
    speedObj: Object = { "slow": 2, "fast": 4, "rotation": 10 }
    speedNow: string = "slow"
    snakeInitSize: number = 0.45
    snakeSize: number
    snakeLength: number = 24
    kill: number = 0

    speed: number
    colorNum: number
    targetR: number
    bodySpace: number
    rotationTemp: number
    bodyArr: Array<Sprite> = []
    pathArr: Array<Object> = []
    eatBean: number = 0
    bodyBeanNum: number = 6//吃几颗豆增加一节身体
    bodyMaxNum: number = 500
    initWidth: number = 40

    AI: boolean = false

    constructor(
        colorNum: number = Math.floor(Math.random() * (5 - 1 + 1) + 1)
        , x: number = game.gameMainUI.map.width / 2
        , y: number = game.gameMainUI.map.height / 2
    ) {
        super()
        this.speed = this.speedObj[this.speedNow]
        this.targetR = this.rotation
        this.colorNum = colorNum
        this.visible = false
        this.snakeSize = this.snakeInitSize

        this.loadImage("images/head" + this.colorNum + ".png", 0, 0, 0, 0, new Handler(this, this.loaded, [x, y]))
    }

    loaded(x: number, y: number): void {
        this.zOrder = 11000
        this.initWidth = this.width
        this.rotationTemp = this.rotation
        this.snakeScale(this)
        this.pivot(this.width / 2, this.height / 2)
        this.pos(x, y)
        this.visible = true

        this.bodySpace = Math.floor(this.width / 10 * 8)
        for (let index = 1; index <= this.getBodyNum(); index++) {
            this.addBody(this.x - index * this.bodySpace, this.y, this.rotation)
        }
        for (let index = 0; index < this.bodySpace * this.getBodyNum(); index++) {
            this.pathArr.push({
                x: this.x - index
                , y: this.y
            })
        }
    }

    move(): void {
        this.bodySpace = Math.floor(this.width / 10 * 8)

        this.headMove()
        this.bodyMove()
        this.speedChange()
        this.rotationChange()
        this.bodyCheck()
    }

    moveOut(): void {
        //碰到边界了
    }

    headMove(): void {
        let x = this.speed * Math.cos(this.rotation * Math.PI / 180)
        let y = this.speed * Math.sin(this.rotation * Math.PI / 180)
        this.rotation = this.rotationTemp

        let pos = { x: this.x, y: this.y }
        let posBefore = { x: this.x, y: this.y }
        if (!(this.x + x >= game.gameMainUI.map.width - this.width / 2 || this.x + x <= this.width / 2)) {
            this.x += x
            pos.x = this.x
        } else {
            this.moveOut()
        }
        if (!(this.y + y >= game.gameMainUI.map.height - this.width / 2 || this.y + y <= this.width / 2)) {
            this.y += y
            pos.y = this.y
        } else {
            this.moveOut()
        }

        for (let index = 1; index <= this.speed; index++) {
            this.pathArr.unshift({
                x: index * Math.cos(Math.atan2(pos.y - posBefore.y, pos.x - posBefore.x)) + posBefore.x
                , y: index * Math.sin(Math.atan2(pos.y - posBefore.y, pos.x - posBefore.x)) + posBefore.y
            })
        }
    }

    bodyMove(): void {
        for (let index = 0; index < this.bodyArr.length; index++) {
            let element = this.bodyArr[index];
            if (this.pathArr[(index + 1) * this.bodySpace]) {
                element.rotation = Math.atan2(
                    this.pathArr[(index + 1) * this.bodySpace]["y"] - element.y
                    , this.pathArr[(index + 1) * this.bodySpace]["x"] - element.x
                ) / Math.PI * 180
                element.pos(this.pathArr[(index + 1) * this.bodySpace]["x"], this.pathArr[(index + 1) * this.bodySpace]["y"])
            }
            if (this.pathArr.length > this.bodyArr.length * (1 + this.bodySpace)) {
                this.pathArr.pop()
            }
        }
    }

    snakeScale(ele: Sprite | Snake, eleType: string = "head"): void {
        let x = ele.x, y = ele.y, zOrder = ele.zOrder
        ele.pivot(ele.width / 2, ele.height / 2)
        ele.graphics.clear()
        ele.loadImage("images/" + eleType + this.colorNum + ".png", 0, 0, this.initWidth * this.snakeSize, this.initWidth * this.snakeSize)
        ele.pivot(ele.width / 2, ele.height / 2)
        ele.pos(x, y)
        this.speedObj["rotation"] = 4 / this.snakeSize
    }

    speedChange(): void {
        this.speed = this.speedNow == 'slow' ?
            (this.speed > this.speedObj[this.speedNow] ? this.speed - 1 : this.speedObj[this.speedNow])
            : (this.speed < this.speedObj[this.speedNow] ? this.speed + 1 : this.speedObj[this.speedNow])
    }

    rotationChange(): void {
        let perRotation = Math.abs(this.targetR - this.rotationTemp) < this.speedObj['rotation'] ? Math.abs(this.targetR - this.rotationTemp) : this.speedObj['rotation']
        if (this.targetR < -0 && this.rotationTemp > 0 && Math.abs(this.targetR) + this.rotationTemp > 180) {
            perRotation = (180 - this.rotationTemp) + (180 + this.targetR) < this.speedObj['rotation'] ? (180 - this.rotationTemp) + (180 + this.targetR) : this.speedObj['rotation']
            this.rotationTemp += perRotation
        } else {
            this.rotationTemp += this.targetR > this.rotationTemp && Math.abs(this.targetR - this.rotationTemp) <= 180 ? perRotation : -perRotation
        }
        this.rotationTemp = Math.abs(this.rotationTemp) > 180 ? (this.rotationTemp > 0 ? this.rotationTemp - 360 : this.rotationTemp + 360) : this.rotationTemp
    }

    addBody(x: number, y: number, r: number): void {
        let body: Sprite = new Sprite()
        let zOrder = this.zOrder - this.bodyArr.length - 1
        body.visible = false
        body.alpha = 0
        body.zOrder = zOrder
        body.loadImage("images/body" + this.colorNum + ".png", 0, 0, 0, 0, new Handler(this, () => {
            this.snakeScale(body, "body")
            body.pos(x, y)
            body.rotation = r
            
            game.gameMainUI.map.addChild(body)
            
            body.visible = true
            body.alpha = 1
        }))

        this.bodyArr.push(body)
    }

    bodyCheck() {
        if (this.eatBean >= this.bodyBeanNum && this.bodyArr.length < this.bodyMaxNum) {
            let addBodyNum = Math.floor(this.eatBean / this.bodyBeanNum)
            let x = this.bodyArr[this.bodyArr.length - 1].x
            let y = this.bodyArr[this.bodyArr.length - 1].y
            let r = this.bodyArr[this.bodyArr.length - 1].rotation
            for (let index = 0; index < addBodyNum; index++) {
                this.addBody(this.bodySpace * Math.cos(r * Math.PI / 180), this.bodySpace * Math.sin(r * Math.PI / 180), r)
            }
            for (let index = 0; index < this.bodySpace * addBodyNum; index++) {
                this.pathArr.push({
                    x: this.x - index * Math.cos(r * Math.PI / 180)
                    , y: this.y - index * Math.sin(r * Math.PI / 180)
                })
            }
            this.eatBean = this.eatBean % this.bodyBeanNum

            if (this.snakeSize < 1) {
                this.snakeSize = this.snakeInitSize + (1 - this.snakeInitSize) / this.bodyMaxNum * this.bodyArr.length
                this.bodyArr.forEach(element => {
                    this.snakeScale(element, "body")
                })
                // for (let index = this.bodyArr.length - 1; index >= 0; index--) {
                //     this.snakeScale(this.bodyArr[index], "body")
                // }
                this.snakeScale(this)
            } else {
                this.snakeSize = 1
            }
        }

    }

    getBodyNum(): number {
        return Math.floor(this.snakeLength / this.bodyBeanNum)
    }

    reverseRotation(): void {
        this.targetR = this.rotation > 0 ? this.rotation - 180 : this.rotation + 180
    }
}