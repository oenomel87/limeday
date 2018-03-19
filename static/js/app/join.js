_join = new Vue({
    el: '.dialog',

    template: `
        <div class="dialog join" :style="dialogStatus">
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
            if(this.locker) {
                return;
            } else {
                this.locker = true;
            }
            axios({
                method: 'post',
                url: '/id',
                headers: {
                    'X-CSRFToken': document.querySelector('input[name=csrfmiddlewaretoken]').value
                },
                data: { username: document.querySelector('.dialog input[name=username]').value }
            })
            .then(this.idCheck)
            .catch(this.failCallback);
        },

        idCheck: function(res) {
            if(res.data.result === 'POSSIBLE') {
                this.usernameValid = { valid: true, message: '사용 가능한 아이디 입니다.' };
            } else {
                this.usernameValid = { valid: false, message: '이미 사용중인 아이디 입니다.' };
            }
            this.locker = false;
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
            if(this.locker) {
                return;
            }
            var data = {
                username: this.username,
                password: this.password
            }
            if(this.valid()) {
                this.locker = true;
                axios({
                    method: 'post',
                    url: '/join',
                    headers: {
                        'X-CSRFToken': document.querySelector('input[name=csrfmiddlewaretoken]').value
                    },
                    data: data
                })
                .then(this.submitCallback)
                .catch(this.failCallback);
            } else {
                alert('입력하신 아이디 / 비밀번호를 확인해주세요.')
            }
        },

        submitCallback: function(res) {
            if(res.data.result === 'SUCCESS') {
                alert('가입되었습니다.');
                location.href = '/';
            } else {
                alert('입력하신 아이디 / 비밀번호를 확안해주세요');
            }
            this.locker = false;
        },

        failCallback: function(err) {
            console.error(err);
            this.locker = false;
        },

        valid: function() {
            return this.username.length >= 6 && this.username.length <= 15
                && this.password.length >= 6 && this.password.length <= 15
                && this.password === this.confirm
                && document.querySelectorAll('.dialog.join .error').length === 0;
        }
    }
});
