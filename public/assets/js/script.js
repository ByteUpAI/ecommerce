
window.onload = function() {
  new WOW({
      mobile:true,
      live:false
  }).init();
};
// Mobile Menu
  const menuBtn = document.getElementById("menu-btn");
  const closeBtn = document.getElementById("close-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("overlay");

  function openMenu() {
    mobileMenu.classList.remove("-translate-x-full");
    overlay.classList.remove("opacity-0", "invisible");
  }

  function closeMenu() {
    mobileMenu.classList.add("-translate-x-full");
    overlay.classList.add("opacity-0", "invisible");
  }

  menuBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);


// Sub menu script
  document.querySelectorAll(".menu-btn").forEach(button => {
    button.addEventListener("click", () => {
      const submenu = button.nextElementSibling;
      const arrow = button.querySelector(".arrow");

      submenu.classList.toggle("hidden");
      arrow.classList.toggle("rotate-180");
    });
  });

//slider



$(document).ready(function(){
  var hero = $('.hero-slider').owlCarousel({
    items:1,
    loop:true,
    autoplay:true,
    autoplayTimeout:5000,
    smartSpeed:800,
    nav:true,
    dots:false,
    navText:[
      "<div class='w-20 h-20 flex items-center justify-center bg-white text-black text-xl'><i class='fa-solid fa-angle-left'></i></div>",
      "<div class='w-20 h-20 flex items-center justify-center bg-[var(--primary)] text-white text-xl'><i class='fa-solid fa-angle-right'></i></div>"
    ]
  });
    hero.on('translated.owl.carousel', function(e){

      var currentSlide = $(e.target)
          .find('.owl-item.active');

      currentSlide.find('.wow').each(function(){

          var el = $(this);

          /* reset ONLY slider animation */
          el.removeClass(function(index, className){
              return (className.match(/(^|\s)animated\S*/g) || []).join(' ');
          });

          el.css({
              visibility:'hidden',
              animation:'none'
          });

          this.offsetHeight; // reflow

          el.css({
              visibility:'visible',
              animation:''
          });

          el.addClass('animated');

      });

  });
});

if ($('.testimonial-slider').length) {

    $('.testimonial-slider').owlCarousel({
        loop:true,
        margin:20,
        autoplay:false,
        autoplayTimeout:3000,
        dots:false,
        nav:true,
        navText:[
            '<span class="custom-prev"><i class="fa-solid fa-chevron-left"></i></span>',
            '<span class="custom-next"><i class="fa-solid fa-chevron-right"></i></span>'
        ],
        responsive:{
            0:{ items:1 },
            768:{ items:2 },
            1024:{ items:3 }
        }
    });

}
if ($('.related-slider').length) {

    $('.related-slider').owlCarousel({
        loop:true,
        margin:20,
        autoplay:false,
        autoplayTimeout:3000,
        dots:false,
        nav:true,
        navText:[
            '<span class="custom-prev"><i class="fa-solid fa-chevron-left"></i></span>',
            '<span class="custom-next"><i class="fa-solid fa-chevron-right"></i></span>'
        ],
        responsive:{
            0:{ items:1 },
            768:{ items:2 },
            1024:{ items:3 }
        }
    });

}
document.addEventListener("DOMContentLoaded", function () {

    const observer = new IntersectionObserver((entries, observer)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    },{
        threshold: 0.4
    });

    document.querySelectorAll(".reveal-line").forEach(el=>{
        observer.observe(el);
    });

});

document.querySelectorAll('[data-speed]').forEach(el => {

    el.addEventListener('mousemove', function(e){

        const rect = this.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const speed = this.dataset.speed;

        const moveX = (x - centerX) / (20 / speed);
        const moveY = (y - centerY) / (20 / speed);

        this.style.transform =
            `translate(${moveX}px, ${moveY}px)`;
    });

    el.addEventListener('mouseleave', function(){
        this.style.transform = 'translate(0px,0px)';
    });

});
document.querySelectorAll('.counter').forEach(counter => {

    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 1500; // animation time
    const startTime = performance.now();

    function update(currentTime){
        const progress = Math.min((currentTime - startTime) / duration, 1);
        counter.innerText = Math.floor(progress * target);

        if(progress < 1){
            requestAnimationFrame(update);
        } else {
            counter.innerText = target; // exact final value
        }
    }

    requestAnimationFrame(update);
});
document.addEventListener("DOMContentLoaded", function () {

    const items = document.querySelectorAll('.parallax-bg');

    function animate() {

        const scrollTop = window.scrollY;

        items.forEach(el => {

            const sectionTop = el.parentElement.offsetTop;
            const distance = scrollTop - sectionTop;
            const speed = el.dataset.speed || 0.3;

            el.style.transform =
                `translate3d(0, ${distance * speed}px, 0)`;
        });

        requestAnimationFrame(animate);
    }

    animate();

});
function toggleDropdown(button) {

    const dropdown = button.parentElement.querySelector('.dropdown-menu');
    const icon = button.querySelector('i');

    if (dropdown.classList.contains('max-h-0')) {

        dropdown.classList.remove('max-h-0','opacity-0');
        dropdown.classList.add('max-h-96','opacity-100');

        icon.classList.add('rotate-90');

    } else {

        dropdown.classList.add('max-h-0','opacity-0');
        dropdown.classList.remove('max-h-96','opacity-100');

        icon.classList.remove('rotate-90');
    }
}
document.querySelectorAll('.dropdown-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
    });
});
document.addEventListener('DOMContentLoaded', function () {

    const minRange = document.getElementById('minRange');
    const maxRange = document.getElementById('maxRange');
    const range = document.getElementById('range');
    const minVal = document.getElementById('minVal');
    const maxVal = document.getElementById('maxVal');

    // STOP if slider not on this page
    if (!minRange || !maxRange || !range || !minVal || !maxVal) return;

    function formatINR(num){
        return new Intl.NumberFormat('en-IN').format(num);
    }

    function updateSlider(){

        let min = parseInt(minRange.value);
        let max = parseInt(maxRange.value);

        if(min >= max){
            minRange.value = max - 1000;
            min = max - 1000;
        }

        const percentMin = (min / minRange.max) * 100;
        const percentMax = (max / maxRange.max) * 100;

        range.style.left = percentMin + "%";
        range.style.width = (percentMax - percentMin) + "%";

        minVal.textContent = formatINR(min);
        maxVal.textContent = formatINR(max);
    }

    minRange.addEventListener('input', updateSlider);
    maxRange.addEventListener('input', updateSlider);

    updateSlider();

});
// selected text show drop down
document.querySelectorAll('.menu-dropdown').forEach(dropdown => {

    const btn = dropdown.querySelector('.menu-btn');
    const menu = dropdown.querySelector('.menu-list');
    const text = dropdown.querySelector('.selected-text');
    const icon = dropdown.querySelector('i');

    // OPEN DROPDOWN
    btn.addEventListener('click', function(e){
        e.stopPropagation();

        document.querySelectorAll('.menu-list')
            .forEach(m => m.classList.add('hidden'));

        menu.classList.toggle('hidden');
        icon.classList.toggle('rotate-180');
    });

    dropdown.querySelectorAll('.menu-item').forEach(item => {

        item.addEventListener('click', function(e){
            e.preventDefault();

            text.textContent = this.textContent;

            menu.classList.add('hidden');
            icon.classList.remove('rotate-180');
        });

    });

});
// simple drop down
document.addEventListener('click', function(){

    document.querySelectorAll('.menu-list')
        .forEach(menu => menu.classList.add('hidden'));

    document.querySelectorAll('.menu-dropdown i')
        .forEach(icon => icon.classList.remove('rotate-180'));

});

document.addEventListener('DOMContentLoaded', function () {

    const buttons = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    buttons.forEach(function(btn){

        btn.addEventListener('click', function(){

            const target = this.dataset.tab;

            // remove active class
            buttons.forEach(function(b){
                b.classList.remove('active-tab');
            });

            // hide all content
            contents.forEach(function(c){
                c.classList.add('hidden');
            });

            // activate selected tab
            this.classList.add('active-tab');
            document.getElementById(target).classList.remove('hidden');

        });

    });

});
document.addEventListener('DOMContentLoaded', function () {

    const btn = document.querySelector('.add-review-btn');
    const review = document.querySelector('.review-wrapper');

    btn.addEventListener('click', function () {

        btn.classList.toggle('active');

        if (review.style.maxHeight) {
            review.style.maxHeight = null; // close
        } else {
            review.style.maxHeight = review.scrollHeight + "px"; // open
        }

    });

});
document.addEventListener("DOMContentLoaded", function(){

    const thumbs = document.querySelectorAll(".thumb");
    const mainImage = document.getElementById("mainImage");
    const zoomIcon = document.getElementById("zoomIcon");

    let galleryImages = [];

    function buildGallery(){
        galleryImages = [];

        thumbs.forEach(thumb => {
            galleryImages.push({
                src: thumb.dataset.image,
                type: "image",
            });
        });
    }

    buildGallery();

    thumbs.forEach(thumb => {
        thumb.addEventListener("click", function(){
            const newSrc = this.dataset.image;
            mainImage.src = newSrc;
            thumbs.forEach(t =>
                t.classList.remove("border","border-[var(--primary)]")
            );
            this.classList.add("border","border-[var(--primary)]");
        });
    });

    zoomIcon.addEventListener("click", function(){
        Fancybox.show(galleryImages, {
            Thumbs: false,
            Carousel: {
                infinite: true
            },
            Toolbar: {
                display: [
                    "close",
                    "zoom",
                    "fullscreen"
                ]
            }
        });
    });

});
document.addEventListener("DOMContentLoaded", function(){

    const container = document.getElementById("zoomContainer");
    const image = document.getElementById("mainImage");

    if(!container || !image) return;

    container.addEventListener("mousemove", function(e){

        const rect = container.getBoundingClientRect();

        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        image.style.transformOrigin = `${x}% ${y}%`;
        image.style.transform = "scale(2)";
    });

    container.addEventListener("mouseleave", function(){
        image.style.transform = "scale(1)";
        image.style.transformOrigin = "center center";
    });

});
document.addEventListener("DOMContentLoaded", function(){

    const decreaseBtn = document.getElementById("decreaseQty");
    const increaseBtn = document.getElementById("increaseQty");
    const quantityDisplay = document.getElementById("quantityValue");

    let quantity = 1;
    const minQty = 1;
    const maxQty = 50;

    increaseBtn.addEventListener("click", function(){
        if(quantity < maxQty){
            quantity++;
            quantityDisplay.textContent = quantity;
        }
    });

    decreaseBtn.addEventListener("click", function(){
        if(quantity > minQty){
            quantity--;
            quantityDisplay.textContent = quantity;
        }
    });

});
$(document).ready(function(){

    $('.thumb-slider').owlCarousel({
        items:1,          // ⭐ IMPORTANT
        loop:false,
        margin:0,
        nav:false,
        dots:false,
        mouseDrag:true,
        touchDrag:true,
    });

});