$('.tab-select')[0].classList.toggle('active');

$('.tab-select').on('click', function(e) {
    $('.tab-select').map((i, el) => {
        if (el === this) {
            el.classList && el.classList.add('active');
        } else {
            el.classList && el.classList.remove('active');
        }
    })
})