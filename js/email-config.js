
const EmailConfig = {
    SERVICE_ID: 'service_xy3w3rx',
    TEMPLATE_ID: 'template_4yvqmur',
    PUBLIC_KEY: '8C74msHxteN2DF8NL'
};

window.EmailConfig = EmailConfig;

(function() {
    emailjs.init(EmailConfig.PUBLIC_KEY);
})();