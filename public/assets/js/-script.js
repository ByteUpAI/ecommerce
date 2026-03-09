
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