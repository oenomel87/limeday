_join = new Vue({
    el: '.dialog',

    template: `
        <div class="dialog" :style="dialogStatus">
            <div class="dialog-head">
                <div class="close-btn">
                    <i class="material-icons" @click="hide">close</i>
                </div>
                <div class="dialog-title">
                    <span>회원가입</span>
                </div>
                <div class="save-btn">
                    <span @click="join">가입하기</span>
                </div>
            </div>
            <div class="dialog-body">
                <form-input
                    label="아이디"
                    name="username"
                    :value="username"
                    placeholder="6자 이상 15자 이하의 영문, 숫자"
                    @inputval="setUsername"
                />
                <form-input
                    type="password"
                    label="비밀번호"
                    name="password"
                    :value="password"
                    placeholder="6자 이상 15자 이하의 영문, 숫자"
                    @inputval="setPassword"
                />
                <form-input
                    type="password"
                    label="비밀번호 확인"
                    name="confirm"
                    :value="password"
                    placeholder="6자 이상 15자 이하의 영문, 숫자"
                    @inputval="setConfirm"
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
        status: 'hide',
        username: '',
        password: '',
        confirm: ''
    },

    methods: {
        show: function() {
            this.status = 'show';
        },

        hide: function() {
            this.status = 'hide';
            _login.$data.username = '';
            _login.$data.password = '';
        },

        setUsername: function(username) {
            this.username = username;
        },

        setPassword: function(password) {
            this.password = password;
        },

        setConfirm: function(confirm) {
            this.confirm = confirm;
        },

        join: function() {
            
        }
    }
});
