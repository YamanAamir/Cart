const Cookies = {
    set: (name, value, options = {}) => {
        let expires = "";
        if (options.expires) {
            const days = options.expires;
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (JSON.stringify(value) || "") + expires + "; path=/";
    },

    get: (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) {
                try {
                    return JSON.parse(c.substring(nameEQ.length, c.length));
                } catch (e) {
                    return c.substring(nameEQ.length, c.length);
                }
            }
        }
        return null;
    }
};

export default Cookies;
