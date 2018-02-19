_aside = window._aside || {
    open: function() {
        document.querySelector('.aside.inactive').classList.remove('inactive');
    },

    close: function() {
        document.querySelector('.aside').classList.add('inactive');
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
