import { expect, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class IFramePage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    async goto() {
        await this.page.goto('/iframe');
    }

    async dismissReadOnlyWarningIfPresent() {
        const dismissButton = this.page.locator('.tox-notification__dismiss');
        if (await dismissButton.isVisible()) {
            await dismissButton.click();
        }
    }

    async typeInEditor(text: string) {
        const editor = this.page.frameLocator('#mce_0_ifr').locator('#tinymce');
        await editor.click();
        await editor.fill(text);
    }

    async assertEditorContains(text: string) {
        const editor = this.page.frameLocator('#mce_0_ifr').locator('#tinymce');
        await expect(editor).toHaveText(text);
    }
}