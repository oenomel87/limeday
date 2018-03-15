Vue.component('form-input', {

    props: ['type', 'label', 'name', 'value', 'placeholder', 'valid'],

    template: `
        <div class="input-group-wrap">
            <div class="input-group" :class="hasError">
                <label :class="isFocusLabel">{{ label }}</label>
                <div class="input-wrap" :class="isFocusInput">
                    <input
                        :type="inputType"
                        :name="name"
                        :value="value"
                        maxlength="20"
                        :placeholder="placeholderMessage"
                        @focusin="setFocus"
                        @focusout="setFocus"
                        @keyup="inputVal">
                </div>
                <div class="help-text">
                    <span>{{ helpText }}</span>
                </div>
            </div>
        </div>
    `,

    computed: {
        inputType: function() {
            return this.type == null ? 'text' : this.type;
        },

        placeholderMessage: function() {
            if(this.placeholder == null || this.placeholder === '') {
                return '';
            }
            return this.focus ? this.placeholder : '';
        },

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
        },

        helpText: function() {
            return this.valid == null || !this.valid.hasOwnProperty('message') ? '' : this.valid.message;
        },

        hasError: function() {
            return {
                error: this.valid != null && !this.valid.valid
            }
        }
    },

    data: function() {
        return {
            focus: false
        }
    },

    methods: {
        setFocus: function() {
            this.focus = !this.focus;
        },

        inputVal: function(evt) {
            this.$emit('inputval', evt.target.value);
        }
    }
});
