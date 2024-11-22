const secondhand = document.querySelector(".second-hand")
const minhand = document.querySelector(".min-hand")
const hourhand = document.querySelector(".hour-hand")
function setdate(params) {
    const now = new Date()
    const seconds = now.getSeconds()
    const secondsdeg = ((seconds/60)*360)+90
    secondhand.style.transform = `rotate(${secondsdeg}deg)`

    const mins = now.getMinutes()
    const minsdeg = ((mins/60)*360)+90
    minhand.style.transform = `rotate(${minsdeg}deg)`

    const hours = now.getHours()
    const hoursdeg = ((hours/12)*360)+90
    hourhand.style.transform = `rotate(${hoursdeg}deg)`
}

setInterval(setdate,1000)