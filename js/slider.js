'use strict';

///////////////////////////////////////
// Slider
var slider = function slider() {
  var slides = document.querySelectorAll('.slide');
  var btnLeft = document.querySelector('.slider__btn--left');
  var btnRight = document.querySelector('.slider__btn--right');
  var dotContainer = document.querySelector('.dots');

  var curSlide = 0;
  var maxSlide = slides.length;

  // Functions
  var createDots = function createDots() {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML('beforeend', '<button class="dots__dot" data-slide="' + i + '"></button>');
    });
  };

  var activateDot = function activateDot(slide) {
    document.querySelectorAll('.dots__dot').forEach(function (dot) {
      return dot.classList.remove('dots__dot--active');
    });

    document.querySelector('.dots__dot[data-slide="' + slide + '"]').classList.add('dots__dot--active');
  };

  var goToSlide = function goToSlide(slide) {
    slides.forEach(function (s, i) {
      return s.style.transform = 'translateX(' + 100 * (i - slide) + '%)';
    });
  };

  // Next slide
  var nextSlide = function nextSlide() {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  var prevSlide = function prevSlide() {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  var init = function init() {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      var slide = e.target.dataset.slide;

      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();