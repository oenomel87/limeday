_aside = window._aside || {
    open: function() {
        document.querySelector('.aside').classList.add('active');
    },

    close: function() {
        document.querySelector('.aside.active').classList.remove('active');
    }
}

_submenu = window._submenu || {
    open: function() {
        document.querySelector('.submenu.inactive').classList.remove('inactive');
    },

    close: function() {
        document.querySelector('.submenu').classList.add('inactive');
    }
}
