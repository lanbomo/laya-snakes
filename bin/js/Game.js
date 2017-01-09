var Sprite = laya.display.Sprite;
var Loader = laya.net.Loader;
var Texture = laya.resource.Texture;
var Handler = laya.utils.Handler;
var Browser = laya.utils.Browser;
var TiledMap = laya.map.TiledMap;
var Rectangle = laya.maths.Rectangle;
var Stat = laya.utils.Stat;
var TextFiled = laya.display.Text;
var LocalStorage = laya.net.LocalStorage;
/**
* Game
* 游戏入口类
*/
var Game = (function () {
    function Game() {
        this.stageW = Browser.onQQBrowser ? Browser.width / Browser.pixelRatio : Browser.clientWidth;
        this.stageH = Browser.onQQBrowser ? Browser.height / Browser.pixelRatio : Browser.clientHeight;
        this.beanSingleNumInit = 300;
        this.beanMaxNum = 600;
        this.beanNum = 0;
        this.beanOrder = 0;
        this.beans = {};
        this.SnakeAINum = 5;
        this.snakeAIArr = [];
        this._init();
        Stat.show(200, 10);
    }
    //屏幕适配、初始化舞台
    Game.prototype._init = function () {
        this.stageW = 600;
        this.stageH = Browser.height / Browser.width * this.stageW;
        Laya.init(this.stageW, this.stageH, Laya.WebGL);
        Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
        Laya.stage.bgColor = "#555555";
        //加载资源
        this._load();
        //对屏幕改小改变进行监听
        Browser.window.onresize = onWindowResize;
    };
    Game.prototype._onresizeAction = function () {
        this.loading && this.loading.pos(this.stageW / 2, this.stageH / 2);
        this.gameStartUI && this.gameStartUI.pos(this.stageW / 2, this.stageH / 2);
        this.gameMainUI && (this.gameMainUI.mask_rank.x = (this.stageW - this.gameMainUI.mask_rank.width - 10));
        this.gameMainUI && this.gameMainUI.ctrl_flash.pos(this.stageW - this.gameMainUI.ctrl_flash.width, this.stageH - this.gameMainUI.ctrl_flash.height);
        this.gameMainUI && this.gameMainUI.ctrl_back.pos(this.gameMainUI.ctrl_back.width, this.stageH - this.gameMainUI.ctrl_back.height);
    };
    //加载资源
    Game.prototype._load = function () {
        var _this = this;
        this.loading = new TextFiled();
        this.loading.text = "正在加载资源，请稍后...";
        this.loading.color = "#000000";
        this.loading.font = "Microsoft YaHei";
        this.loading.pos(this.stageW / 2, this.stageH / 2);
        this.loading.pivot(this.loading.width / 2, this.loading.height / 2);
        Laya.stage.addChild(this.loading);
        //加载资源
        Laya.loader.load("res/atlas/images.json", Laya.Handler.create(this, function () {
            //资源加载完成则进入开始界面
            // this.gameStartSence()
            _this.gameMain();
        }), null, Laya.Loader.ATLAS);
        Laya.loader.load("map/tile_map.png");
        Laya.loader.load("images/head1.png");
        Laya.loader.load("images/head2.png");
        Laya.loader.load("images/head3.png");
        Laya.loader.load("images/head4.png");
        Laya.loader.load("images/head5.png");
    };
    //开始界面
    Game.prototype.gameStartSence = function () {
        this.gameStartUI = new GameStart();
        this.gameStartUI.pos(this.stageW / 2, this.stageH / 2);
        this.gameStartUI.btn_single.on("click", this, this.gameStart, [0]);
        this.gameStartUI.btn_net.on("click", this, this.gameStart, [1]);
        Laya.stage.addChild(this.gameStartUI);
        Laya.stage.removeChild(this.loading);
        this.loading.destroy();
    };
    //开始游戏，进入GameMain
    Game.prototype.gameStart = function (gameMode) {
        this.nickname = this.gameStartUI.nickname.label;
        this.neturl = this.gameStartUI.neturl.label;
        this.skin = this.gameStartUI.skinRadio.selectedIndex;
        this.gameMode = gameMode;
        Laya.stage.removeChild(this.gameStartUI);
        this.gameMain();
    };
    //进行游戏
    Game.prototype.gameMain = function () {
        this.gameMainUI = new GameMain();
        this.gameMainUI.map.pos(this.stageW / 2, this.stageH / 2);
        this.gameMainUI.mask_rank.x = this.stageW - this.gameMainUI.mask_rank.width - 10;
        this.gameMainUI.ctrl_flash.pos(this.stageW - this.gameMainUI.ctrl_flash.width - 30, this.stageH - this.gameMainUI.ctrl_flash.height);
        this.gameMainUI.ctrl_back.pos(this.gameMainUI.ctrl_back.width + 30, this.stageH - this.gameMainUI.ctrl_back.height);
        Laya.stage.addChild(this.gameMainUI);
        for (var _bean_i = 0; _bean_i < this.beanSingleNumInit; _bean_i++) {
            this.beanOrder++;
            this.addBean(this.beanOrder);
        }
        this.addBeanRandom();
        this.snakeSelf = new Snake();
        this.gameMainUI.map.addChild(this.snakeSelf);
        for (var index = 0; index < this.SnakeAINum; index++) {
            var snakeAI = new Snake(Math.floor(Math.random() * (5 - 1 + 1) + 1), this.gameMainUI.map.width * Math.random(), this.gameMainUI.map.height * Math.random());
            snakeAI.AI = true;
            this.snakeAIArr.push(snakeAI);
            this.gameMainUI.map.addChild(snakeAI);
        }
        this.snakeAIRotation();
        Laya.timer.frameLoop(1, this, this.gameLoop);
    };
    //游戏主循环
    Game.prototype.gameLoop = function () {
        this.snakeSelf.move();
        this.snakeAIMove();
        this.mapMove();
        this.eateBean();
        this.gameMainUI.text_length.text = this.snakeSelf.snakeLength + "";
        // this.gameMainUI.text_kill.text = this.snakeSelf.snakeSize + ""
        // this.gameMainUI.text_kill.text = Browser.width + " " + Browser.clientWidth + " " + Browser.pixelRatio
    };
    Game.prototype.eateBean = function () {
        for (var key in this.beans) {
            var bean = this.beans[key];
            // if (bean.haveEaten) {//确定了有被吃对象
            //     let x = (bean.speed) * Math.cos(Math.atan2(bean.eatenInitPos["y"] - bean.y, bean.eatenInitPos["x"] - bean.x))
            //     let y = (bean.speed) * Math.sin(Math.atan2(bean.eatenInitPos["y"] - bean.y, bean.eatenInitPos["x"] - bean.x))
            //     bean.x += x
            //     bean.y += y
            //     bean.eatenPos["x"] += x
            //     bean.eatenPos["x"] += y
            //     // console.log(distance(bean.eatenPos["x"], bean.eatenPos["y"], bean.eatenInitPos["x"], bean.eatenInitPos["x"]))
            //     if (distance(bean.x, bean.y, bean.eatenInitPos["x"], bean.eatenInitPos["y"]) < bean.haveEatenDis) {
            //         bean.destroy()
            //         this.beans[key] = undefined
            //         delete this.beans[key]
            //         this.snakeSelf.snakeLength++
            //         this.snakeSelf.eatBean++
            //         this.beanNum--
            //     }
            // } else if (distance(bean.x, bean.y, this.snakeSelf.x, this.snakeSelf.y) <= (this.snakeSelf.width / 2) + 20) {
            //     bean.eatenTarget = this.snakeSelf
            //     bean.eatenInitPos["x"] = this.snakeSelf.x + this.snakeSelf.speed * 10 * Math.cos(this.snakeSelf.rotation * Math.PI / 180)
            //     bean.eatenInitPos["y"] = this.snakeSelf.y + this.snakeSelf.speed * 10 * Math.sin(this.snakeSelf.rotation * Math.PI / 180)
            //     bean.haveEaten = true
            // }
            if (distance(bean.x, bean.y, this.snakeSelf.x, this.snakeSelf.y) <= this.snakeSelf.width / 2) {
                bean.destroy();
                this.beans[key] = undefined;
                delete this.beans[key];
                this.snakeSelf.snakeLength++;
                this.snakeSelf.eatBean++;
                this.beanNum--;
            }
            else if (distance(bean.x, bean.y, this.snakeSelf.x, this.snakeSelf.y) <= (this.snakeSelf.width / 2) + 20) {
                bean.x += (this.snakeSelf.speed + 0.1) * Math.cos(Math.atan2(this.snakeSelf.y - bean.y, this.snakeSelf.x - bean.x));
                bean.y += (this.snakeSelf.speed + 0.1) * Math.sin(Math.atan2(this.snakeSelf.y - bean.y, this.snakeSelf.x - bean.x));
            }
            for (var index = 0; index < this.snakeAIArr.length; index++) {
                var element = this.snakeAIArr[index];
                if (distance(bean.x, bean.y, element.x, element.y) <= element.width / 2) {
                    bean.destroy();
                    this.beans[key] = undefined;
                    delete this.beans[key];
                    element.snakeLength++;
                    element.eatBean++;
                    this.beanNum--;
                }
                else if (distance(bean.x, bean.y, element.x, element.y) <= (element.width / 2) + 20) {
                    bean.x += (bean.speed) * Math.cos(Math.atan2(element.y - bean.y, element.x - bean.x));
                    bean.y += (bean.speed) * Math.sin(Math.atan2(element.y - bean.y, element.x - bean.x));
                }
            }
        }
    };
    //做地图相对移动，以便能让玩家的蛇始终居中
    Game.prototype.mapMove = function () {
        var mapScale = this.snakeSelf.snakeInitSize / this.snakeSelf.snakeSize < 0.7 ? 0.7 : this.snakeSelf.snakeInitSize / this.snakeSelf.snakeSize;
        // this.gameMainUI.map.x = -1 * (this.snakeSelf.x - this.stageW / 2 + this.snakeSelf.width / 2 - this.gameMainUI.map.width / 2) * mapScale
        // this.gameMainUI.map.y = -1 * (this.snakeSelf.y - this.stageH / 2 + this.snakeSelf.height / 2 - this.gameMainUI.map.height / 2) * mapScale
        this.gameMainUI.map.x = -1 * (this.snakeSelf.x + this.snakeSelf.width / 2 - this.gameMainUI.map.width / 2) * mapScale + this.stageW / 2;
        this.gameMainUI.map.y = -1 * (this.snakeSelf.y + this.snakeSelf.height / 2 - this.gameMainUI.map.height / 2) * mapScale + this.stageH / 2;
        this.gameMainUI.map.scale(mapScale, mapScale);
    };
    Game.prototype.addBean = function (beanOrder, x, y, colorNum) {
        var bean = new Bean(x, y, colorNum);
        bean.orderNum = beanOrder;
        this.beans[beanOrder] = bean;
        this.gameMainUI.map.addChild(bean);
        this.beanNum++;
    };
    Game.prototype.addBeanRandom = function () {
        var _this = this;
        this.beanRandomTimer = setInterval(function () {
            if (_this.beanNum < _this.beanMaxNum) {
                for (var index = 0; index < 20; index++) {
                    _this.beanOrder++;
                    _this.addBean(_this.beanOrder);
                }
            }
        }, 100);
    };
    Game.prototype.snakeAIMove = function () {
        for (var index = 0; index < this.snakeAIArr.length; index++) {
            var snakeAI = this.snakeAIArr[index];
            snakeAI.move();
            var hitDis = 90 / snakeAI.speedObj["rotation"] * snakeAI.speed + snakeAI.width / 2;
            var hitPos = { x: 0, y: 0 };
            hitPos["x"] = hitDis * Math.cos(snakeAI.rotation * Math.PI / 180) + snakeAI.x;
            hitPos["y"] = hitDis * Math.sin(snakeAI.rotation * Math.PI / 180) + snakeAI.y;
            var hiten = false;
            //判断是否快碰撞到边界
            if (hitPos["x"] >= this.gameMainUI.map.width - snakeAI.width / 2 || hitPos["x"] <= snakeAI.width / 2
                || hitPos["y"] >= this.gameMainUI.map.height - snakeAI.width / 2 || hitPos["y"] <= snakeAI.width / 2) {
                snakeAI.reverseRotation();
            }
            //判断是否撞倒玩家蛇
            if (distance(hitPos["x"], hitPos["y"], this.snakeSelf.x, this.snakeSelf.y) <= this.snakeSelf.width) {
                snakeAI.reverseRotation();
                hiten = true;
            }
            for (var index_1 = 0; index_1 < this.snakeSelf.bodyArr.length; index_1++) {
                if (hiten)
                    break;
                var element = this.snakeSelf.bodyArr[index_1];
                if (distance(hitPos["x"], hitPos["y"], element.x, element.y) <= element.width) {
                    snakeAI.reverseRotation();
                    hiten = true;
                }
            }
            //判断AI之间是否自己碰撞
            for (var i = 0; i < this.snakeAIArr.length; i++) {
                if (hiten)
                    break;
                var elementSnakeAI = this.snakeAIArr[i];
                if (index == i)
                    continue;
                if (distance(hitPos["x"], hitPos["y"], elementSnakeAI.x, elementSnakeAI.y) <= elementSnakeAI.width) {
                    snakeAI.reverseRotation();
                    hiten = true;
                }
                for (var index_2 = 0; index_2 < elementSnakeAI.bodyArr.length; index_2++) {
                    if (hiten)
                        break;
                    var element = elementSnakeAI.bodyArr[index_2];
                    if (distance(hitPos["x"], hitPos["y"], element.x, element.y) <= element.width) {
                        snakeAI.reverseRotation();
                        hiten = true;
                    }
                }
            }
        }
    };
    Game.prototype.snakeAIRotation = function () {
        var _this = this;
        for (var index = 0; index < this.snakeAIArr.length; index++) {
            this.snakeAIArr[index].targetR = 180 - Math.random() * 360;
            this.snakeAIArr[index].speedNow = Math.random() > 0.9 ? "fast" : "slow";
        }
        setInterval(function () {
            for (var index = 0; index < _this.snakeAIArr.length; index++) {
                _this.snakeAIArr[index].targetR = 180 - Math.random() * 360;
                _this.snakeAIArr[index].speedNow = Math.random() > 0.9 ? "fast" : "slow";
            }
        }, 3000);
    };
    return Game;
}());
//当屏幕大小改变时回调
function onWindowResize() {
    game.stageW = Browser.onQQBrowser ? Browser.width / Browser.pixelRatio : Browser.width / Browser.pixelRatio;
    game.stageH = Browser.onQQBrowser ? Browser.height / Browser.pixelRatio : Browser.height / Browser.pixelRatio;
    Laya.stage.size(game.stageW, game.stageH);
    //屏幕大小改变时发生的改变
    game._onresizeAction();
}
//计算距离
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}
var game = new Game();
//# sourceMappingURL=Game.js.map