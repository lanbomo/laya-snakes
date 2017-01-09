/**
 * GameStart extends ui.GameStartUI
 */
class GameStart extends ui.GameStartUI {
    constructor() {
        super()
        this.init()
    }

    init(): void {
        this.nickname.label = "游客" + Math.floor(Math.random() * (9999 - 1 + 1) + 1)
        this.skinRadio.selectedIndex = Math.floor(Math.random() * (4 - 0 + 1) + 0)
        this.neturl.label = "192.168.1.60"
        LocalStorage.getItem("nickname") && (this.nickname.label = LocalStorage.getItem("nickname"))
        LocalStorage.getItem("neturl") && (this.neturl.label = LocalStorage.getItem("neturl"))
        LocalStorage.getItem("skin") && (this.skinRadio.selectedIndex = parseInt(LocalStorage.getItem("skin")))

        this.nickname.on("click", this, this.changeNickName)
        this.neturl.on("click", this, this.changeNetUrl)
        this.skinRadio.on("click", this, this.onSelectSkin)

    }

    changeNickName(): void {
        let nickname = window.prompt("请输入您的昵称！", this.nickname.label)
        if (nickname != null && nickname != "") {
            this.nickname.label = nickname
        } else {
            Browser.window.alert("请输入昵称！")
        }
    }

    changeNetUrl(): void {
        let neturl = window.prompt("请输入服务器地址！", this.neturl.label)
        if (neturl != null && neturl != "") {
            this.neturl.label = neturl
        } else {
            Browser.window.alert("请输入服务器地址！")
        }
    }

    onSelectSkin(): void {
        // Browser.window.alert(this.skinRadio.selectedIndex)
    }
}