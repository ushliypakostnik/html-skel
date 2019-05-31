'use strict';


var Sandbox = (function($, Logger, Page, ScreenHelper) {
    var module = {};

    var settings = {
        moduleName: 'Sandbox',
        debug: true
    };

    var ui = {
        canvas01: '#test-01'
    };

    var logger;

    // Отрисовка canvas
    function drawCanvas(){
        if (ui.canvas01.length) {
            var canvas = ui.canvas01[0];

            if (canvas.getContext){
                var ctx = canvas.getContext('2d');

                ctx.fillStyle = "rgb(200,0,0)";
                ctx.fillRect (10, 10, 55, 50);

                ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
                ctx.fillRect (30, 30, 55, 50);
            }
        }
    }

    if ($('#slider').length) {
        var swiper = new Swiper('#slider', {
          slidesPerView: 1,
          centeredSlides: true,
          loop: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
              return '<span class="' + className + ' bullet-' + (index + 1) + '"><div class="image"></div></span>';
            },
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
          },
          breakpoints: {
          }
        });
    }

    // Основной пересчёт/перерисовка
    function redraw() {
        logger.log('redraw');

        if (ui.canvas01.length) {
            ui.canvas01.width(ui.canvas01.parent().width());

            drawCanvas();
        }
    }

    function init() {
        $(document).ready(function() {
            logger.log('event: DOM ready');

            // prepare jquery ui objects
            for (var pr in ui) {
                ui[pr] = $(ui[pr]);
            }

            if ($('.custom-line-chart-place').length) {
                // Инициализация модуля для рисования кастомных линейных чартов
                LineСhart.init({
                    debug: debug
                });

                // Пример инициализации кастомного линейного чарта №1 - на одну неделю
                if ($('#customLineChart01').length) {
                    // кастомный линейный чарт №1
                    var linechart1 = LineСhart.create(
                        // контейнер
                        $('#customLineChart01'),
                        // данные
                        [
                            [18,true],
                            [19,false],
                            [20,true],
                            [21,false],
                            [22,true],
                            [23,true],
                            [24,false]
                        ],
                        // настройки
                        {
                            name: 'Chart Name 1'
                        }
                    );
                }

                // Пример инициализации кастомного линейного чарта №2 - на две недели
                if ($('#customLineChart02').length) {
                    // кастомный линейный чарт №2
                    var linechart2 = LineСhart.create(
                        // контейнер
                        $('#customLineChart02'),
                        // данные
                        [
                            [11,true],
                            [12,false],
                            [13,true],
                            [14,false],
                            [15,true],
                            [16,true],
                            [17,false],
                            [18,true],
                            [19,false],
                            [20,true],
                            [21,false],
                            [22,true],
                            [23,true],
                            [24,false]
                        ],
                        // настройки
                        {
                            name: 'Chart Name 2'
                        }
                    );
                }
            }

            redraw();
        });

        $(window).load(function() {
            logger.log('event: window load');

            redraw();

            window.setTimeout(function() {
                redraw();
            }, 0);
        });

        $(window).scroll(function() {
            logger.log('event: window scroll');

            // теоретически событие может наступить до того, как будет готова DOM модель,
            // поэтому, чтобы избежать ошибок, используем здесь $(ui.el) вместо ui.el
        });

        $(window).resize(function() {
            logger.log('event: window resize');

            redraw();
        });
    }

    module.init = function(_settings) {
        _settings = _settings || {};

        for (var pr in _settings) {
            settings[pr] = _settings[pr];
        }

        logger = new Logger(settings);

        init();

        logger.log('init');
    };

    return module;
}(jQuery, Logger, Page, ScreenHelper));
