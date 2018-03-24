_login = new Vue({
    el: '#login-form',

    template: `
        <div id="login-form">
            <form-input
                label="아이디"
                name="username"
                :value="username"
                :options="usernameOptions"
                @inputval="setUsername"
            />
            <form-input
                label="비밀번호"
                type="password"
                name="password"
                :value="password"
                :options="passwordOptions"
                @inputval="setPassword"
            />
        </div>
    `,

    data: {
        username: '',
        password: '',

        usernameOptions: {
            type: 'email',
            placeholder: '아이디를 입력해주세요',
            maxlength: 15
        },

        passwordOptions: {
            type: 'password',
            placeholder: '비밀번호를 입력해주세요',
            maxlength: 15
        }
    },

    methods: {
        setUsername: function(username) {
            this.username = username;
        },

        setPassword: function(password) {
            this.password = password;
        }
    }
})