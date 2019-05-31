'use strict';


var LineСhart = (function($, Logger) {
    var module = {};

    var settings = {
        moduleName: 'LineСhart',
        debug: true
    };

    var logger;

    var manager = [];

    var Obj = function($el, date, options) {
        options = options || {};

        this.$el = $el;

        date = $.map(date, function(n, i) {
            return {day: date[i][0], value: date[i][1]};
        });

        this.days = date.length;
        this.date = date;

        this.options = {
            name: ''
        };

        for (var pr in options) {
            this.options[pr] = options[pr];
        }

        this.initUI();
        this.redraw();
    };

    Obj.prototype.initUI = function() {
        this.$chart = $('<div class="custom-line-chart"></div>').appendTo(this.$el);

        var width = ((this.$chart.width() / this.days) / this.$chart.width()) * 100 + '%';

        this.$name = $('<div class="custom-line-chart__name">' + this.options.name + '</div>').appendTo(this.$chart);
        this.$items = $('<div class="custom-line-chart__items"></div>').appendTo(this.$chart);
        this.$labels = $('<div class="custom-line-chart__labels"></div>').appendTo(this.$chart);

        for (var i = 0; i < this.days; i++) {
            var $item = $('<div></div>').appendTo(this.$items);
            var $label = $('<div></div>').appendTo(this.$labels);
            $item.width(width);
            $label.width(width);
            if (this.date[i].value) {
                $item.addClass('on');
            }
            $label.text(this.date[i].day);
        }
    };

    Obj.prototype.redraw = function() {
        var width = ((this.$chart.width() / this.days) / this.$chart.width()) * 100 + '%';

        this.$items.children().width(width);
        this.$labels.children().width(width);

        if (width < 20) {
            this.$labels.addClass('off');
        } else {
            this.$labels.removeClass('off');
        }
    };

    Obj.prototype.destroy = function() {
        var idx = $.inArray(this, manager);
        if (idx != -1) {
            manager.splice(idx, 1);
        }
        this.$chart.remove();
    };

    function redraw() {
        $(manager).each(function(i, obj) {
            obj.redraw();
        });
    }

    module.create = function($el, date, options) {
        options = options || {};

        var obj = new Obj($el, date, options);
        manager.push(obj);
        return obj;
    };

    module.destroy = function($el) {
        $(manager).each(function(i, obj) {
            obj.destroy();
        });
    };

    module.init = function(_settings) {
        _settings = _settings || {};

        for (var pr in _settings) {
            settings[pr] = _settings[pr];
        }

        logger = new Logger(settings);

        $(window).resize(function() {
            redraw();
        });

        logger.log('init');
    };

    return module;
}(jQuery, Logger));