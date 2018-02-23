Vue.component('form-input', {

    props: ['tag', 'name'],

    template: `
        <div class="input-group-wrap">
            <div class="input-group">
                <label :class="isFocusLabel">{{ name }}</label>
                <div class="input-wrap" :class="isFocusInput">
                    <input
                        type="text"
                        :name="tag"
                        @focusin="setFocus"
                        @focusout="setFocus"
                        @keyup="inputVal">
                </div>
            </div>
        </div>
    `,

    computed: {

        isFocusLabel: function() {
            return {
                focus: this.focus,
                filled: this.value.length > 0
            }
        },

        isFocusInput: function() {
            return {
                focus: this.focus
            }
        }
    },

    data: function() {
        return {
            focus: false,
            value: ''
        }
    },

    methods: {
        setFocus: function() {
            this.focus = !this.focus;
        },

        inputVal: function(evt) {
            this.value = evt.target.value;
        }
    }
})

_formModal = new Vue({
    el: '.dialog',

    template: `
        <div class="dialog" :style="dialogStatus">
            <div class="dialog-head">
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
            <div class="dialog-body">
                <form-input
                    name="D-Day 이름"
                    tag="name"
                />
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
