function loginForm() {
    return {
        username: '',
        password: '',
        users: [],

        async login() {
            this.users = await fetch('data/users.json').then((r) => r.json());

            const user = this.users.find(
                (u) =>
                    u.username === this.username &&
                    u.password === this.password,
            );

            if (!user) return alert('Invalid username or password');

            localStorage.setItem('currentUser', JSON.stringify(user));
            location.href = 'index.html';
        },
    };
}
