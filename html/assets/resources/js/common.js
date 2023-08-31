$(function () {
    $('head').load('../common/head.html');
    $('header').load('../common/header.html');
    $('.location').load('../common/location.html');
    $('footer').load('../common/footer.html');
});

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
    if (scrollTop >= 50) {
        document.querySelector('.header').classList.add('on');
        document.querySelector('.location').classList.add('on');
    } else {
        document.querySelector('.header').classList.remove('on');
        document.querySelector('.location').classList.remove('on');
    }
});
