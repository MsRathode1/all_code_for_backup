document.querySelectorAll('.Inner_div_1').forEach(function (child) {
    child.addEventListener('click', function () {
        this.classList.toggle('expanded');
        console.log("this.parentElement: ", this.parentElement);
        this.parentElement.style.border = "2px solid green"

    });
});