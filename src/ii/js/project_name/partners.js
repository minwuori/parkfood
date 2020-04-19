// - добавление партнеров
// - вызов по событиям
// - оповещение добавленных партнеров
var partners = {
    events: {
        // просмотры страниц
        page: {
            // главная
            // actionpay, criteo
            home: 'partners.events.page.home',
            // карточка товара ++
            // actionPay, расширенная коммерция, criteo
            // - product{id, name, price}
            // - category{id, name}
            product: 'partners.events.page.product',
            // страницы каталога, категории +
            // actionPay, criteo
            // - category{id, name, items}
            // - items - массив - айдишки трех первых товаров для criteo, если можно
            catalog: 'partners.events.page.catalog',
            // корзина ++
            // actionPay, расширенная коммерция (1 шаг оформления заказа), criteo
            // - products[ {id,name,price,quantity} ]
            basket: 'partners.events.page.basket',
            // оформление заказа +
            // actionPay, criteo (как просмотр корзины)
            // - products[ {id,name,price,quantity} ]
            order: 'partners.events.page.order',
            // спасибо за заказ +
            // ecommerce (6 шаг оформления заказа)
            // может вызываться многократно при рефреше страницы
            // - products[ {id,name,price,quantity} ]
            thankYou: 'partners.events.page.thankYou',
            // Хотите у нас работать - Анкета
            anketa: 'partners.events.page.anketa',
            // Страница поиска
            search: 'partners.events.page.search',
            // любая другая страница
            // если конкретную страницу не надо считать информационной передавайте параметр { not_inform: true }
            other: 'partners.events.page.other'
        },
        // события корзины
        basket: {
            // добавление в корзину
            // actionpay, расширенная коммерция
            // - product{id, name, price, quantity}
            add: 'partners.events.basket.add',
            // удаление из корзины ++
            // actionpay, расширенная коммерция
            // - product{id, name, price, quantity}
            remove: 'partners.events.basket.remove',
            // добавление в закладки
            // actionpay
            // - product{id, name, price}
            bookmarkAdd: 'partners.events.basket.bookmarkAdd',
            // удаление из закладок
            // actionpay
            // - product{id, name, price}
            bookmarkRemove: 'partners.events.basket.bookmarkRemove'
        },
        // оформление заказа
        order: {
            // введение контактных данных
            // 2 шаг оформления расширенной коммерции
            // - option: a - Физ. лицо, b - Юр. лицо
            // - products [ {id, name, price, quantity} ]
            contacts: 'partners.events.order.contacts',
            // выбор способа доставки
            // 3 шаг оформления расширенной коммерции
            // - option: a - Самовывоз, b- Курьер, c - Почта
            // - products [ {id, name, price, quantity} ]
            deliveryType: 'partners.events.order.deliveryType',
            // выбор способа оплаты
            // 4 шаг оформления  расширенной коммерции
            // - option: a - При получении, b - онлайн, c - счет
            // - products [ {id, name, price, quantity} ]
            paymentType: 'partners.events.order.paymentType',
            // подтверждение
            // 5 шаг оформления расширенной коммерции
            confirm: 'partners.events.order.confirm',
            // показ страницы Спасибо за заказ
            // факт совершенной покупки
            // только один раз!!
            // actionpay, ecommerce, criteo
            // - orderData {id, totalPrice, revenue, shipping, coupon, deduplication}
            // - products [ {id, name, price, quantity} ]
            // - deduplication - 1 - покупка Criteo, 0 - нет
            purchase: 'partners.events.order.purchase',
            // полная отмена заказа
            // из личного кабинета
            // расширенная коммерция
            fullRefund: 'partners.events.order.fullRefund'
        },
        // Поиск
        search: 'partners.events.search',
        // просмотры товаров и баннеров (динамические)
        impression: {
            products: 'partners.events.impression.products',
            promo: 'partners.events.impression.promo'
        },
        // клики по товарам и баннерам
        click: {
            products: 'partners.events.click.products',
            promo: 'partners.events.click.promo'
        },
        // мне нравится - на карточке товара
        share: 'partners.events.share',
        // события пользователя
        user: {
            registration: 'partners.events.user.registration'
        }
    },

    // активность партнеров
    status: {},

    // колбеки для каждого события
    observers: {
        init: []
    },

    // данные по событиям
    data: {},

    // добавление партнера
    addPartner: function(partner) {
        if (!partner.name){
            return;
        }

        //Установим статус партнера в списке партнеров
        partners.status[partner.name] = true;

        // подписать на событие init если у партнера есть функция для этого события
        if(partner.init){
            partners.observers.init.push(partner.init);
        }

        if (!partner.partnersEvents || !partner.partnersEvents.length){//Если партнер не имее тсобытий, то не переходим к этапу инициализации
            return;
        }

        //Добавим функции для выполнения при соответствующих событиях
        partner.partnersEvents.forEach(function(event) {
            partners.observers[event] = partners.observers[event] || [];
            if(partner.hasOwnProperty(event) && {}.toString.call(partner[event]) === '[object Function]'){//Если есть свйоство и оно является функцией, то добавим
                partners.observers[event].push(partner[event]);
            }
        });
    },

    // оповещение партнеров, подписанных на событие eventName
    notify: function(eventName) {

        // получить всех подписчиков на событие eventName
        var observers = partners.observers[eventName];

        if (!observers || !observers.length) return;

        // задержка выполнения функции - реакции на событие
        var delay = 200;

        observers.forEach(function(observeFunction) {
            // вызвать метод с таким же названием у партнера
            setTimeout(function (){
                observeFunction();
            }, delay);

            //Увеличим время задержки
            delay += 30;
        });
    },

    // вызов события eventName
    trigger: function(eventName, data) {
        partners.data[eventName] = data;
        partners.notify(eventName);
    }

};

partners.dynamic = {
    selectors: {
        productCard: '.js_product, .js-analytics-product-page, .js__basket_item, .js__order-product, .js-analytic-product',
        promoView: '.js-analytic-promo',
        promoClick: '.js-analytic-promolink',
        productView: '.js_product, .js-analytic-product',
        productPage: '.js-analytic-product-page',
        productClick: '.js-analytic-productlink',
        promoHideAttr: 'data-promo-hide',
        orderRefund: '.js-analytic-refundorder',
        categoryId: '.js__category_id',
        recommendSlider: '.js__slider[data-code="recommends"]'
    },

    screen: {
        width: $(window).width(),
        height: $(window).height()
    },

    promo: [], // массив всех рекламных баннеров на странице

    products: [], // массив всех продуктов на странице

    categories: [], // массив состоящий из всех уникальных категорий на странице

    monitor: function() { // отслеживать ресайз окна
        $(window).resize(function() {
            partners.dynamic.screen.width = $(window).width();
            partners.dynamic.screen.height = $(window).height();
        });
    },

    isVisible: function(el) { // видим ли элемент
        if (el.style.display === "none" || el.style.visibility === "hidden") return false;

        var elCoords = el.getBoundingClientRect(); // координаты элемента относительно вьюпорта

        var elLeft = elCoords.left;
        var elRight = elLeft + elCoords.width;

        var elTop = elCoords.top;
        var elBottom = elTop + elCoords.height;

        var screenWidth = partners.dynamic.screen.width;
        var screenHeight = partners.dynamic.screen.height;

        // верх элемента выше низа экрана
        // низ элемента ниже верха экрана
        // левый край элемента правее правого края экрана
        // правый край элемент левее левого края экрана
        return elBottom > 0 && elTop <= screenHeight && elLeft < screenWidth && elRight > 0;
    },

    isSubmited: function (el){//Подтверждена ли форма
        return !!el.prop('submited');
    },

    setSubmited: function (el){//Сделать форму подтвержденной
        el.prop('submited', true);
    },

    submitForm: function (form){//Подтверждение формы
        form.submit();
    },

    fetch: function() { // собрать все рекламные баннеры и продукты
        var promo = document.querySelectorAll(partners.dynamic.selectors.promoView);
        this.promo = [];
        for (var i = 0, count = promo.length; i < count; i++) {
            if (promo[i].hasAttribute(this.selectors.promoHideAttr)) continue;
            this.promo.push(promo[i]);
        }

        var products = Array.prototype.slice.call(document.querySelectorAll(partners.dynamic.selectors.productView)).filter(function (product) {
            //оставим только товары с валидными идентификаторами и  укоторых нет атрибута data-disabled-productcard
            var idNumber = Number(product.dataset.product);

            return !isNaN(idNumber) && isFinite(idNumber) && !product.hasAttribute('data-disabled-productcard');
        });

        this.products = products;

        if(products.length > 0){//Если на странице есть товары
            //Отдельно сохраним список продуктов для Пикселя, так как список меняется в дальнейшем, а пикселю это не нужно
            partnersData.vkPixel.products = products;

            //Получим слайдер с рекомендациями
            var recommendsSlider = document.querySelector(partners.dynamic.selectors.recommendSlider);

            if(recommendsSlider){//Если есть слайдер, то получим товары внутри него
                partnersData.vkPixel.recommendSliderProducts = Array.prototype.slice.call(recommendsSlider.querySelectorAll(partners.dynamic.selectors.productView));
            }

            var categoryIdElement = document.querySelector(partners.dynamic.selectors.categoryId);
            if(categoryIdElement && categoryIdElement.dataset.categoryId){
                this.categories.push(categoryIdElement.dataset.categoryId);
            }
        }
    },

    checkItems: function(items) { // проверить видимость
        var checkedItems = {
            hidden: [],
            shown: []
        };

        for(var i = 0, len = items.length; i < len; i++){
            if (items[i].shown){
                return;
            }
            var visible = false;

            // если карточка в слайдере
            if (items[i].hasAttribute('data-slider-item')) {
                // dom-элемент слайдера
                var $slider = items[i].closest('[data-xslider]');

                // если слайдер видим, ничего не делать
                if (partners.dynamic.isVisible($slider)) {

                    var slider = $slider.slider;
                    // если элемент видим в слайдере
                    if (slider.isSlideVisible(items[i])) {
                        // если сам элемент видим на экране
                        if (partners.dynamic.isVisible(items[i])) visible = true;
                    }
                }
            } else if (items[i].hasAttribute('data-main-slider-item')) {
                // если главный слайдер виден
                if (partners.dynamic.isVisible(document.querySelector('.slider-main'))) {
                    visible = document.querySelector('.slider-main__viewport').children[0] === items[i];
                }
            } else {
                if (partners.dynamic.isVisible(items[i])){
                    visible = true;
                }
            }

            if (visible) {
                items[i].shown = true;
                checkedItems.shown.push(items[i]);
            } else {
                checkedItems.hidden.push(items[i]);
            }
        }

        return checkedItems;
    },

    updateItems: function(items) {
        var updatedItems = {
            hidden: [],
            shown: []
        };

        items.forEach(function(item) {
            if (!item.shown) updatedItems.hidden.push(item);
            else updatedItems.shown.push(item);
        });

        return updatedItems;
    },

    checkProducts: function() {
        var items = this.checkItems(this.products);
        this.products = items.hidden;
        var products = this.formatProducts(items.shown);
        if (items.shown.length){
            partners.trigger(partners.events.impression.products, products);
        }
    },

    checkPromo: function() {
        var items = this.checkItems(this.promo);

        this.promo = items.hidden;
        var promo = this.formatPromo(items.shown);
        if (items.shown.length){
            partners.trigger(partners.events.impression.promo, promo);
        }
    },

    updateProducts: function() {
        var items = this.updateItems(this.products);

        this.products = items.hidden;
        var products = this.formatProducts(items.shown);
        if (items.shown.length){
            partners.trigger(partners.events.impression.products, products);
        }
    },

    updatePromo: function() {
        var items = this.updateItems(this.promo);

        this.promo = items.hidden;
        var promo = this.formatPromo(items.shown);
        if (items.shown.length){
            partners.trigger(partners.events.impression.promo, promo);
        }
    },

    formatProducts: function(els) {
        var products = [];
        els.forEach(function(el) {
            var title = el.querySelector('.js-analytic-product-title') || el.querySelector('[data-name]');

            var data = {
                'name': title ? title.textContent.trim() : '',
                'id': el.dataset.product,
                'price': el.dataset.productprice,
                'old_price': el.dataset.oldproductprice ? el.dataset.oldproductprice : '',
                'brand': el.dataset.productbrand,
                'category': el.dataset.productcategory,
                'list': el.dataset.productlist,
                'position': parseInt(el.dataset.index)
            };
            products.push(data);
        });
        return products;
    },

    formatPromo: function(els) {
        var promo = [];

        els.forEach(function(el) {
            var position = parseInt(el.dataset.index) + 1;
            var name = el.dataset.promogroup;
            var data = {
                'id': name + '_' + position,
                'name': name,
                'creative': el.dataset.promoname,
                'position': position
            };
            promo.push(data);
        });
        return promo;
    },

    getProductCard: function(el) {
        if(!el) return false;
        return el.closest(partners.dynamic.selectors.productCard);
    },

    init: function() {
        var self = this;
        // отслеживать события браузера
        this.monitor();

        // cобрать баннеры и продукты
        this.fetch();

        // собрать и отправить видимые продукты
        this.checkProducts();
        // собрать и отправить видимые промо
        this.checkPromo();

        // прокрутка слайдера
        $(document).on('xslider.events.slideEnd', function(e) {
            var $slider = e.target;
            var items = $slider.slider.getVisibleItems();
            items.forEach(function(item) {
                if (item.shown) return;
                if (partners.dynamic.isVisible(item)) item.shown = true;
            });
            partners.dynamic.updateProducts();
        });

        // прокрутка главного слайдера
        $(document).on('mainSlider.slide', function(e, slide) {
            if (slide.shown) return;
            if (!partners.dynamic.isVisible(slide)) return;
            slide.shown = true;
            partners.dynamic.updatePromo();
        });

        $('[data-orbit]').on('slidechange.zf.orbit', function (e){
            var self = this;
            setTimeout(function (){
                var visibleItem = $(self).find('.main-banner-slide.is-active')[0];

                if(!visibleItem){
                    return;
                }

                if (visibleItem.shown){
                    return;
                }

                if (!partners.dynamic.isVisible(visibleItem)){
                    return;
                }

                visibleItem.shown = true;
                partners.dynamic.updatePromo();
            }, 700);
        });

        // прокрутка страницы
        $(document).on('scroll', function() {
            partners.dynamic.checkProducts();
            partners.dynamic.checkPromo();
        });

        // прокрутка страницы
        $(window).on('resize', function() {
            partners.dynamic.checkProducts();
            partners.dynamic.checkPromo();
        });

        // открытие попапов верхнего меню
        $(document).on('catalogMenu.showPopup', function(e, el) {
            if (!el) return;
            var banner = el.querySelector('.catalog__banner');
            if (!banner) return;
            if (banner.checked) return;
            banner.checked = true;
            var promo = partners.dynamic.formatPromo([banner]);
            partners.trigger(partners.events.impression.promo, promo)
        });

        // отмена заказа
        $(document).on('submit', partners.dynamic.selectors.orderRefund, function(e) {

            var form = $(this);
            if (!partners.dynamic.isSubmited(form)) {
                partners.dynamic.setSubmited(form);
                e.preventDefault();
                var orderId = form.find('input[name="id"]').val();
                partners.trigger(partners.events.order.fullRefund, { orderId: orderId, form: form, callback: function (){ partners.dynamic.submitForm(form) } } );
            }
        });


        $(document)
            .on('click', partners.dynamic.selectors.promoClick, function(e) {
                e.stopPropagation();
                var promoBlock = e.target.closest(partners.dynamic.selectors.promoView);
                if (!promoBlock) {
                    return;
                }
                var promo = partners.dynamic.formatPromo([promoBlock]);
                partners.trigger(partners.events.click.promo, promo);
            })
            .on('click', partners.dynamic.selectors.productClick, function(e) {
                e.stopPropagation();
                var productBlock = partners.dynamic.getProductCard(e.target);
                if (!productBlock) {
                    return;
                }
                var products = partners.dynamic.formatProducts([productBlock]);
                partners.trigger(partners.events.click.products, products);
            })
    }
};

// - просто коллекция партнеров
// - у каждого своя структура
// - name - имя партнера
// - partnersEvents - события, на которые он подписывается
// - события вида partners.events.basket.add
// - данные лежат в partners.data[partners.events.basket.add]
var partnersData = {};

/* ActionPay */
partnersData.actionpay = {
    name: "actionpay",
    partnersEvents: [
        partners.events.basket.add,
        partners.events.basket.remove
        //partners.events.basket.bookmarkAdd,
        //partners.events.basket.bookmarkRemove,
        //partners.events.order.purchase,
        //partners.events.share
    ],

    pageTypes: {
        "other": 0,
        "main": 1,
        "productDetails": 2,
        "catalog": 3,
        "basket": 4,
        "order": 5,
        "purchase": 6,
        "fastView": 7,
        "addingToCart": 8,
        "removingFromCart": 9,
        "addingToBookmarks": 10,
        "removingFromBookmarks": 11,
        "share": 12,
        "registration": 13
    },
    /*sendPageView: function(data) {
        window.APRT_DATA = data;
    },*/
    sendEvent: function(data) {
        if (typeof window.APRT_SEND === 'function')
            window.APRT_SEND(data);
    }
};
partnersData.actionpay[partners.events.basket.add] = function() {
    var eventType = "addingToCart";
    var el = partners.data[partners.events.basket.add].el;
    var card = partners.dynamic.getProductCard(el);
    if (!card) return;
    var product = partners.dynamic.formatProducts([card])[0];
    partnersData.actionpay.sendEvent({
        pageType: partnersData.actionpay.pageTypes[eventType],
        currentProduct: {
            id: product.id,
            name: product.name,
            price: product.price
        }
    });
};
partnersData.actionpay[partners.events.basket.remove] = function() {
    var eventType = 'removingFromCart';

    var els = partners.data[partners.events.basket.remove].els || [];


    els.forEach(function(el) {
        if (!el.card) return;
        var card = partners.dynamic.getProductCard(el.card);
        if (!card) return;
        var product = partners.dynamic.formatProducts([card])[0];
        partnersData.actionpay.sendEvent({
            pageType: partnersData.actionpay.pageTypes[eventType],
            currentProduct: {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: el.count || 1
            }
        });
    });
};
/* end ActionPay */

/* ecommerce */
partnersData.ecommerce = {
    name: 'ecommerce',
    partnersEvents: [
        partners.events.click.products,
        partners.events.click.promo,
        partners.events.basket.add,
        partners.events.basket.remove,
        partners.events.order.contacts,
        partners.events.order.deliveryType,
        partners.events.order.paymentType,
        partners.events.order.confirm,
        //partners.events.order.purchase,
        partners.events.order.fullRefund,
        partners.events.impression.products,
        partners.events.impression.promo

    ],
    currencyCode: 'RUB',
    event: 'gtm-ee-event',
    eventCategory: 'Enhanced Ecommerce',
    eventsData: {
        productImpressions: {
            action: 'Product Impressions',
            nonInteraction: 'True',
            disablePages: [
                /^\/personal\/basket\/$/g,
                /^\/personal\/basket\/reserve\/$/g,
                /*/^\/catalog\/(\w+|\d+)\/\d+\/$/g*/
            ]
        },
        productClick: {
            action: 'Product Clicks',
            nonInteraction: 'False'
        },
        productDetails: {
            action: 'Product Details',
            nonInteraction: 'True'
        },
        promotionClick: {
            action: 'Promotion Clicks',
            nonInteraction: 'False'
        },
        promotionImpressions: {
            action: 'Promotion Impressions',
            nonInteraction: 'True'
        },
        addingToCart: {
            action: 'Adding a Product to a Shopping Cart',
            nonInteraction: 'False'
        },
        removingFromCart: {
            action: 'Removing a Product from a Shopping Cart',
            nonInteraction: 'False'
        },
        checkoutStep: {
            action: 'Checkout Step ',
            nonInteraction: 'False'
        },
        purchase: {
            action: 'Purchase',
            nonInteraction: 'False'
        },
        fullRefund: {
            action: 'Full Refund',

            nonInteraction: 'False'
        }
    },
    sendEvent: function(config) {
        var eventData = partnersData.ecommerce.eventsData[config.name];

        if(partnersData.ecommerce.isBlocked(eventData)){
            return;
        }

        var eventObj = {
            'ecommerce': config.ecommerce,
            'event': partnersData.ecommerce.event,
            'gtm-ee-event-category': partnersData.ecommerce.eventCategory,
            'gtm-ee-event-action': config.action || eventData.action,
            'gtm-ee-event-non-interaction': eventData.nonInteraction
        };

        if (config.callback) {
            eventObj.eventCallback = config.callback;
        }

        dataLayer.push(eventObj);
    },
    //Метод проверяет потребность в отправке статистики для события
    isBlocked: function (eventData){
        if(!eventData.disablePages || !Array.isArray(eventData.disablePages)){
            return false;
        }

        return eventData.disablePages.some(function (urlExpression){
            //Реализовано через реглярные выражения, чтобы не писать повторяющиеся url
            return urlExpression.test(window.location.pathname);
        });
    },
    checkoutSteps: {
        '1': {
            'name': 'Переход в корзину',
            'options': {}
        },
        '2': {
            'name': 'Ввод контактных данных',
            'options': {
                'a':'Физическое лицо',
                'b':'Юр. Лицо'
            }
        },
        '3': {
            'name': 'Ввод способа доставки',
            'options': {
                'a':'Самовывоз',
                'b':'Курьер',
                'c':'Почта',
                'd':'Срочная доставка'
            }
        },
        '4': {
            'name': 'Ввод способа оплаты',
            'options': {
                'a':'При получении',
                'b':'Оплата онлайн',
                'c':'Счет'
            }
        },
        '5': {
            'name': 'Подтверждение заказа',
            'options': {}
        },
        '6': {
            'name': 'Thank You Page',
            'options': {}
        }
    },
    sendOrderEvent: function(step, option, productsArray) {
        var ecommerceData = {
            'currencyCode': partnersData.ecommerce.currencyCode,
            'checkout': {
                'actionField': {
                    'step': step,
                    'option': partnersData.ecommerce.checkoutSteps[step].options[option] || ''
                },
                'products': productsArray
            }
        };

        partnersData.ecommerce.sendEvent({
            name: 'checkoutStep',
            ecommerce: ecommerceData,
            action: partnersData.ecommerce.eventsData['checkoutStep']['action'] + step
        })
    },
    productListCookieName: '',
    // извлечение названия списка из куки
    // или из урла
    /*getListName: function() {
        return $.cookie(partnersData.ecommerce.productListCookieName) | "";
    },*/
    init: function() {
        window.dataLayer = window.dataLayer || [];

    }
};
partnersData.ecommerce[partners.events.basket.add] = function() {
    var el = partners.data[partners.events.basket.add].el;
    var count = partners.data[partners.events.basket.add].count || 1;
    var card = partners.dynamic.getProductCard(el);
    if (!card) return;
    var product = partners.dynamic.formatProducts([card])[0];

    var eventType = "addingToCart";
    var ecommerceData = {
        'currencyCode': partnersData.ecommerce.currencyCode,
        'add': {
            'products': [{
                name: product.name,
                id: product.id,
                price: product.price,
                quantity: count
            }]
        }
    };
    partnersData.ecommerce.sendEvent({
        name: eventType,
        ecommerce: ecommerceData
    });
};
partnersData.ecommerce[partners.events.basket.remove] = function() {
    var els = partners.data[partners.events.basket.remove].els || [];

    var products = [];

    els.forEach(function(el) {
        if (!el.card) return;
        var card = partners.dynamic.getProductCard(el.card);
        if (!card) return;
        var product = partners.dynamic.formatProducts([card])[0];
        product.quantity = el.count || 1;
        products.push(product);
    });


    var eventType = 'removingFromCart';
    var ecommerceData = {
        'currencyCode': partnersData.ecommerce.currencyCode,
        'remove': {
            'products': products
        }
    };

    partnersData.ecommerce.sendEvent({
        name: eventType,
        ecommerce: ecommerceData
    })

};
partnersData.ecommerce[partners.events.order.contacts] = function() {
    var orderStep = 2;
    var orderData = partners.data[partners.events.order.contacts];

    if (orderData) {
        partnersData.ecommerce.sendOrderEvent(orderStep, orderData.option, orderData.products);
    }
};
partnersData.ecommerce[partners.events.order.deliveryType] = function() {
    var orderStep = 3;
    var orderData = partners.data[partners.events.order.deliveryType];
    partnersData.ecommerce.sendOrderEvent(orderStep, orderData.option, orderData.products);
};
partnersData.ecommerce[partners.events.order.paymentType] = function() {
    var orderStep = 4;
    var orderData = partners.data[partners.events.order.paymentType];
    partnersData.ecommerce.sendOrderEvent(orderStep, orderData.option, orderData.products);
};
partnersData.ecommerce[partners.events.order.confirm] = function() {
    var orderStep = 5;
    var orderData = partners.data[partners.events.order.confirm];
    partnersData.ecommerce.sendOrderEvent(orderStep, null, orderData.products);
};
/*partnersData.ecommerce[partners.events.order.purchase] = function() {
    var eventType = 'purchase';
    var order = partners.data[partners.events.order.purchase];
    var ecommerceData = {
        'currencyCode': partnersData.ecommerce.currencyCode,
        'purchase': {
            'actionField': {
                'id': order.orderData.id,
                'affiliation': 'Читай-город',
                'revenue': order.orderData.revenue,
                'tax': '0',
                'shipping': order.orderData.shipping,
                'coupon': order.orderData.coupon
            }
        },
        'products': order.products
    };
    partnersData.ecommerce.sendEvent({
        name: eventType,
        ecommerce: ecommerceData
    });
};*/
partnersData.ecommerce[partners.events.order.fullRefund] = function() {
    var data = partners.data[partners.events.order.fullRefund];
    var ecommerceData = {
        'refund': {
            'actionField': {
                'id': data.orderId
            }
        }
    };

    var ecommerceObj = {
        name: 'fullRefund',
        ecommerce: ecommerceData
    };

    if (data.callback) ecommerceObj['callback'] = data.callback;

    partnersData.ecommerce.sendEvent(ecommerceObj);
};
partnersData.ecommerce[partners.events.impression.products] = function() {
    var products = partners.data[partners.events.impression.products];

    var eventType = 'productImpressions';
    var ecommerceData = {
        'currencyCode': partnersData.ecommerce.currencyCode,
        'impressions': products
    };
    partnersData.ecommerce.sendEvent({
        name: eventType,
        ecommerce: ecommerceData
    });
};
partnersData.ecommerce[partners.events.impression.promo] = function() {
    var promo = partners.data[partners.events.impression.promo];

    var eventType = 'promotionImpressions';
    var ecommerceData = {
        'promoView': {
            'promotions' : promo
        }
    };
    partnersData.ecommerce.sendEvent({
        name: eventType,
        ecommerce: ecommerceData
    });
};
partnersData.ecommerce[partners.events.click.products] = function() {
    var products = partners.data[partners.events.click.products];
    var eventType = 'productClick';
    var ecommerceData = {
        'currencyCode': partnersData.ecommerce.currencyCode,
        'click': {
            'actionField': {
                'list': products[0].list
            },
            'products': products
        }
    };
    partnersData.ecommerce.sendEvent({
        name: eventType,
        ecommerce: ecommerceData
    });
};
partnersData.ecommerce[partners.events.click.promo] = function() {
    var promo = partners.data[partners.events.click.promo];
    var eventType = 'promotionClick';
    var ecommerceData = {
        'promoClick': {
            'promotions' : promo
        }
    };
    partnersData.ecommerce.sendEvent({
        name: eventType,
        ecommerce: ecommerceData
    });
};
/* end ecommerce */

/* Facebook Pixel START */
partnersData.facebookPixel = {
    name: "facebookPixel",
    partnersEvents: [
        partners.events.basket.add,
        partners.events.basket.bookmarkAdd,
        partners.events.user.registration,
        partners.events.order.contacts,
        partners.events.order.purchase,
        partners.events.search,
        partners.events.page.anketa,
        partners.events.page.home,
        partners.events.page.product,
        partners.events.page.other
    ],
    sendEvent: function (eventName, params){
        if(typeof fbq !== 'undefined' && eventName){
            if(!params){
                fbq('track', eventName);
            } else {
                fbq('track', eventName, params);
            }
        }
    }
};

// Добавление в корзину
partnersData.facebookPixel[partners.events.basket.add] = function() {
    partnersData.facebookPixel.sendEvent('AddToCart');
};

// Добавление в список желаний
partnersData.facebookPixel[partners.events.basket.bookmarkAdd] = function() {
    partnersData.facebookPixel.sendEvent('AddToWishlist');
};

// Завершенная регистрация
partnersData.facebookPixel[partners.events.user.registration] = function() {
    partnersData.facebookPixel.sendEvent('CompleteRegistration');
};

// Начало оформления заказа
partnersData.facebookPixel[partners.events.order.contacts] = function() {
    partnersData.facebookPixel.sendEvent('InitiateCheckout');
};

// Покупка
partnersData.facebookPixel[partners.events.order.purchase] = function() {
    var order = partners.data[partners.events.order.purchase];
    fbq('track', 'Purchase', {value: order.orderData.totalPrice, currency: 'RUB'});
};

// Поиск
partnersData.facebookPixel[partners.events.search] = function() {
    fbq('track', 'Search');
};

// Отправка заявки - Хотите у нас работать
partnersData.facebookPixel[partners.events.page.anketa] = function() {
    fbq('track', 'SubmitApplication');
};

// Просмотр контента - Главная
partnersData.facebookPixel[partners.events.page.home] = function() {
    fbq('track', 'ViewContent');
};

// Просмотр контента - Страницы разделов
partnersData.facebookPixel[partners.events.page.catalog] = function() {
    fbq('track', 'ViewContent');
};

// Просмотр контента - Карточка товаров
partnersData.facebookPixel[partners.events.page.product] = function() {
    fbq('track', 'ViewContent');
};

// Детальная страница (Новости, Акции, Статьи, Праздник каждый день)
partnersData.facebookPixel[partners.events.page.other] = function() {
    fbq('track', 'ViewContent');
};

/* Facebook Pixel END */

/* start vk Pixel */
partnersData.vkPixel = {
    name: 'vkPixel',
    partnersEvents: [
        partners.events.page.home,
        partners.events.page.catalog,
        partners.events.page.product,
        partners.events.page.search,
        partners.events.page.other,
        partners.events.basket.bookmarkAdd,
        partners.events.basket.bookmarkRemove,
        partners.events.basket.add,
        partners.events.basket.remove,
        partners.events.order.contacts,
        partners.events.order.paymentType,
        partners.events.order.purchase
    ],
    products: [],
    currencyCode: 'RUB',
    priceListId: 837,
    dataPerPackage: 24,
    //Общая стоимость товаров на странице
    totalPrice: 0,
    //Продукты со слайдера с рекомендациями
    recommendSliderProducts: [],
    //Отправка данных одного события
    sendEvent: function (eventName, data){
        if(data.products.length > 0 && typeof  VK !== 'undefined'){//Если есть список товаров
            VK.Retargeting.ProductEvent(partnersData.vkPixel.priceListId, eventName, data);
        }
    },
    //Отправка сообщения c данными, отправляемыми пакетно
    sendPackgageEvent: function (eventName, data){
        var productListLength = data.products.length;

        if(productListLength > partnersData.vkPixel.dataPerPackage){//Если товаров больше, чем лимит
            //найдем количество отправляемых пакетов с данными
            var packagesCount = Math.ceil(productListLength / partnersData.vkPixel.dataPerPackage);
            //Определим индекс начального и конечного элементов
            var firstElement = 0;
            var lastElement = partnersData.vkPixel.dataPerPackage;

            var delay = 100;

            for(var i = 0; i < packagesCount; i++){//Поочередно отправим пакеты

                //Скопируем объект с данными для отправки
                var dataToSend = {
                    products: data.products.slice(firstElement, lastElement),
                    total_price: data.total_price,
                    currency_code: data.currency_code
                };

                //Отправим событие отложенно
                setTimeout(function (currentEventData){
                    partnersData.vkPixel.sendEvent(eventName, currentEventData);
                }, delay, dataToSend);

                //Установим новые индексы элементов для следующего пакета
                firstElement = lastElement;
                var nextLastElement = firstElement + partnersData.vkPixel.dataPerPackage;
                if(nextLastElement <= productListLength){//Если индекс следующего удаляемого элемента меньше чем число элементов в массиве или совпадает с ним
                    lastElement = nextLastElement;
                } else  {//Если следующий элемент указывает на место вне массива
                    lastElement = productListLength;
                }

                delay += 25;
            }
        } else {//Если товаров меньше чем лимит
            setTimeout(function (){
                partnersData.vkPixel.sendEvent(eventName, data);
            }, 100);
        }
    },
    //Функция получения списка товаров на странице
    getProductsList: function (){
        partnersData.vkPixel.totalPrice = 0;
        //Преобразуем данные к виду для передачи на основе списка скрытых продуктов
        return partnersData.vkPixel.products.map(function (productElement) {
            //Добавим стоимость товара к общей стоимости товаров на странице
            partnersData.vkPixel.totalPrice += Number(productElement.dataset.productprice);
            //Преобразуем элемент товара к виду для передачи в пиксель
            return partnersData.vkPixel.createProductData(productElement);
        });
    },
    //Функция подсчета общей суммы товаров на странице с учетом удаленных
    countTotalPrice: function (){
        partnersData.vkPixel.totalPrice = partnersData.vkPixel.products.reduce(function (sumPrice, product){
            if(!product.hasAttribute('data-deleted')){//Если не удален, то считаем
                sumPrice += Number(product.dataset.productprice);
            }

            return sumPrice;
        }, 0);
    },
    //Функция получения информации о категории
    getCategoriesData: function (){
        return partners.dynamic.categories.join(',');
    },
    //Функция создания данных для передачи на основе данных о карточке товара
    createProductData: function (product){
        var productData = {
            id: product.dataset.product,
            price: Number(product.dataset.productprice)
        };

        if(product.dataset.oldproductprice && Number(product.dataset.oldproductprice) > Number(productData.price)){//Если есть скидка, то добавим информацию о ней
            productData.price_old = product.dataset.oldproductprice;
        }

        if(product.hasAttribute('data-full-product-card') && partnersData.vkPixel.recommendSliderProducts.length > 0){//Если товар представлен полной карточкой товара
            var productIds = partnersData.vkPixel.recommendSliderProducts.reduce(function (recommendsIdsString, product){
                return recommendsIdsString += product.dataset.product + ', ';
            }, '');
            productData.recommended_ids = productIds.substring(0, productIds.length - 2);
        }

        return productData;
    },
    //Создание данных для передачи при заходе пользователя на страницу
    createPageData: function (){
        var productsList = partnersData.vkPixel.getProductsList();

        var data = {
            "products": productsList,
            "total_price": partnersData.vkPixel.totalPrice,
            "currency_code" : partnersData.vkPixel.currencyCode
        };

        if(partners.dynamic.categories.length > 0){//Если есть категории товаров, то добавим их
            data.category_ids = partnersData.vkPixel.getCategoriesData();
        }

        return data;
    },
    //Функция срабатывающая на событии добавления товара куда-либо
    onAddProduct: function (eventName, eventKey){
        setTimeout(function (){
            partnersData.vkPixel.countTotalPrice();
            var button = partners.data[eventKey].el;
            var productData = {
                id: button.dataset.product ? button.dataset.product : button.dataset.element,
                price: button.dataset.productprice
            };

            if(button.dataset.oldproductprice && Number(button.dataset.oldproductprice) > Number(button.dataset.productprice)){//Если есть скидка, то добавим информацию о ней
                productData.price_old = button.dataset.oldproductprice;
            }

            setTimeout(function (){
                var productIds = '';

                if(partnersData.vkPixel.recommendSliderProducts.length > 0){
                    productIds = partnersData.vkPixel.recommendSliderProducts.reduce(function (recommendsIdsString, product){
                        return recommendsIdsString += product.dataset.product + ', ';
                    }, '');
                    productData.recommended_ids = productIds.substring(0, productIds.length - 2);
                }

                var data = {
                    "products": [productData],
                    "total_price": partnersData.vkPixel.totalPrice,
                    "currency_code" : partnersData.vkPixel.currencyCode
                };

                setTimeout(function (){
                    partnersData.vkPixel.sendEvent(eventName, data);
                }, 80);
            }, 100);
        }, 100);
    },
    //Функция срабатывающая на событии удаления товара откуда-либо
    onDeleteProduct: function (eventName, eventKey){
        setTimeout(function (){
            partnersData.vkPixel.countTotalPrice();
            var data = {
                "products": [],
                "total_price": partnersData.vkPixel.totalPrice,
                "currency_code" : partnersData.vkPixel.currencyCode
            };

            var buttons = partners.data[eventKey].els;

            setTimeout(function (){
                buttons.forEach(function (button){
                    var productData = {
                        id: button.card.dataset.product ? button.card.dataset.product : button.card.dataset.element,
                        price: button.card.dataset.productprice
                    };

                    if(button.card.dataset.oldproductprice && Number(button.card.dataset.oldproductprice) > Number(button.card.dataset.productprice)){//Если есть скидка, то добавим информацию о ней
                        productData.price_old = button.card.dataset.oldproductprice;
                    }
                    data.products.push(productData);
                });

                setTimeout(function (){
                    partnersData.vkPixel.sendPackgageEvent(eventName, data);
                }, 80);
            }, 100);
        }, 100);
    }
};
//Просмотр пользователем главной страницы
partnersData.vkPixel[partners.events.page.home] = function (){
    setTimeout(function (){
        var data = partnersData.vkPixel.createPageData();
        setTimeout(function (){
            partnersData.vkPixel.sendPackgageEvent('view_home', data);
        }, 50);
    }, 50);
};
//Просмотр пользователем страниц каталога
partnersData.vkPixel[partners.events.page.catalog] = function (){
    setTimeout(function (){
        var data = partnersData.vkPixel.createPageData();
        setTimeout(function (){
            partnersData.vkPixel.sendPackgageEvent('view_category', data);
        }, 50);
    }, 50);
};
//Просмотр пользователем страницы продукта
partnersData.vkPixel[partners.events.page.product] = function (){
    var data = partnersData.vkPixel.createPageData();
    partnersData.vkPixel.sendPackgageEvent('view_product', data);
};
//Просмотр пользователем тсраницы поиска и ее результатов
partnersData.vkPixel[partners.events.page.search] = function (){
    var data = partnersData.vkPixel.createPageData();
    data.search_string = helper.url.getParams('q');
    partnersData.vkPixel.sendPackgageEvent('view_search', data);
};
//Просмотр пользователем других страниц с товарами
partnersData.vkPixel[partners.events.page.other] = function (){
    var data = partnersData.vkPixel.createPageData();
    partnersData.vkPixel.sendPackgageEvent('view_other', data);
};
//Добавление пользователем товара в корзину
partnersData.vkPixel[partners.events.basket.add] = function (){
    partnersData.vkPixel.onAddProduct('add_to_cart', partners.events.basket.add);
};
//Удаление пользоватеелем товара из корзины
partnersData.vkPixel[partners.events.basket.remove] = function (){
    partnersData.vkPixel.onDeleteProduct('remove_from_cart', partners.events.basket.remove);
};
//Добавление товара в закладки
partnersData.vkPixel[partners.events.basket.bookmarkAdd] = function (){
    partnersData.vkPixel.onAddProduct('add_to_wishlist', partners.events.basket.bookmarkAdd);
};
//Удаление товара из закладок
partnersData.vkPixel[partners.events.basket.bookmarkRemove] = function (){
    partnersData.vkPixel.onDeleteProduct('remove_from_wishlist', partners.events.basket.bookmarkRemove);
};
//Начало офрмления заказов пользователем
partnersData.vkPixel[partners.events.order.contacts] = function (){
    var data = partnersData.vkPixel.createPageData();
    partnersData.vkPixel.sendPackgageEvent('init_checkout', data);
};
//Выбор пользователем способа оплаты
partnersData.vkPixel[partners.events.order.paymentType] = function (){
    var data = partnersData.vkPixel.createPageData();
    partnersData.vkPixel.sendPackgageEvent('add_payment_info', data);
};
//Совершение пользователем покупки
partnersData.vkPixel[partners.events.order.purchase] = function (){
    var data = partnersData.vkPixel.createPageData();
    partnersData.vkPixel.sendPackgageEvent('purchase', data);
};
/* end vk Pixel */

$(document).ready(function (){
    partners.addPartner(partnersData.actionpay);
    partners.addPartner(partnersData.ecommerce);
    partners.addPartner(partnersData.facebookPixel);
    partners.addPartner(partnersData.vkPixel);

    //инициализация партнёрок
    partners.trigger('init');

    partners.dynamic.init();
});