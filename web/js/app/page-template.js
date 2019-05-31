'use strict';


var DesignTemplate = (function($, Logger, Page, ScreenHelper) {
    var module = {};

    var settings = {
        moduleName: 'DesignTemplate',
        debug: true
    };

    var ui = {
    };

    var logger;

    // Основной пересчёт/перерисовка
    function redraw() {
        logger.log('redraw');
    }

    function init() {
        $(document).ready(function() {
            logger.log('event: DOM ready');

            // prepare jquery ui objects
            for (var pr in ui) {
                ui[pr] = $(ui[pr]);
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
