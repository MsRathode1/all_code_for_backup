function openAccordion(ele) { 
    if (ele.target.nextSibling.nextElementSibling.classList.contains("active")) {
        ele.target.nextSibling.nextElementSibling.classList.remove("active")
    } else {
        ele.target.nextSibling.nextElementSibling.classList.add("active")
    }
}

