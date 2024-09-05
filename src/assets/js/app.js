document.addEventListener("DOMContentLoaded", () => {

  const xl = matchMedia('(max-width: 1024px)');

  class Menu {
    constructor(menuElement, buttonElement) {
      this.menu = typeof menuElement === "string" ? document.querySelector(menuElement) : menuElement;
      this.button = typeof buttonElement === "string" ? document.querySelector(buttonElement) : buttonElement;
      this.overlay = document.createElement('div');
      this.overlay.hidden = true;
      this._init();
    }

    _init() {
      document.body.appendChild(this.overlay);
      this.overlay.classList.add('overlay');

      this.overlay.addEventListener('click', this.toggleMenu.bind(this));
      this.button.addEventListener('click', this.toggleMenu.bind(this));
    }

    toggleMenu() {
      this.menu.classList.toggle('menu--open');
      this.button.classList.toggle('menu-button--active');
      this.overlay.hidden = !this.overlay.hidden;

      if (this.isMenuOpen()) {
        this.disableScroll();
      } else {
        this.enableScroll();
      }
    }

    closeMenu() {
      this.menu.classList.remove('header__nav--active');
      this.button.classList.remove('header__menu-button--active');
      this.overlay.hidden = true;

      this.enableScroll();
    }

    isMenuOpen() {
      return this.menu.classList.contains('menu--open');
    }

    disableScroll() {
      // Get the current page scroll position;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      // if any scroll is attempted, set this to the previous value;
      window.onscroll = function () {
        window.scrollTo(scrollLeft, scrollTop);
      };
    }

    enableScroll() {
      window.onscroll = function () { };
    }
  }

  const menu = document.querySelector('.menu');
  const menuButton = document.querySelector('.menu-button');

  if (menu && menuButton) {
    new Menu(menu, menuButton);
  }

  const header = document.querySelector('header');

  let handler;

  function scrollAdd() {
    /* ... */
    handler = throttle(function (event) {
      scrollHeader();
    }, 500);
    document.addEventListener('scroll', handler, false);
  }

  function scrollRemove() {
    /* ... */
    document.removeEventListener('scroll', handler, false);
  }

  if (xl.matches) {
    scrollAdd();
    document.removeEventListener('scroll', scrollHeader);
  } else {
    document.addEventListener('scroll', scrollHeader);
    scrollRemove();
  }

  xl.addEventListener('change', () => {
    if (xl.matches) {
      document.removeEventListener('scroll', scrollHeader);
      scrollAdd();
    } else {
      document.addEventListener('scroll', scrollHeader);
      scrollRemove();
    }
  });

  function disableScroll() {
    // Get the current page scroll position;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    document.documentElement.style.setProperty('scroll-behavior', 'auto');

    // if any scroll is attempted, set this to the previous value;
    window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

  function enableScroll() {
    document.documentElement.style.setProperty('scroll-behavior', null);
    window.onscroll = function () { };
  }

  var prevScrollpos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  function scrollHeader() {
    var currentScrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScrollPos < 0) {
      currentScrollPos = 0;
      prevScrollpos = 0;
    };
    if (prevScrollpos < 0) {
      prevScrollpos = 0;
      currentScrollPos = 0;
    };
    const num = xl.matches ? 50 : 150;
    if (currentScrollPos > num) {
      header.classList.add('header--active');
    } else {
      header.classList.remove('header--active');
    };
    if (prevScrollpos >= currentScrollPos) {
      header.classList.remove('out');
    } else {
      header.classList.add('out');
    };
    prevScrollpos = currentScrollPos;
  };

  function initHeader() {
    var currentScrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    const num = xl.matches ? 50 : 150;
    if (currentScrollPos > num) {
      header.classList.add('header--active');
    } else {
      header.classList.remove('header--active');
    }
  }

  initHeader();

  function throttle(func, ms) {
    let isThrottled = false,
      savedArgs,
      savedThis;

    function wrapper() {

      if (isThrottled) { // (2);
        savedArgs = arguments;
        savedThis = this;
        return;
      }

      func.apply(this, arguments); // (1);

      isThrottled = true;

      setTimeout(function () {
        isThrottled = false; // (3);
        if (savedArgs) {
          wrapper.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
        }
      }, ms);
    }

    return wrapper;
  }

  const mainswipers = document.querySelectorAll('.main-wrapper')
  if (mainswipers.length) {
    mainswipers.forEach(wrapper => {
      const swiper = wrapper.querySelector('.main-swiper')

      if (swiper) {
        const pagination = wrapper.querySelector('.main-pagination-content')
        const slides = swiper.querySelectorAll('.swiper-slide')
        let main = null;
        if (slides.length) {
          slides.forEach((_, i) => {
            const bullet = document.createElement('div')
            bullet.classList.add('main-bullet')
            bullet.addEventListener('click', function () {
              if (main) {
                main.slideTo(+i, 700)
              }
            })
            bullet.innerHTML = `<div class="ball"></div><div class="main-bullet-text">${pad(+i + 1, 2)}</div>`
            pagination.appendChild(bullet)
          })
        }
        pagination.style.setProperty('--lineheight', window.getComputedStyle(pagination, ':before').height)
        pagination.style.setProperty('--percent', 0)
        const nextEl = wrapper.querySelector('.next')
        const prevEl = wrapper.querySelector('.prev')
        let previousSlide = 0;
        main = new Swiper(swiper, {
          rewind: true,
          speed: 700,
          // autoplay: {
          //   delay: 3000,
          // },
          navigation: {
            nextEl,
            prevEl,
          },
          on: {
            init: function (swiper) {
              if (pagination) {
                for (let i = 0; i < pagination.children.length; i++) {
                  pagination.children[i].classList.remove('active')
                }
                pagination.children[swiper.activeIndex].classList.add('active')
              }
            },
            slideChange: function (swiper) {
              if (pagination) {
                for (let i = 0; i < pagination.children.length; i++) {
                  pagination.children[i].classList.remove('active')
                  if (swiper.activeIndex === 0) {
                    pagination.children[i].classList.remove('reversed')
                  }
                }

                if (previousSlide > swiper.activeIndex) {
                  pagination.children[swiper.activeIndex].classList.add('reversed')
                  pagination.children[previousSlide].classList.remove('reversed')
                } else {
                  for (let i = 0; i < pagination.children.length; i++) {
                    if (i <= swiper.activeIndex) {
                      pagination.children[i].classList.add('reversed')
                    }
                  }
                }
                pagination.style.setProperty('--percent', swiper.activeIndex / (pagination.children.length - 1) * 100)
                pagination.children[swiper.activeIndex].classList.add('active')
                previousSlide = swiper.activeIndex
              }
            }
          }
        })
      }
    })
  }

  function pad(num, size) {
    var s = "000000000" + num;
    return s.slice(s.length - size);
  }

  const kgtTab = document.querySelectorAll('.mcatalog-tabs');
  if (kgtTab.length) {
    kgtTab.forEach((el, ind) => {
      const content = el.nextElementSibling;
      if (content) {
        const buttons = el.querySelectorAll('.mcatalog-btn');
        if (buttons.length) {
          buttons.forEach((btn, i) => {
            btn.dataset.id = ind + i;
            btn.addEventListener('click', function () {
              const next = this.nextElementSibling;
              if (next) {
                if (content.dataset.foreign !== undefined) {
                  const button = document.querySelector(`.mcatalog-btn[data-id="${content.dataset.foreign}"]`);
                  if (button) {
                    const foreignNext = button.nextElementSibling;
                    if (foreignNext) {
                      foreignNext.append(...content.children)
                    }
                  }
                }
                content.dataset.foreign = this.dataset.id;

                content.append(...next.children)

                buttons.forEach(button => {
                  button.classList.remove('active');
                })
                this.classList.add('active');

              }
            })
          })
        }

        buttons[0].click()
      }
    })
  }

  const buttons = document.querySelectorAll('.mcatalog-button, .sozh-button')
  if (buttons.length) {
    buttons.forEach(el => {
      el.addEventListener('click', function () {
        this.classList.toggle('opened')
        const sozh = this.closest('.sozh-item')
        if (sozh) {
          sozh.classList.toggle('opened')
        }
      })
    })
  }

  const sozhtabs = document.querySelectorAll('.sozh-tabs')
  if (sozhtabs.length) {
    sozhtabs.forEach(tab => {
      const content = tab.nextElementSibling
      const btns = tab.querySelectorAll('.sozh-btn')
      if (btns.length && content) {
        btns.forEach(el => {
          el.addEventListener('click', function () {
            const next = this.nextElementSibling
            if (next) {
              content.innerHTML = next.innerHTML
              btns.forEach(el => el.classList.remove('active'))
              this.classList.add('active')
            }
          })
        })

        btns[0].click();
      }
    })
  }

  const callback = (entries) => {

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('loaded')
      } else {
      }
    })

  };

  const observer = new IntersectionObserver(callback, { rootMargin: '-50px' });

  setTimeout(() => {
    const target = document.querySelectorAll('[data-animonscroll]');
    if (target.length) {
      target.forEach(el => {
        if (xl.matches) {
          el.classList.add('loaded')
        } else {
          observer.observe(el);
        }
      })
    }
  }, 0)
});


const footerRulesElement = document.querySelector('.footer-rules');

if (footerRulesElement) {
  const currentYear = new Date().getFullYear();
  footerRulesElement.innerHTML = footerRulesElement.innerHTML.replace(/\d{4}/, currentYear);
}



const productSwiper = document.querySelector('.image-product-swiper');
if (productSwiper) {
  const swiperInstance = new Swiper('.image-product-swiper', {
    slidesPerView: 3,
    spaceBetween: 20,
    navigation: {
      nextEl: '.product-swiper-next',
      prevEl: '.product-swiper-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
  });
}

const AlternativeProductSwiper = document.querySelector('.alternative-product-swiper');
if (productSwiper) {
  const swiperInstance = new Swiper('.alternative-product-swiper', {
    slidesPerView: 3,
    spaceBetween: 20,
    navigation: {
      nextEl: '.alternative-product-swiper-next',
      prevEl: '.alternative-product-swiper-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
  });
}





