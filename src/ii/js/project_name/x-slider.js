/* XSLIDER */
function XSlider(config) {

	this.selectors = {//селекторы слайдера
		viewport: '.slider__viewport',
		container: '.container_cards',
		slide: '.js_product',
		next: '.slider__right',
		prev: '.slider__left',
		disable: 'slider__arrow_disable',
		image: '[data-original]',
		imageLoaded: 'data-loaded',
		imageAttr: 'data-original'
	};

	this.slider = config.element;
	this.slider.setAttribute('data-xslider', '');//установить аттрибут слайдеру на странице
	this.slider.slider = this;//передается в partners.js свойство slider

	this.next = this.slider.querySelector(this.selectors.next);//стрелка вперед
	this.prev = this.slider.querySelector(this.selectors.prev);//стрелка назад

	this.container = this.slider.querySelector(this.selectors.container);//контейнер
	this.container.style.left = 0;

	this.slides = this.slider.querySelectorAll(this.selectors.slide);//эл-ты слайдера

	Array.prototype.forEach.call(this.slides, function (slide, index){//установить каждому слайду атрибуты
		slide.setAttribute('data-slider-item', '');
		slide.setAttribute('data-index', index++);
	});

	this.itemsCount = this.slides.length;//кол-во слайдов

	this.itemWidth = this.countItemWidth();//ширина карточки
	this.itemWidthWillChange = config.itemWidthWillChange || false;

	this.viewedPercentage = config.viewedPercentage || 0.95;
	this.viewedAbsolute = this.itemWidth * this.viewedPercentage;

	this.viewport = this.slider.querySelector(this.selectors.viewport);//вьюпорт
	this.viewportWidth = this.countViewportWidth();//ширина вьюпорта

	this.onScrolled = false;

	this.minCountNotCheckControls = config.minCountNotCheckControls || 6;

	this.isControlsView = true;
	this.isControlsView = this.checkControlsView();

	this.initializeEvents();//инициализация событий

	this.startX = null;//позиция клика
	this.diffX = null;//разница между начальным и новым положением курсора
	this.posContainer = parseInt(this.container.style.left);//новая позиция контейнера

	this.visibleItemsLength = Math.ceil(this.viewportWidth / this.itemWidth);//количество карточек видимых во вьюпорте
	this.hiddenBitItems = (this.itemWidth * this.visibleItemsLength - this.viewportWidth - 18); // ширина скрытой части карточки (18 - margin right item)

	this.lastSlide = -(this.itemWidth * this.slides.length - (this.itemWidth * this.visibleItemsLength) + this.hiddenBitItems); // положение последнего слайда

	this.transitionSpeed = this.visibleItemsLength * 130;//скорость анимации
	this.isSwiping = false; // Произошел свайп или нет? Проверка нужна для события touchend (в одном случае swipeEnd перерасчитывает и сдвигает контейнер, в случае нажатия - нет)
}

//метод вычисления ширины вьюпорта с внешними отступами
XSlider.prototype.countViewportWidth = function() {
	var styles = window.getComputedStyle(this.viewport);//получить значение свойства стиля карточки
	var margin = parseFloat(styles['marginLeft']) +
		parseFloat(styles['marginRight']);//преобразовать в число полученное свойство
	return Math.ceil(this.viewport.offsetWidth + margin);//вернуть значение ширины вьюпорта с внешними отступами
};

//метод вычисления ширины карточки
XSlider.prototype.countItemWidth = function() {
	if (!this.itemWidth || this.itemWidthWillChange) {
		var styles = window.getComputedStyle(this.slides[0]);//получить значение свойства стиля карточки
		var margin = parseFloat(styles['marginLeft']) +
			parseFloat(styles['marginRight']);//преобразовать в число полученное свойство
		return Math.ceil(this.slides[0].offsetWidth + margin);//вернуть значение ширины слайда с внешними отступами
	} else {
		return this.itemWidth;
	}
};

XSlider.prototype.checkControlsView = function() {

	if (this.itemsCount >= this.minCountNotCheckControls) {
		return true;
	}

	var lastItem = this.slides[this.slides.length - 1];
	var lastItemLeft = parseFloat(this.getCoordsElement(lastItem).left);
	var sliderRight =  parseFloat(this.getCoordsElement(this.viewport).left) + this.viewportWidth;
	var isControlsView = (sliderRight - lastItemLeft) < this.viewedAbsolute;

	if (this.isControlsView && !isControlsView) {
		this.hideControls();
	}else if (!this.isControlsView && isControlsView) {
		this.showControls();
	}

	return isControlsView;
};

XSlider.prototype.hideControls = function() {
	this.slider.setAttribute('data-hide-controls', '');
};

XSlider.prototype.showControls = function() {
	this.slider.removeAttribute('data-hide-controls');
};

//метод отправки данных аналитики
XSlider.prototype.sendAnalytic = function() {
	this.onScrolled = false;
	$(this.slider).trigger('xslider.events.slideEnd');
};

//метод получения промотренных карточек в слайдере
XSlider.prototype.getVisibleItems = function() {
	var viewportStart = parseFloat(this.getCoordsElement(this.viewport).left);
	var viewportFinish = viewportStart + this.viewportWidth;
	var visible = [];

	for (var i = 0; i < this.itemsCount; i++) {
		var slide = this.slides[i];
		var itemStart = parseFloat(this.getCoordsElement(this.slides[i]).left);
		var itemFinish = itemStart + this.itemWidth;

		if (itemStart < viewportFinish) {
			visible.push(slide);
		}

		if (itemFinish >= viewportFinish) {
			break;
		}
	}
	return visible;
};

//метод проверки на видимость слайда
XSlider.prototype.isSlideVisible = function(slide) {
	var viewportStart = parseFloat(this.getCoordsElement(this.viewport).left);
	var viewportFinish = viewportStart + this.viewportWidth;
	var itemStart = parseFloat(this.getCoordsElement(slide).left);

	if (itemStart >= viewportStart && itemStart < viewportFinish ) {
		return itemStart;
	}
};

//метод получения координат элемента
XSlider.prototype.getCoordsElement = function(element) {
	var box = element.getBoundingClientRect();
	return {
		top: box.top + pageYOffset, // возвратить полученные координаты верхней и левой границ, добавив к ним значения текущей прокрутки
		left: box.left + pageXOffset // страницы .pageY(Х)Offset возвращает текущую вертикальную(горизонтальную) прокрутку.
	};
};

// метод навешивания событий
XSlider.prototype.initializeEvents = function() {
	window.addEventListener("resize", this.onEnvChange.bind(this));
	this.viewport.addEventListener('touchstart', this.swipeStart.bind(this));
	this.viewport.addEventListener('touchmove', this.swipeMove.bind(this));
	this.viewport.addEventListener('touchend', this.swipeEnd.bind(this));
	this.viewport.addEventListener('touchcancel', this.swipeEnd.bind(this));
	if(this.next){
		this.next.addEventListener("click", this.moveForward.bind(this));
	}
	if(this.prev){
		this.prev.addEventListener("click", this.moveBack.bind(this));
	}
};

//метод срабатывающий при ресайзе страницы
XSlider.prototype.onEnvChange = function() {

	//пересчитаем ширину вьюпорта
	this.viewportWidth = this.countViewportWidth();
	//пересчитаем ширину скрытой части карточки (18 - margin right item)
	this.hiddenBitItems = (this.itemWidth * this.visibleItemsLength - this.viewportWidth - 18);
	//пересчитаем скорость анимации
	this.transitionSpeed = this.visibleItemsLength * 175;

	if (this.itemWidthWillChange) {
		this.itemWidth = this.countItemWidth();
		this.viewedAbsolute = this.itemWidth * this.viewedPercentage;
	}

	this.isControlsView = this.checkControlsView();
};

// Ф-ия дизэйбла кнопки "Вперед"
XSlider.prototype.disableFrontArrow = function(newPosContainer){
	if (newPosContainer > this.lastSlide){
		if (this.prev){
			this.prev.classList.remove(this.selectors.disable);//удалить дизейбл с кнопки назад
		}
		this.container.style.left = newPosContainer  + 'px';
	} else {//если последний слайд
		if(this.next){
			this.next.classList.add(this.selectors.disable); //задизейблить кнопку вперед
			this.viewport.style.borderRight = 'none';
			this.viewport.style.borderLeft = '1px solid rgba(0, 0, 0, 0.1)';
		}
		this.container.style.left = this.lastSlide + 'px';
	}

	this.container.style.transition = 'left ' + this.transitionSpeed +'ms ease-out';
	this.posContainer = parseInt(this.container.style.left);//запомнить новое значение позиции контейнера
};

// Ф-ия дизэйбла кнопки "Назад"
XSlider.prototype.disableBackArrow = function(newPosContainer){
	if (newPosContainer === this.lastSlide) {//если последний слайд
		if(this.next){
			this.next.classList.remove(this.selectors.disable);//удалить дизейбл с кнопки вперед
			this.viewport.style.borderRight = '1px solid rgba(0, 0, 0, 0.1)';
			this.viewport.style.borderLeft = 'none';
		}
		this.container.style.left = this.posContainer + this.itemWidth * this.visibleItemsLength - this.itemWidth + this.hiddenBitItems + 'px';
	} else if (-this.posContainer <= this.viewportWidth){ // если первый слайд
		if(this.prev){
			this.prev.classList.add(this.selectors.disable);//задизейблить кнопку назад
		}
		this.container.style.left = 0 + 'px';
	} else {
		this.container.style.left = this.posContainer + this.itemWidth * (this.visibleItemsLength - 1) + 'px';
	}
	this.container.style.transition = 'left ' + this.transitionSpeed +'ms ease-out';
	this.posContainer = parseInt(this.container.style.left);//запомнить новое значение позиции контейнера
};

//метод пролистывания слайдера вперед
XSlider.prototype.moveForward = function() {

	if (this.onScrolled) {
		return;
	}

	if (this.next.classList.contains(this.selectors.disable)) {//если кнопка "вперед" задизейблена, то ничего не делать
		return;
	}

	var self = this;
	this.onScrolled = true;
	var newPosContainer = this.posContainer - this.itemWidth * (this.visibleItemsLength - 1); // новое положение контейнера
	this.disableFrontArrow(newPosContainer);
	setTimeout(function () {
		self.sendAnalytic();
	}, 500)
};

//метод пролистывания слайдера назад
XSlider.prototype.moveBack = function() {

	var self = this;
	var countCard = Math.ceil(this.diffX / this.itemWidth); //кол-во просвайпанных карточек
	var newPosContainer = this.posContainer - countCard * this.itemWidth; //новое положение контейнера
	if (this.prev.classList.contains(this.selectors.disable)) {//если кнопка "назад" задизейблена, то ничего не делать
		return;
	}
	this.disableBackArrow(newPosContainer);
	setTimeout(function () {
		self.sendAnalytic();
	}, 500)
};

//метод начала свайпа
XSlider.prototype.swipeStart = function(evt) {
	if(this.isSwiping){
		return;
	}
	this.isSwiping = true;
	this.container.style.transition = null;//сбросить анимацию
	this.startX = parseInt(evt.changedTouches[0].pageX);// получить координаты клика мыши по оси Х
};

//метод движения свайпа
XSlider.prototype.swipeMove = function(evt) {
	this.diffX = this.startX - parseInt(evt.changedTouches[0].pageX); //найти разницу между начальным и новым положением курсора

	var self = this;
	if(evt.type === 'touchmove'){
		self.transitionSpeed = 200;
	}

	if (this.posContainer < -this.itemWidth / 2){//прописать новую позицию контейнеру в зависимости от расстояния на которое он сдвинулся
		this.container.style.left = this.posContainer - this.diffX + 'px';
	} else {
		this.container.style.left = -this.diffX + 'px';
	}
};

//метод окончания свайпа
XSlider.prototype.swipeEnd = function(evt) {
	var self = this;
	var countCard = Math.ceil(this.diffX / this.itemWidth); //кол-во просвайпанных карточек
	var newPosContainer = this.posContainer - countCard * this.itemWidth; //новое положение контейнера
	if (this.diffX > this.itemWidth / 5) {//если мышь ушла влево больше, чем на 1/5 ширины карточки
		this.disableFrontArrow(newPosContainer);
	} else {//если мышь ушла вправо
		this.disableBackArrow(newPosContainer);
	}

	this.isSwiping = false;

	setTimeout(function () {
		self.sendAnalytic();
	}, 500)
};

/* XSLIDER END */

/* SLIDER */
$(document).ready(function (){
	var carousels = Array.prototype.slice.call(document.querySelectorAll('[data-carousel]'));
	carousels.forEach(function(item){
		new XSlider({
			element: item
		});
	});
});
/* END SLIDER */