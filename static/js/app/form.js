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
                    <span @click="save">저장하기</span>
                </div>
            </div>
            <div class="dialog-body">
                <form-input
                    label="D-Day 이름"
                    name="name"
                    :value="ddayName"
                    placeholder="20자 까지 가능합니다"
                    @inputval="setDDayName"
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
        pk: -1,
        dday: luxon.DateTime.local(),
        ddayName: '',
        showPicker: false,
        formLocker: false,
        isModify: false
    },

    methods: {
        show: function(isModify) {
            var DateTime = luxon.DateTime;
            if(isModify) {
                this.pk = _dday.$data.ddays[_dday.$data.cursor].pk;
                this.dday = DateTime.fromISO(_dday.$data.ddays[_dday.$data.cursor].fields.dday);
                this.ddayName = _dday.$data.ddays[_dday.$data.cursor].fields.day_name;
                this.isModify = true;
            }
            this.status = 'show';
            _submenu.close()
        },

        hide: function() {
            this.status = 'hide';
        },

        pickerHandler: function() {
            this.showPicker = !this.showPicker;
        },

        setDDayName: function(ddayName) {
            this.ddayName = ddayName;
        },

        submitDate: function(pickDate) {
            this.dday = pickDate;
            this.showPicker = false;
        },

        save: function() {
            var data = this.getFormData();
            if(this.formLocker) {
                return;
            } else {
                this.formLocker = true;
            }

            if(!this.valid(data)) {
                return;
            }

            axios({
                method: 'post',
                url: 'save',
                headers: {
                    'X-CSRFToken': document.querySelector('input[name=csrfmiddlewaretoken]').value
                },
                data: data
            })
            .then(this.submitCallback)
            .catch(this.failCallback);
        },

        getFormData: function() {
            return {
                pk: this.pk,
                day_name: document.querySelector('.dialog input[name=name]').value,
                dday: document.querySelector('.dialog input[name=dday]').value
            }
        },

        submitCallback: function(res) {
            if(res.status === 200 && res.data.result === 'SUCCESS') {
                alert('저장되었습니다');
                location.reload();
            } else {
                alert('저장할 수 없습니다.');
            }
            this.formLocker = false;
        },

        failCallback: function(err) {
            console.error(err);
            this.formLocker = false;
        },

        valid: function(data) {
            if(data.day_name == null || data.day_name === '') {
                alert('D day 이름을 입력해주세요!');
                return false;
            }

            if(data.dday == null || data.dday === '') {
                alert('날짜를 입력해주세요!');
                return false;
            }

            return true;
        }
    }
});
