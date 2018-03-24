_join = new Vue({
    el: '.dialog.join',

    template: `
        <div class="dialog join" :style="dialogStatus">
            <div class="dialog-head">
                <div class="close-btn">
                    <i class="material-icons" @click="hide">close</i>
                </div>
                <div class="dialog-title">
                    <span>{{ title }}</span>
                </div>
                <div class="save-btn">
                    <span @click="join">{{ buttonTitle }}</span>
                </div>
            </div>
            <div class="dialog-body">
                <form-input
                    label="아이디"
                    name="username"
                    :value="username"
                    :valid="usernameValid"
                    :options="usernameOptions"
                    @inputval="setUsername"
                />
                <form-input
                    label="비밀번호"
                    name="password"
                    :value="password"
                    :valid="passwordValid"
                    :options="passwordOptions"
                    @inputval="setPassword"
                />
                <form-input
                    label="비밀번호 확인"
                    name="confirm"
                    :value="confirm"
                    :valid="passwordConfirmValid"
                    :options="passwordOptions"
                    @inputval="setConfirm"
                />
            </div>
        </div>
    `,

    watch: {
        status: function() {
            if(this.type !== 'join') {
                this.username = this.originUsername;
            } else {
                this.username = '';
            }
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
        },

        title: function() {
            return this.type === 'profile' ? 'My Profile' : 'Sign up';
        },

        buttonTitle: function() {
            return this.type === 'profile' ? '변경하기' : '가입하기';
        },

        originUsername: function() {
            return document.querySelector('.aside aside .subtitle').textContent.replace('@', '');
        }
    },

    data: {
        status: 'hide',
        type: 'join',
        username: '',
        password: '',
        confirm: '',
        usernameValid: { valid: true, message: '' },
        passwordValid: { valid: true, message: '' },
        passwordConfirmValid: { valid: true, message: '' },
        locker: false,

        usernameOptions: {
            type: 'email',
            placeholder: '6자 이상 15자 이하의 영문, 숫자',
            maxlength: 15,
            readonly: true
        },

        passwordOptions: {
            type: 'password',
            placeholder: '6자 이상 15자 이하의 영문, 숫자',
            maxlength: 15
        }
    },

    methods: {
        show: function() {
            this.status = 'show';
        },

        hide: function() {
            this.status = 'hide';
            if(this.type === 'join') {
                _login.$data.username = '';
                _login.$data.password = '';
            }
        },

        profile: function() {
            this.status = 'show';
            this.type = 'profile';
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
            if(this.type === 'profile' && this.username === this.originUsername) {
                this.usernameValid = { valid: true, message: '' };
                return;
            } else if(this.locker) {
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
            } else if(this.valid()) {
                this.signUp();
            } else {
                alert('입력하신 정보를 확인해주세요.')
            }
        },

        signUp: function() {
            this.locker = true;
            axios({
                method: 'post',
                url: this.type === 'join' ? '/join' : 'profile',
                headers: {
                    'X-CSRFToken': document.querySelector('input[name=csrfmiddlewaretoken]').value
                },
                data: {
                    username: this.username,
                    password: this.password
                }
            })
            .then(this.submitCallback)
            .catch(this.failCallback);
        },

        submitCallback: function(res) {
            if(this.type === 'join' && res.data.result === 'SUCCESS') {
                alert('가입되었습니다.');
                location.href = '/';
            } else if(res.data.result === 'SUCCESS') {
                alert('회원 정보가 변경되었습니다.\n다시 로그인해주세요.');
                location.href = 'auth/logout';
            } else {
                alert('입력하신 정보를 확안해주세요');
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
