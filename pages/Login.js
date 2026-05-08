export class LoginPage {
    constructor(page) {
        this.page = page;

        // Locators
        this.emailInput = page.locator('#email');
        this.nextButton = page.locator('#check_login_type');
        this.passwordInput = page.locator('#password:visible');
        this.loginButton = page.locator('#login_form_submit_button');
        this.errorMsg = page.locator('#infoMessage:visible');
        this.forgotPasswordLink = page.locator('a[href*="forgot_password"]');
        this.backButton = page.locator('#back_to_email');
        this.validationMsg = page.getByText('Please enter valid email id.');
    }

    async goto(url) {
        await this.page.goto(url);
    }

    async enterEmail(email) {
        await this.emailInput.fill(email);
    }

    async clickNext() {
        await this.nextButton.click();
    }

    async enterPassword(password) {
        await this.passwordInput.fill(password);
    }

    async clickLogin() {
        await this.loginButton.click();
    }

    async clickForgotPassword() {
        await this.forgotPasswordLink.click();
    }

    async clickBack() {
        await this.backButton.click();
    }
}