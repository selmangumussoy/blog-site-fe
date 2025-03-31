export const AuthService = {
    async login(loginRequest) {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginRequest),
        });

        // Yanıtın düzgün alındığından emin olalım
        if (!response.ok) {
            throw new Error('Login failed');
        }

        // Yanıtı doğrudan JSON olarak alalım
        const data = await response.json(); // JSON olarak veriyi alıyoruz

        if (!data || !data.data || !data.data.token) {
            throw new Error('Invalid response from server or token missing');
        }

        // Token'ı localStorage'a kaydediyoruz
        localStorage.setItem('jwtToken', data.data.token);

        return data;
    }
    ,



    async signUp(singUpRequest) {
        const response = await fetch('http://localhost:8080/auth/sign-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(singUpRequest),
        });

        if (!response.ok) {
            throw new Error('SignUp failed');
        }

        const textResponse = await response.text();
        if (!textResponse) {
            throw new Error('Empty response from server');
        }

        try {
            return JSON.parse(textResponse);
        } catch (e) {
            throw new Error('Invalid JSON response');
        }
    },

};
