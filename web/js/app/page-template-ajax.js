'use strict';


var DesignTemplateAjax = (function($, Logger, Page, ScreenHelper) {
    var module = {};

    var settings = {
        moduleName: 'DesignTemplateAjax',
        debug: true
    };

    var ui_selectors = {

    };

    var ui = {};
    //window.designLayoutUi = ui;

    var logger;

    function rebuildUI() {
       for (var pr in ui_selectors) {
            ui[pr] = $(ui_selectors[pr]);
        }
    }

    // Основной пересчёт/перерисовка
    function redraw() {

    }

    module.redraw = redraw;
    module.rebuildUI = rebuildUI;

    function init() {
        $(document).ready(function() {
            logger.log('event: DOM ready');

            rebuildUI();

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
