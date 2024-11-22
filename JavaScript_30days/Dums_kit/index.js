window.addEventListener("keydown", function (e) {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`)
    const key = document.querySelector(`.key[data-key="${e.keyCode}"]`)
    if (!audio || !key) return
    audio.currentTime = 0
    audio.play()
    console.log("audio: ", audio);
    key.classList.add("playing")
})


function removeTrans(e) {
    if (e.propertyName !== "transform") return
    this.classList.remove("playing")
}

const keys = document.querySelectorAll(".key")
keys.forEach(el => el.addEventListener("transitionend", removeTrans))

