export class VerificationPage {
    constructor(page) {
        this.page = page;

        this.verificationCode = page.locator('#VerificationCode');
        this.submitBtn = page.locator('input[value="Submit"]');
        this.resendCode = page.getByText("Resend code");
        this.resendMsg = page.getByText('Verification code has been sent to your email.');
        this.closebutton=page.locator("//div[@class='custom-close']");
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

     async closeButton(){
        await this.closebutton.click();
    }
}