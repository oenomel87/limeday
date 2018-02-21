_formModal = new Vue({
    el: '.dialog',

    template: `
        <div class="dialog" :style="dialogStatus">
            <div class="head">
                <div class="close-btn">
                    <i class="material-icons" @click="hide">close</i>
                </div>
                <div class="dialog-title">
                    <span>D Day 관리</span>
                </div>
                <div class="save-btn">
                    <span>저장</span>
                </div>
            </div>
        </div>
    `,

    computed: {
        dialogStatus: function() {
            return {
                display: this.status === 'hide' ? 'none' : 'block'
            };
        }
    },

    data: {
        status: 'hide'
    },

    methods: {
        show: function() {
            this.status = 'show';
            _submenu.close()
        },

        hide: function() {
            this.status = 'hide';
        }
    }
});
