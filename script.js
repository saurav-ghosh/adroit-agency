"use strict";

// Elements
const modalOpens = document.querySelectorAll(".btn__open__modal");
const modalClose = document.querySelector(".btn__close__modal");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const menuBtn = document.querySelector(".menu__btn");
const navigation = document.querySelector(".navigation");
const header = document.querySelector("header");
const nav = document.querySelector("nav");
const sections = document.querySelectorAll(".section");
const secService = document.querySelector(".services");
const backToTop = document.querySelector(".backToHome");
const btns = document.querySelectorAll(".slider__btn");
const slides = document.querySelectorAll(".header__slider__image");
const contents = document.querySelectorAll(".Slide__content");
const choseUsBtns = document.querySelector(".choseUs__btns");
const choseBtns = document.querySelectorAll(".choseUs__btn");
const choseUsContents = document.querySelectorAll(".choseUs__content");
const testiSlides = document.querySelectorAll(".testi__slide");
const btnRight = document.querySelector(".testi__slide__btn__left");
const btnLeft = document.querySelector(".testi__slide__btn__right");
const dotContainer = document.querySelector(".dots");

//Modal window
const openModal = () => {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

const closeModal = () => {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

modalOpens.forEach((modalOpen) =>
    modalOpen.addEventListener("click", openModal)
);
modalClose.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// Responsive mobile menu
menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    navigation.classList.toggle("active");
});

navigation.addEventListener("click", () => {
    menuBtn.classList.remove("active");
    navigation.classList.remove("active");
});

//Sticky navigation using intersection observer API
const navHeight = nav.getBoundingClientRect().height;

const observer = function (stickyEl, threshold, rootMargin) {
    const headerObserver = new IntersectionObserver(stickyEl, {
        root: null,
        threshold: threshold,
        rootMargin: `${rootMargin}px`,
    });
    headerObserver.observe(header);
};

const stickyNav = function (entries) {
    const [entry] = entries;

    if (!entry.isIntersecting) nav.classList.add("sticky");
    else nav.classList.remove("sticky");
};
observer(stickyNav, 1, navHeight);

//Back to top button
const stickyBtn = (entries) => {
    const [entry] = entries;

    if (!entry.isIntersecting) backToTop.classList.remove("hidden");
    else backToTop.classList.add("hidden");
};
observer(stickyBtn, 1, 22);

backToTop.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector("#header").scrollIntoView({ behavior: "smooth" });
});

//Reveal sections with animation
const revealSection = (entries, observer) => {
    const [entry] = entries;

    if (!entry.isIntersecting) return;
    entry.target.classList.remove("section__hidden");
    observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});

sections.forEach((section) => {
    sectionObserver.observe(section);
    section.classList.add("section__hidden");
});

//Page navigation with smooth scrolling using event delegation
document
    .querySelector(".navigation__items")
    .addEventListener("click", function (e) {
        e.preventDefault();

        // Matching strategy
        if (e.target.classList.contains("nav__link")) {
            const id = e.target.getAttribute("href");
            document.querySelector(id).scrollIntoView({ behavior: "smooth" });
        }
    });

//Header slider
const slide = (curr) => {
    btns.forEach((btn) => btn.classList.remove("active"));
    slides.forEach((slide) => slide.classList.remove("active"));
    contents.forEach((content) => content.classList.remove("active"));

    btns[curr].classList.add("active");
    slides[curr].classList.add("active");
    contents[curr].classList.add("active");
};

btns.forEach((btn, i) => {
    btn.addEventListener("click", function () {
        slide(i);
    });
});

//Chose us button component
choseUsBtns.addEventListener("click", function (e) {
    const clicked = e.target.closest(".choseUs__btn");

    if (!clicked) return;

    //Remove active class
    choseBtns.forEach((btn) => btn.classList.remove("active"));
    choseUsContents.forEach((content) => content.classList.remove("active"));

    //Activate button
    clicked.classList.add("active");

    //Activate content
    document
        .querySelector(`.choseUs__content__${clicked.dataset.btn}`)
        .classList.add("active");
});

//Testimonial slider
const testiSlider = function () {
    let currentSlide = 0;
    const maxSlide = testiSlides.length;

    const createDots = function () {
        testiSlides.forEach((_, i) => {
            dotContainer.insertAdjacentHTML(
                "beforeend",
                `<button class="dots__dot" data-slide=${i}></button>`
            );
        });
    };

    const activateDot = function (slide) {
        document
            .querySelectorAll(".dots__dot")
            .forEach((dot) => dot.classList.remove("dots__dot__active"));

        document
            .querySelector(`.dots__dot[data-slide="${slide}"]`)
            .classList.add("dots__dot__active");
    };

    const goToSlide = function (slide) {
        testiSlides.forEach((s, i) => {
            s.style.transform = `translateX(${100 * (i - slide)}%)`;
        });
    };

    const init = () => {
        goToSlide(0);
        createDots();

        activateDot(0);
    };
    init();

    //Show the next slider
    const nextSlide = function () {
        if (currentSlide === maxSlide - 1) {
            currentSlide = 0;
        } else {
            currentSlide++;
        }

        goToSlide(currentSlide);
        activateDot(currentSlide);
    };

    //Show the previous slider
    const prevSlide = function () {
        if (currentSlide === 0) {
            currentSlide = maxSlide - 1;
        } else {
            currentSlide--;
        }

        goToSlide(currentSlide);
        activateDot(currentSlide);
    };

    btnRight.addEventListener("click", nextSlide);
    btnLeft.addEventListener("click", prevSlide);

    dotContainer.addEventListener("click", function (e) {
        if (e.target.classList.contains("dots__dot")) {
            const { slide } = e.target.dataset;
            goToSlide(slide);
            activateDot(slide);
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") nextSlide();
        if (e.key === "ArrowLeft") prevSlide();
    });
};
testiSlider();
