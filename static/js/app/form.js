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
});

Vue.component('date-input', {

    props: ['dday'],

    template: `
        <div class="input-group-wrap">
            <div class="input-group">
                <label class="filled">날짜</label>
                <div class="input-wrap">
                    <input type="text" name="dday" :value="ddayStr" @click="openPicker" readonly>
                </div>
            </div>
        </div>
    `,

    computed: {
        ddayStr: function() {
            return this.dday.toFormat('y-MM-dd');
        }
    },

    methods: {
        openPicker: function(evt) {
            this.$emit('openpicker');
        }
    }
});

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
                    <span @click="save">저장</span>
                </div>
            </div>
            <div class="dialog-body">
                <form-input
                    name="D-Day 이름"
                    tag="name"
                />
                <date-input
                    :dday="dday"
                    @openpicker="pickerHandler"
                />
            </div>
            <datepicker
                :init="dday"
                :status="showPicker"
                @closepicker="pickerHandler"
                @submitdate="submitDate"
            />
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
        status: 'hide',
        dday: luxon.DateTime.local(),
        showPicker: false,
        formLocker: false
    },

    methods: {
        show: function() {
            this.status = 'show';
            _submenu.close()
        },

        hide: function() {
            this.status = 'hide';
        },

        pickerHandler: function() {
            this.showPicker = !this.showPicker;
        },

        submitDate: function(pickDate) {
            this.dday = pickDate;
            this.showPicker = false;
        },

        save: function() {
            if(this.formLocker) {
                return;
            } else {
                this.formLocker = true;
            }

            axios({
                method: 'post',
                url: 'save',
                headers: {
                    'X-CSRFToken': document.querySelector('input[name=csrfmiddlewaretoken]').value
                },
                data: {
                    day_name: document.querySelector('.dialog input[name=name]').value,
                    dday: document.querySelector('.dialog input[name=dday]').value
                }
            })
            .then(function(res) {
                if(res.status === 200 && res.data.result === 'SUCCESS') {
                    alert('저장되었습니다');
                    location.reload();
                }
            })
            .catch(function(err) {
                console.error(err);
            })
        }
    }
});
