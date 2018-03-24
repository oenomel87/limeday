Vue.component('form-input', {

    props: ['label', 'name', 'value', 'valid', 'options'],

    template: `
        <div class="input-group-wrap">
            <div class="input-group" :class="hasError">
                <label :class="isFocusLabel">{{ label }}</label>
                <div class="input-wrap" :class="isFocusInput">
                    <input
                        :type="type"
                        :name="name"
                        :value="value"
                        :maxlength="maxlength"
                        :placeholder="placeholderMessage"
                        :readonly="readonly"
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
        type: function() {
            return this.options == null || !this.options.hasOwnProperty('type') ? 'text' : this.options.type;
        },

        placeholderMessage: function() {
            if(this.options == null || !this.options.hasOwnProperty('placeholder')) {
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
        },

        readonly: function() {
            return this.options != null && this.options.hasOwnProperty('readonly') ? this.options.readonly : false;
        },

        maxlength: function() {
            return this.options == null || !this.options.hasOwnProperty('maxlength') ? 20 : this.options.maxlength;
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
