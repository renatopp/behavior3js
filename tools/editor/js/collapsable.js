(function($) {
    function _col(obj) {
        var headers = $('.header>a', obj);
        headers.off('click');
        headers.click(function() {
            $('ul', $(this).parent()).toggle(100);
        });
    }

    function _observe(m) {
        m.forEach(function(mut) {
            _col($(mut.target));
        });
    }

    $.fn.collapsable = function() {
        _col(this);

        MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        var observer = new MutationObserver(_observe);
        this.each(function() {
            observer.observe(this, {childList: true});
        });
    }
}(jQuery));