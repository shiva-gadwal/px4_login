export class VerificationPage {
    constructor(page) {
        this.page = page;

        this.verificationCode = page.locator('#VerificationCode');
        this.submitBtn = page.locator('input[value="Submit"]');
        this.resendCode = page.getByText("Resend code");
        this.resendMsg = page.getByText('Verification code has been sent to your email.');
    }

    async enterCode(code) {
        await this.verificationCode.fill(code);
    }

    async submit() {
        await this.submitBtn.click();
    }

    async resend() {
        await this.resendCode.click();
    }
}