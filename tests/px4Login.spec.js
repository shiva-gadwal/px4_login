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

let context, page;
let login, forgot, verify, company;

test.beforeAll(async ({ browser }) => {
    console.log("BEFORE ALL STARTED");

    context = await browser.newContext();
    page = await context.newPage();

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    login = new LoginPage(page);
    forgot = new ForgotPasswordPage(page);
    verify = new VerificationPage(page);
    company = new CompanyPage(page);
});

test('Empty Email', async () => {
    await expect(login.emailInput).toBeVisible();
    await login.enterEmail('');
    await login.clickNext();
    await expect(login.validationMsg).toBeVisible();
});

test('Invalid Email', async () => {
    await login.enterEmail('abc');
    await login.clickNext();
    await expect(login.validationMsg).toBeVisible();
});

test('Go to Password Page', async () => {
    await login.enterEmail(EMAIL);
    await login.clickNext();
    await expect(login.passwordInput).toBeVisible();
});

test('Incorrect Password', async () => {
    await login.enterPassword(WRONG_PASSWORD);
    await login.clickLogin();
    await expect(login.errorMsg).toContainText("Username/Password is Incorrect");
});

test('Back to Email Page', async () => {
    await login.enterEmail(EMAIL);
    await login.clickNext();
    await login.clickBack();
    await expect(login.emailInput).toBeVisible();
});

test('Go to Forgot Password', async () => {
    await login.enterEmail(EMAIL);
    await login.clickNext();
    await login.clickForgotPassword();

    await expect(page).toHaveURL(/forgot_password/);
});

test('Forgot - Empty Email', async () => {
    await forgot.enterEmail('');
    await forgot.submit();
    await expect(forgot.validationMsg).toBeVisible();
});

test('Forgot - Invalid Email', async () => {
    await forgot.enterEmail('abc');
    await forgot.submit();
    await expect(forgot.validationMsg).toBeVisible();
});

test('Forgot - Valid Email', async () => {
    await forgot.enterEmail(FORGOT_EMAIL);
    await forgot.submit();
    await expect(forgot.resetMsg).toContainText("If this email exists");
});

test('Back to Login from Forgot', async () => {
    await forgot.goBackToLogin();
    await expect(login.emailInput).toBeVisible();
});

test('Go to Verification Page', async () => {
    await login.enterEmail(EMAIL);
    await login.clickNext();
    await login.enterPassword(PASSWORD);
    await login.clickLogin();

    await expect(verify.verificationCode).toBeVisible();
});

test('Invalid Verification Code', async () => {
    await verify.enterCode("123456789");
    await verify.submit();
});

test('Empty Verification Code', async () => {
    await verify.enterCode('');
    await verify.submit();
    await expect(page.getByText("Please Enter Verification Code.")).toBeVisible();
});

test('Resend Code', async () => {
    await verify.resend();
    await expect(verify.resendMsg).toBeVisible();
});

test('Final Successful Login', async () => {
    await verify.enterCode(VERIFICATION_CODE);
    await verify.submit();

    await company.select();
    await expect(page).toHaveURL(/resources/);
});

test('Logout', async () => {
    await company.logout();
    await expect(page).toHaveURL(BASE_URL + "index.php/");
});

