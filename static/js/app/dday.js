
Vue.component('ddays', {

    props: ['ddays', 'cursor'],

    template: `
        <div class="ddays">
            <div class="dday-card">
                <div class="dday">{{ ddayCalc() }}</div>
                <div class="dday-name">{{ ddayName() }}</div>
            </div>
        </div>
    `,

    mounted: function() {
        var self = this;
        var hammer = new Hammer.Manager(document.querySelector('.ddays'));
        var swipe = new Hammer.Swipe({
            direction: Hammer.DIRECTION_HORIZONTAL,
            threshold: 100
        });
        hammer.add([swipe]);
        hammer.on('swipeleft swiperight', function(evt) {
            if(evt.type === 'swipeleft') {
                self.nextCard();
            } else if(evt.type === 'swiperight') {
                self.prevCard();
            }
        });
    },

    methods: {
        ddayCalc: function() {
            if(this.ddays.length === 0) {
                return 'D day를 추가해보세요';
            }
            var DateTime = luxon.DateTime;
            diff = DateTime.fromISO(this.ddays[this.cursor].fields.dday)
                .diff(DateTime.local(), 'days')
                .as('days');
            if(diff === 0) {
                return 'D - day';
            } else if(diff < 0) {
                return 'D + ' + (-1 * diff);
            } else {
                return 'D - ' + Math.floor(diff);
            }
        },

        ddayName: function() {
            if(this.ddays.length === 0) {
                return '';
            }
            return this.ddays[this.cursor].fields.day_name
        },

        changeCard: function(evt) {
            var action = evt.target.dataset.action;
            if(action === 'prev') {
                this.$emit('changecard', this.cursor - 1);
            } else {
                this.$emit('changecard', this.cursor + 1);
            }
        },

        prevCard: function() {
            if(this.cursor === 0) {
                this.$emit('changecard', this.ddays.length - 1);
            } else {
                this.$emit('changecard', this.cursor - 1);
            }
        },

        nextCard: function() {
            if(this.cursor === this.ddays.length -1) {
                this.$emit('changecard', 0);
            } else {
                this.$emit('changecard', this.cursor + 1);
            }
        }
    }
});

_dday = new Vue({
    el: '.body',

    template: `
        <div class="body">
            <ddays
                :ddays="ddays"
                :cursor="cursor"
                @changecard="changeCard"
            />
        </div>
    `,

    created: function() {
        this.getDDays();
    },

    data: {
        ddays: [],
        cursor: 0,
    },

    methods: {
        getDDays: function() {
            var self = this;
            axios.get('ddays')
                .then(function(res) {
                    if(res.status === 200 && res.data.result === 'SUCCESS') {
                        self.ddays = JSON.parse(res.data.ddays);
                    } else {
                        console.error(res.statusText);
                    }
                })
                .catch(function(error) {
                    console.error(error);
                });
        },

        changeCard: function(cursor) {
            this.cursor = cursor;
        }
    }
});
