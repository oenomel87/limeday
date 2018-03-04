Vue.component('calendar', {

    props: ['init'],

    template: `
        <div class="calendar">
            <div class="picker-nav">
                <div @click="prev">
                    <i class="material-icons">chevron_left</i>
                </div>
                <div class="month">{{ calendar.year }}년 {{ calendar.monthLong }}</div>
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

    data: function() {
        return {
            calendar: this.init,
            today: luxon.DateTime.local()
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
            var dayStr = day.toFormat('y-MM-dd');
            if(this.today.toFormat('y-MM-dd') === dayStr) {
                return {
                    today: true
                }
            } else if(this.init.toFormat('y-MM-dd') === dayStr) {
                return {
                    pick: true
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

        prev: function() {
            this.calendar = this.calendar.plus({months: -1});
        },

        next: function() {
            this.calendar = this.calendar.plus({months: 1});
        }
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
                        <p class="year">{{ pickedDate.year }}</p>
                        <p class="date">{{ pickedDateStr }}</p>
                    </div>
                    <div class="picker-body">
                        <calendar :init="init" @pickdate="pickDate" />
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
            pickedDate: this.init
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
