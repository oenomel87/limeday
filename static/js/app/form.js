Vue.component('calendar', {

    props: ['init', 'calendar'],

    template: `
        <div class="calendar">
            <div class="picker-nav">
                <div @click="prev">
                    <i class="material-icons">chevron_left</i>
                </div>
                <div class="month">{{ calendar.year }}. {{ calendar.monthLong }}</div>
                <div @click="next">
                    <i class="material-icons">chevron_right</i>
                </div>
            </div>
            <div class="weekdays-wrap">
                <div class="weekdays">
                    <div>일</div>
                    <div>월</div>
                    <div>화</div>
                    <div>수</div>
                    <div>목</div>
                    <div>금</div>
                    <div>토</div>
                </div>
            </div>
            <div class="days">
                <div class="week" v-for="week in days">
                    <template v-for="day in week">
                        <div v-if="day !== null"
                            :class="dayStatus(day)"
                            @click="pickDate"
                            :data-day="day.day"
                        >
                                <div>{{ day.day }}</div>
                            </div>
                        <div v-else></div>
                    </template>
                </div>
            </div>
        </div>
    `,

    computed: {
        days: function() {
            return this.daysInMonth();
        }
    },

    methods: {
        daysInMonth: function() {
            var days = [];
            var firstDay = this.getWeekDay(luxon.DateTime.local(this.calendar.year, this.calendar.month, 1).weekday);
            var day = 1;
            while(true) {
                var week = [];
                for(var i = 0; i < 7; i++) {
                    if((day === 1 && firstDay === i)
                        || (day > 1 && day <= this.calendar.daysInMonth)) {
                        week.push(luxon.DateTime.local(this.calendar.year, this.calendar.month, day));
                        day++;
                    } else {
                        week.push(null);
                    }
                }
                days.push(week);
                if(day > this.calendar.daysInMonth) {
                    break;
                }
            }
            return days;
        },

        dayStatus: function(day) {
            if(this.init.toFormat('y-MM-dd') === day.toFormat('y-MM-dd')) {
                return {
                    initday: true
                }
            }
        },

        pickDate: function(evt) {
            var target = evt.currentTarget;
            if(document.querySelector('#datepicker .pick') !== null) {
                document.querySelector('#datepicker .pick').classList.remove('pick');
            }
            target.classList.add('pick');
            this.$emit('pickdate', luxon.DateTime.local(this.calendar.year, this.calendar.month, Number(target.dataset.day)));
        },

        getWeekDay: function(weekday) {
            return weekday === 7 ? 0 : weekday;
        },

        prev: function() {},

        next: function() {}
    }
});

Vue.component('datepicker', {

    props: ['init', 'status'],

    template: `
        <div id="datepicker" v-show="status">
            <div class="background" @click="closePicker"></div>
            <div class="picker-wrap">
                <div class="picker">
                    <div class="picker-head">
                        <p class="year">{{ calendar.year }}</p>
                        <p class="date">{{ pickedDateStr }}</p>
                    </div>
                    <div class="picker-body">
                        <calendar :init="init" :calendar="calendar" @pickdate="pickDate" />
                        <div class="btn-wrap">
                            <div @click="closePicker">취소</div>
                            <div @click="submitDate">확인</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    computed: {
        pickedDateStr: function() {
            return `${this.pickedDate.monthLong} ${this.pickedDate.day}일 ${this.pickedDate.weekdayLong}`
        }
    },

    data: function() {
        return {
            pickedDate: this.init,
            calendar: this.init
        }
    },

    methods: {
        closePicker: function() {
            this.$emit('closepicker');
        },

        pickDate: function(date) {
            this.pickedDate = date;
            this.$emit('pickdate', date);
        },

        submitDate: function() {
            this.$emit('submitdate', this.pickedDate);
        }
    }
});

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
                    <span>저장</span>
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
        showPicker: false
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
        }
    }
});
