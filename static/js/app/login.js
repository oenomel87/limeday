_login = new Vue({
    el: '#login-form',

    template: `
        <div id="login-form">
            <form-input
                label="아이디"
                name="username"
                :value="username"
                placeholder="아이디를 입력해주세요"
                @inputval="setUsername"
            />
            <form-input
                label="비밀번호"
                type="password"
                name="password"
                :value="password"
                placeholder="비멀번호를 입력해주세요"
                @inputval="setPassword"
            />
        </div>
    `,

    data: {
        username: '',
        password: ''
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