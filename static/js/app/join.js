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
                    :valid="usernameValid"
                    placeholder="6자 이상 15자 이하의 영문, 숫자"
                    @inputval="setUsername"
                />
                <form-input
                    type="password"
                    label="비밀번호"
                    name="password"
                    :value="password"
                    :valid="passwordValid"
                    placeholder="6자 이상 15자 이하의 영문, 숫자"
                    @inputval="setPassword"
                />
                <form-input
                    type="password"
                    label="비밀번호 확인"
                    name="confirm"
                    :value="confirm"
                    :valid="passwordConfirmValid"
                    placeholder="6자 이상 15자 이하의 영문, 숫자"
                    @inputval="setConfirm"
                />
            </div>
        </div>
    `,

    watch: {
        status: function() {
            this.username = '';
            this.password = '';
            this.confirm = '';
            this.usernameValid = { valid: true, message: '' };
            this.passwordValid = { valid: true, message: '' };
            this.passwordConfirmValid = { valid: true, message: '' };
        }
    },

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
        confirm: '',
        usernameValid: { valid: true, message: '' },
        passwordValid: { valid: true, message: '' },
        passwordConfirmValid: { valid: true, message: '' },
        locker: false
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
            this.usernameCheck();
        },

        setPassword: function(password) {
            this.password = password;
            this.passwordCheck();
        },

        setConfirm: function(confirm) {
            this.confirm = confirm;
            this.passwordConfirmCheck();
        },

        usernameCheck: function() {
            if(this.username.length < 6 || this.username.length > 15) {
                this.usernameValid = { valid: false, message: '아이디는 6~15자의 영문, 숫자만 가능 합니다.' };
            } else {
                this.usernameValid = { valid: true, message: '' };
                this.isDuplicate();
            }
        },

        isDuplicate: function() {
            axios({
                method: 'post',
                url: '',
                headers: {
                    'X-CSRFToken': document.querySelector('input[name=csrfmiddlewaretoken]').value
                },
                data: { username: document.querySelector('.dialog input[name=username]').value }
            })
            .then()
            .catch();
        },

        passwordCheck: function() {
            if(this.password.length < 6 || this.password.length > 15) {
                this.passwordValid = { valid: false, message: '비밀번호는 6~15자의 영문, 숫자만 가능 합니다.' };
            } else {
                this.passwordValid = { valid: true, message: '' };
                this.passwordConfirmCheck();
            }
        },

        passwordConfirmCheck: function() {
            if(this.confirm !== this.password) {
                this.passwordConfirmValid = { valid: false, message: '비밀번호를 확인해주세요.' };
            } else {
                this.passwordConfirmValid = { valid: true, message: '' };
            }
        },

        join: function() {
            var data = {
                username: this.username,
                password: this.password
            }
            if(!this.locker && this.valid()) {
                this.locker = true;
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
            }
        },

        submitCallback: function(res) {
            this.locker = false;
        },

        failCallback: function(err) {
            this.locker = false;
        },

        valid: function() {
            return this.username.length >= 6 && this.username.length <= 15
                && this.password.length >= 6 && this.password <= 15
                && this.password === this.confirm;
        }
    }
});
