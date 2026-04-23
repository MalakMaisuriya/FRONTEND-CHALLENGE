let next = document.querySelector('.next');
let prev = document.querySelector('.prev');

next.onclick = function(){
    let items = document.querySelectorAll('.item');
    document.querySelector('.slide').appendChild(items[0]);
}

prev.onclick = function(){
    let items = document.querySelectorAll('.item');
    document.querySelector('.slide').prepend(items[items.length - 1]);
}

setInterval(() => {
    next.click();
}, 4000);