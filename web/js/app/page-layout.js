'use strict';


var DesignLayout = (function($, Logger, Page, ScreenHelper, BootstrapModal, Utils) {
    var module = {};

    var settings = {
        moduleName: 'DesignLayout',
        debug: true
    };

    var ui = {
        // main blocks
        body: 'body',
        page: '.page',
        mainContent: '.page__content',
        fixedHeader: '.fixed-header',

        // overlays
        overlayBody: '.page__overlay',

        //panel
        panel: '.page__panel',
        // buttons for panelz
        panelOpen: '#panelOpen',
        panelClose: '#panelClose',

        // modals registration 
        fullWidthElements: '.page__content, .fixed-header',
        positionedElements: '',

        // Отзывчивые поля ввода текста
        feedbacks: '.feedback'
    };

    var logger;

    var windowLoad = false;

    var useCSS3Animation;
    var animationDurationMS = Page.getAnimationSpeed();
    var animationDuration = animationDurationMS / 1000;

    // Переменная для хранения содержания пользовательнского поля ввода
    var content = null;

    var modalCloseNow = false;

    // Версия браузера
    function ieVersion() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE');
        if (msie > 0) {
            return parseInt (ua.substring(msie + 5, ua.indexOf('.', msie)));
        }
        if (ua.indexOf('Trident/7.0') + 1) {
            return 11;
        }
        return 0;
    }

    // Проверка скролла
    function checkScroll() {
        var scroll;
        if (!(ieVersion() && ieVersion())) {
            scroll = $(window).scrollTop();
        } else {
            scroll = document.documentElement.scrollTop;
        }

        // логика для скролла
    }

    // Set overlay height
    function setOverlayHeight() {
        if (ui.body.height() > document.documentElement.clientHeight) {
            ui.overlayBody.css({
                display: 'block',
                height: ui.body.height()
            });
        } else {
            ui.overlayBody.css({
                display: 'block',
                height: document.documentElement.clientHeight
            });
        }
    }

    // Left menu open
    function openPanel() {
        ui.body.addClass('panel-open');

        setOverlayHeight();

        ui.fixedHeader.css({'z-index': '1150'});

        setPanelTransition(animationDuration);

        if (useCSS3Animation) {
            ui.overlayBody.css({opacity: 1});
            Utils.css3(ui.panel, {'%stransform': 'translate(250px, 0px)'});
        } else {
            ui.overlayBody.animate({opacity: 1}, {duration: animationDurationMS, queue: false});
            ui.panel.animate({left: '0px'}, {duration: animationDurationMS, queue: false});
        }

    }

    // Left menu close
    function closePanel() {
        ui.body.removeClass('panel-open');

        setPanelTransition(animationDuration);

        if (useCSS3Animation) {
            ui.overlayBody.css({opacity: 0});
            window.setTimeout(function() {
                ui.overlayBody.hide();
                ui.fixedHeader.css({'z-index': ''});
            }, animationDurationMS);
            Utils.css3(ui.panel, {'%stransform': 'translate(0px, 0px)'});
        } else {
            ui.overlayBody.animate({
                opacity: 0
            }, {
                duration: animationDurationMS,
                queue: false,
                complete: function() {
                    ui.overlayBody.hide();
                    ui.fixedHeader.css({'z-index': ''});
                }
            });
            ui.panel.animate({left: '-250px'}, {duration: animationDurationMS, queue: false});
        }
    }

    /*
    // Проверка панели если требуется
    function checkPanel() {

        if (ui.body.hasClass('panel-open')) {

            setPanelTransition(0);

            if (useCSS3Animation) {
                ui.overlayBody.css({opacity: 0}).hide();
                Utils.css3(ui.panel, {'%stransform': 'translate(0px, 0px)'});
            } else {
                ui.panel.css({left: '0'});
                ui.overlayBody.css('opacity', 0).hide();
            }
            ui.fixedHeader.css({'z-index': ''});

            ui.body.removeClass('panel-open');
        }
    }*/

    // Кроссбраузерная CSS-анимация
    function setPanelTransition(duration) {
        if (useCSS3Animation) {
            Utils.css3(ui.panel, {'%stransition': '%stransform ' + duration + 's'});
            Utils.css3(ui.overlayBody, {'%stransition': 'opacity ' + duration + 's'});
        }
    }

    var pageInitCount = 0;
    function initPanels() {
        if (pageInitCount++ > 0) return;

        // Контроль панелей
        $(document).on('click', function(evt) {

            var $triggerOnPanel = $(evt.target).closest('.page__panel');
            var $triggerOpenPanel = $(evt.target).closest('#panelOpen');
            var $triggerClosePanel = $(evt.target).closest('#panelClose');

            if (ui.body.hasClass('panel-open')) {
                if (!$triggerOnPanel.length) {
                    if (modalCloseNow) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        logger.log('Клик не на панели и модаль открыта!', modalCloseNow);
                    } else {
                        evt.preventDefault();
                        closePanel();
                        logger.log('Клик не на панели и модаль закрыта!', modalCloseNow);
                    }
                } else if ($triggerClosePanel.length) {
                    closePanel();
                    logger.log('Клик на панели на .close!', modalCloseNow);
                }
            } else {
                if ($triggerOpenPanel.length) {
                    evt.preventDefault();
                    openPanel();
                    logger.log('Открываем!', modalCloseNow);
                }
            }

            if (modalCloseNow) {
                modalCloseNow = false;
            }
        });
    }

    // Сенсорные события
    var touchEventsInitCount = 0;
    function initTouchEvents() {
        if (touchEventsInitCount++ > 0) return;

        // Фиксация клика для сенсорных устройств
        /*$(document).on('touchstart', function(evt){
            evt.preventDefault();

            var $trigger = $(evt.target);

            evt.target.click();

            if ($trigger.hasClass('form-control')) {
                $trigger.focus();
            }
        });*/
    }

    // Основной пересчёт/перерисовка
    function redraw() {
        logger.log('redraw');

        // Высота страницы
        ui.mainContent.innerHeight('auto');
        if (ui.mainContent.innerHeight() < document.documentElement.clientHeight) {
            ui.mainContent.innerHeight(document.documentElement.clientHeight);
        }

        // Правильная ширина полей ввода в Бутсраповских сетках
        if (ui.feedbacks.length) {
            ui.feedbacks.each(function() {
                if (document.documentElement.clientWidth < ScreenHelper.screenSM - ScreenHelper.getScrollbarWidth()) {
                    $(this).outerWidth($(this).siblings('.textarea-help').outerWidth() - 20);
                } else {
                    $(this).outerWidth($(this).parent().innerWidth() - 20);
                }
            });
        }

        // Проверка панели если требуется
        //checkPanel();
    }

    function init() {
        $(document).ready(function() {
            logger.log('event: DOM ready');

            // prepare jquery ui objects
            for (var pr in ui) {
                ui[pr] = $(ui[pr]);
            }

            initTouchEvents();
            initPanels();

            /*
            // Предзагрузка изображений для виджета выбора типа стратегии
            var images = ['/img/01.png', '/img/02.png', '/img/03.png'];
            var count = images.length;
            var preloaded = [];

            function onLoad() {
                //logger.log('event: Images ready');
                //ui.Images.css('visibility','visible');
            }

            for (var i = 0; i < count; i++) {
                var path = images[i];
                var img = new Image();
                img.onload = function() {
                    preloaded.push(path);
                    if (preloaded.length == count) {
                        onLoad();
                    }
                }
                img.src = path;
            }*/

            $('#modal-template').on('hide.bs.modal', function(evt) {
                modalCloseNow = true;
            });

            // Увеличение контролов комментов при фокусе
            ui.feedbacks.on('focus', function () {
                $(this).css('min-height',(parseInt($(this).css('line-height'), 10) * 3) 
                            + (parseInt($(this).css('padding-top'), 10) * 2) 
                            + (parseInt($(this).css('border-width'), 10) * 2));

                /*if ($(this).siblings('.btn-feedback').length) {
                    $(this).siblings('.btn-feedback').css({'display': 'block'});
                }*/

                $(this).on('blur', function () {
                    $(this).css('min-height','');

                    /*if ($(this).siblings('.btn-feedback').length) {
                        $(this).siblings('.btn-feedback').css({'display': ''});
                    }*/
                });
            });

            // Для автоматического расширения полей ввода
            ui.feedbacks.on('input', function(){
                content = $(this).val();

                var lineHeight = $(this).css('line-height');
                var num = parseInt(lineHeight, 10);

                $(this).siblings('.textarea-help').outerWidth($(this).outerWidth());

                $(this).siblings('.textarea-help').html(content);

                if (content.slice(-1) == "\n") {
                    $(this).height($(this).siblings('.textarea-help').height() + num);
                } else {
                    $(this).height($(this).siblings('.textarea-help').height());
                }
            });

            // init module
            BootstrapModal.init({
                debug: debug
            });

            // modals registration

            // modal template
            BootstrapModal.register($('#modal-template'), $('.modal-template-trigger'),
                                    $(ui.fullWidthElements), $(ui.positionedElements));

            redraw();
        });

        $(window).load(function() {
            logger.log('event: window load');

            windowLoad = true;

            redraw();

            window.setTimeout(function() {
                redraw();
            }, 0);
        });

        $(window).scroll(function() {
            logger.log('event: window scroll');

            // теоретически событие может наступить до того, как будет готова DOM модель,
            // поэтому, чтобы избежать ошибок, используем здесь $(ui.el) вместо ui.el


            if (windowLoad) {
                checkScroll();
            }
        });

        $(window).resize(function() {
            logger.log('event: window resize');

            if (ui.body.hasClass('panel-open')) {
                setOverlayHeight();
            }

            redraw();
        });
    }

    module.init = function(_settings) {
        _settings = _settings || {};

        for (var pr in _settings) {
            settings[pr] = _settings[pr];
        }

        logger = new Logger(settings);

        useCSS3Animation = Utils.supportsCSSProp('transition') 
                           && Utils.supportsCSSProp('transform');

        init();

        logger.log('init');
    };

    return module;
}(jQuery, Logger, Page, ScreenHelper, BootstrapModal, Utils));
