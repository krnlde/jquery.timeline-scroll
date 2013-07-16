!(function ($, window, undefined) {
  var $window = $(window);
  var $body = $(document.body);
  var windowHeight = $window.height();
  var bodyHeight = $body.height();
  var defaults = {
    scrollSpeed : 'fast'
  };

  $.fn.timelineScroll = function (opts) {
    var that = this;
    var options = $.extend(defaults, opts);
    var $container, lastPosition = 0;

    function calculateTop($elem) {
      return $elem.offset().top;
    }

    function calculatePosition($elem) {
      return calculateTop($elem) / bodyHeight * $container.height();
    }
    if (this.length) {
      if (!$body.data('timelineScroll')) {
        $container = $('<ul role="menubar" class="list-unstyled timelineScroll"/>').appendTo($body);
        that.each(function () {
          var $this = $(this);
          var height = $this.height();
          var top = calculateTop($this);
          var position = calculatePosition($this);

          if (!$this.attr('id')) {
            $this.attr('id', $this.get(0).tagName + '_' + Math.floor(top * 100));
          }
          $a = $('<a href="#' + $this.attr('id') + '">' + $this.text() + '</a>').click(function () {
            $('html, body').animate({scrollTop: top}, options.scrollSpeed);
            return false;
          });
          var $li = $('<li/>', {
            'role': 'menuitem',
            'style': 'top: ' + position + 'px'
          })
            .append($a)
            .data('connectedWith', $this)
            .appendTo($container);
          if (!lastPosition || lastPosition < position - $this.height()) {
            lastPosition = position;
          } else {
            $li.hide();
          }
        });

        $body.mouseover(function () {
          $container.removeClass('active');
        });
        $container.mouseover(function () {
          $(this).addClass('active');
          return false;
        });

        $window.on('resize', function (e) {
          windowHeight = $window.height();
          bodyHeight = $body.height();
          lastPosition = 0;
          $container.children().each(function () {
            var $this = $(this);
            var position = calculatePosition($this.data('connectedWith'));
            $this.css('top', position + 'px');
            if (!lastPosition || lastPosition < position - $this.height()) {
              lastPosition = position;
              $this.show();
            } else {
              $this.hide();
            }
          });
        })
        $body.data('timelineScroll', $container);
      }
    }
  };
}(jQuery, window));