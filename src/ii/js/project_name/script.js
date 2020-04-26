
var helper = {
    // Плавный скролл
    smoothScroll: function (target){
        var startY = alphabet.defineCurrentYPosition();
        var stopY = alphabet.defineElementYPosition(target);
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
        const lat = 52.83814761662174;
        const lng = 52.23174249927979;

        let data = {
            coords: [lat, lng]
        };

        myMap = new ymaps.Map(mapContainer, {
            center: data.coords,
            controls: [],
            zoom: 16
        });

        const myPlacemark = (new ymaps.Placemark(data.coords, data, {
            //balloonContentLayout: BalloonContentLayout,
            balloonPanelMaxMapArea: 0,
            iconLayout: 'default#image',
            //hintContent: 'Хинт метки',
            iconImageSize: [41, 50],
            iconImageOffset: [-10, -50],
            //iconImageHref: '../img/map/chg-pin.png'
        }));


        myMap.geoObjects.add(myPlacemark);

        /*myMap.controls.add('zoomControl', {
            size: 'large',
            position: {
                right: 15,
                left: 'auto',
                top: 120
            }
        });*/
    };

    return init;
};



document.addEventListener("DOMContentLoaded", function() {

    ymaps.ready(map());

    // найдем все якоря
    const anchors = Array.prototype.slice.call(document.querySelectorAll('a[href*="#"]'));
    // устанавливаем время анимации и количество кадров
    const framesCount = 10;
    const animationTime = 1000;

    anchors.forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            // убираем стандартное поведение
            e.preventDefault();
            // для каждого якоря берем соответствующий ему элемент и определяем его координату Y
            let coordY = document.querySelector(anchor.getAttribute('href')).getBoundingClientRect().top + window.pageYOffset;

            // запускаем интервал, в котором
            let scroller = setInterval(function() {
                // считаем на сколько скроллить за 1 такт
                let scrollBy = coordY / framesCount;

                // если к-во пикселей для скролла за 1 такт больше расстояния до элемента
                // и дно страницы не достигнуто
                if(scrollBy > window.pageYOffset - coordY && window.innerHeight + window.pageYOffset < document.body.offsetHeight) {
                    // то скроллим на к-во пикселей, которое соответствует одному такту
                    window.scrollBy(0, scrollBy);
                } else {
                    // иначе добираемся до элемента и выходим из интервала
                    window.scrollTo(0, coordY);
                    clearInterval(scroller);
                }
                // время интервала равняется частному от времени анимации и к-ва кадров
            }, animationTime / framesCount);

        });

    });


    $('.js__slider_banner').slick();
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