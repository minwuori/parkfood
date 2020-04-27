
var helper = {
    // Плавный скролл
    smoothScroll: function (target){
        var startY = helper.defineCurrentYPosition();
        var stopY = helper.defineElementYPosition(target);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) {
            speed = 20;
        }
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for (var i = startY; i < stopY; i += step) {
                setTimeout('window.scrollTo(0, ' + leapY+ ')', timer * speed);
                leapY += step;
                if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for (i = startY; i > stopY; i -= step) {
            setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }
    },

    // Определяет исходную позицию
    defineCurrentYPosition: function() {
        return self.pageYOffset;
    },

    // Определяет позицию элемента
    defineElementYPosition: function(target) {
        var y = target.offsetTop;
        var node = target;
        while (node.offsetParent && node.offsetParent != document.body) {
            node = node.offsetParent;
            y += node.offsetTop;
        }
        return y;
    }

};

const map = () => {
    let myMap;

    const init = () => {
        const mapContainer = document.querySelector('#map');

        let dataPlacemark = [[52.77718094227807, 52.25256082601846], [52.83814761662174, 52.23174249927979]];

        myMap = new ymaps.Map(mapContainer, {
            center: [52.77718094227807, 52.25256082601846],
            controls: ['smallMapDefaultSet'],
            zoom: 15
        });

        const myPlacemark = new ymaps.GeoObjectCollection(null, {
            iconLayout: 'default#image'
        });

        for (var i = 0, l = dataPlacemark.length; i < l; i++) {
            myPlacemark.add(new ymaps.Placemark(dataPlacemark[i]));
        }

        myMap.geoObjects.add(myPlacemark);
    };

    return init;
};



document.addEventListener("DOMContentLoaded", function() {

    ymaps.ready(map());

    // найдем все якоря
    const anchors = Array.prototype.slice.call(document.querySelectorAll('a[href*="#"]'));

    anchors.forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            // убираем стандартное поведение
            e.preventDefault();
            // для каждого якоря берем соответствующий ему элемент и определяем его координату Y
            let coordElement = document.querySelector(anchor.getAttribute('href')).getBoundingClientRect().top + window.pageYOffset;
            //скроллим
            $([document.documentElement, document.body]).animate({
                scrollTop: coordElement - 70
            }, 500);
        });
    });

    //scrollToTop
    var scrollToTopElement = $('#back-top');
    $(window).scroll(function() {
        var range = $(this).scrollTop();
        (range > 500) ? scrollToTopElement.fadeIn('1000') : scrollToTopElement.fadeOut('1000');
    });

    scrollToTopElement.on('click', function() {
        $('body,html').animate({
            scrollTop: 0
        }, '600');
    });

    $('.js__slider_banner').slick({
        dots: true,
        autoplay: true,
        autoplaySpeed: 3000,
    });

    $('.js__slider_product').slick(
        {
            infinite: true,
            speed: 300,
            slidesToShow: 4,
            slidesToScroll: 4,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        }
    );

});