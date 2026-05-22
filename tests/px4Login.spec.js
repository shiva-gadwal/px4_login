import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

import { LoginPage } from '../pages/Login';
import { ForgotPasswordPage } from '../pages/Forgotpasswordpage';
import { VerificationPage } from '../pages/VerificationPage';
import { CompanyPage } from '../pages/companyPage';

dotenv.config();

const BASE_URL = process.env.BASE_URL;
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const WRONG_PASSWORD = process.env.WRONG_PASSWORD;
const FORGOT_EMAIL = process.env.FORGOT_EMAIL;
const VERIFICATION_CODE = process.env.VERIFICATION_CODE;

test.describe.configure({ mode: 'serial' });

test('Login Functionality', async ({ browser }) => {

    test.setTimeout(120000);

    const context = await browser.newContext();
    const page = await context.newPage();

    const login = new LoginPage(page);
    const forgot = new ForgotPasswordPage(page);
    const verify = new VerificationPage(page);
    const company = new CompanyPage(page);

    
   
    await test.step('Open Application', async () => {
        await page.goto(BASE_URL);
        await expect(login.emailInput)
    .toBeVisible();
    });

   
    await test.step('Empty Email Validation', async () => {
        await login.enterEmail('');
        await login.clickNext();

        await expect.soft(login.validationMsg).toBeVisible();
    });

  
    await test.step('Invalid Email Validation', async () => {
        await login.enterEmail('abc');
        await login.clickNext();

        await expect.soft(login.validationMsg).toBeVisible();
    });

    await test.step('Go To Password Page', async () => {
        await login.enterEmail(EMAIL);
        await login.clickNext();

        await expect.soft(login.passwordInput).toBeVisible();
    });

    await test.step('Incorrect Password Validation', async () => {
        await login.enterPassword(WRONG_PASSWORD);
        await login.clickLogin();

        await expect.soft(login.errorMsg)
            .toContainText("Username/Password is Incorrect");
    });


    await test.step('Back to Email Page', async () => {
        await login.enterEmail(EMAIL);
        await login.clickNext();
        await login.clickBack();

        await expect.soft(login.emailInput).toBeVisible();
    });

    
    await test.step('Forgot Password Navigation', async () => {
        await login.enterEmail(EMAIL);
        await login.clickNext();
        await login.clickForgotPassword();

        await expect(page).toHaveURL(/forgot_password/);
    });

    await test.step('Forgot - Empty Email', async () => {
        await forgot.enterEmail('');
        await forgot.submit();

        await expect.soft(forgot.validationMsg).toBeVisible();
    });

    await test.step('Forgot - Invalid Email', async () => {
        await forgot.enterEmail('abc');
        await forgot.submit();

        await expect.soft(forgot.validationMsg).toBeVisible();
    });

    await test.step('Forgot - Valid Email', async () => {
        await forgot.enterEmail(FORGOT_EMAIL);
        await forgot.submit();

        await expect.soft(forgot.resetMsg)
            .toContainText("If this email exists");
    });

    await test.step('Back to Login from Forgot', async () => {
        await forgot.goBackToLogin();

        await expect.soft(login.emailInput).toBeVisible();
    });


    await test.step('Login For Verification', async () => {
        await login.enterEmail(EMAIL);
        await login.clickNext();

        await login.enterPassword(PASSWORD);
        await login.clickLogin();

        await expect(page).toHaveURL(/auth|verification/i, { timeout: 15000 });
    });

    await test.step('Verification Code Flow', async () => {

        await expect(verify.verificationCode).toBeVisible({ timeout: 15000 });

        await verify.enterCode("123456789");
        await verify.submit();

        await verify.enterCode('');
        await verify.submit();

        await expect.soft(
            page.getByText("Please Enter Verification Code.")
        ).toBeVisible();

        await verify.resend();


        await expect.soft(verify.resendMsg).toBeVisible();
    });

    await test.step('Final Successful Login', async () => {

    await expect(verify.verificationCode)
        .toBeVisible({ timeout: 15000 });

    await verify.verificationCode.clear();

    await verify.enterCode(VERIFICATION_CODE);

    await verify.submit();

    await expect(company.selectCompany)
        .toBeVisible({ timeout: 20000 });

    await company.select();

    try {

        await verify.closebutton.waitFor({
            state: 'visible',
            timeout: 3000
        });

        await verify.closeButton();

    } catch {

        console.log("Popup not displayed");

    }

    await expect(page).toHaveURL(/resources/, { timeout: 20000 });

    await expect(company.topRightMenu).toBeVisible({ timeout: 30000 });

});

    await test.step('Logout', async () => {
        await company.logout();

       await expect(page).toHaveURL(BASE_URL + "index.php/");
    });

   await context.close();
});