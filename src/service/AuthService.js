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

        // Yanıtın JSON olup olmadığını kontrol et
        const textResponse = await response.text();  // Yanıtı metin olarak al
        if (!textResponse) {
            throw new Error('Empty response from server');
        }

        // Geçerli JSON dönüştürme
        try {
            return JSON.parse(textResponse);  // JSON'a dönüştürmeye çalış
        } catch (e) {
            throw new Error('Invalid JSON response');
        }
    },



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
