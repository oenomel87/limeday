_aside = window._aside || {
    open: function() {
        document.querySelector('.aside.inactive').classList.remove('inactive');
    },

    close: function() {
        document.querySelector('.aside').classList.add('inactive');
    }
}