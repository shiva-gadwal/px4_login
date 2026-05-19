export class CompanyPage {
    constructor(page) {
        this.page = page;

        this.selectCompany = page.getByRole('button', { name: 'Select' }).nth(1);
        this.topRightMenu = page.locator('#toprightmenu', { hasText: 'Automation1 User' });
        this.logoutBtn = page.locator('#session_logout');
    }

    async select() {
        await this.selectCompany.click();
    }

    async logout() {
        await this.topRightMenu.waitFor({ state: 'visible',timeout: 60000 });
        await this.topRightMenu.click();
        await this.logoutBtn.waitFor({ state: 'visible' });
        await this.logoutBtn.click();
    }
}