export class ForgotPasswordPage {
    constructor(page) {
        this.page = page;

        this.emailInput = page.locator('#email');
        this.forgotSubmitBtn = page.locator('#forgot_password_btn');
        this.resetMsg = page.locator('#res_message .alert');
        this.validationMsg = page.getByText("Please enter valid email");
        this.backToLogin = page.locator('a[href*="auth/login"]');
    }

    async enterEmail(email) {
        await this.emailInput.fill(email);
    }

    async submit() {
        await this.forgotSubmitBtn.click();
    }

    async goBackToLogin() {
        await this.backToLogin.click();
    }
}