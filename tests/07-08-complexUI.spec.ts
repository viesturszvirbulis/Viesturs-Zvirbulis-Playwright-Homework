import { test, expect } from '@playwright/test';
import { AlertsPage } from '../pages/theInternetHerokuApp/AlertsPage';
import { ModalsPage } from '../pages/theInternetHerokuApp/ModalsPage';
import { WindowsPage } from '../pages/theInternetHerokuApp/WindowsPage';
import { UploadPage } from '../pages/theInternetHerokuApp/UploadPage';
import { DownloadPage } from '../pages/theInternetHerokuApp/DownloadPage';
import { NestedFrames } from '../pages/theInternetHerokuApp/NestedFrames';

test.describe('JS Dialogs', () => {
    test('waitForEvent dialog - inspect type and message before handling', async ({ page }) => {
        const alertsPage = new AlertsPage(page);

        await alertsPage.goto();

        const dialogPromise = page.waitForEvent('dialog');

        alertsPage.clickAlertButton();

        const dialog = await dialogPromise;

        await alertsPage.assertDialogType(dialog, 'alert');
        await alertsPage.assertDialogMessage(dialog, 'I am a JS Alert');

        await dialog.accept();

        await alertsPage.assertResult('You successfully clicked an alert');
    });
});


test.describe('DOM Modals', () => {
    test('cliking the Close button hides the DOM Modal', async ({ page }) => {
        const modalsPage = new ModalsPage(page);

        await modalsPage.goto();
        await modalsPage.assertModalVisible();
        await modalsPage.clickCloseModalButton();
        await modalsPage.assertModalHidden();
    });
});

test.describe('File upload and file download', () => {
    test('File upload', async ({ page }) => {
        const uploadPage = new UploadPage(page);
        await uploadPage.goto();

        await uploadPage.uploadFile('utils/uploadExample.txt');
        await uploadPage.clickUploadButton();

        await uploadPage.assertUploadSuccess();
        await uploadPage.assertUploadedFileName('uploadExample.txt');
    });

    test('File download', async ({ page }) => {
        const downloadPage = new DownloadPage(page);
        await downloadPage.goto();

        const [download] = await Promise.all([
            page.waitForEvent('download'),
            downloadPage.clickFirstFileLink()
        ]);

        await downloadPage.asertFileSaved(download);
        
    });
});

test.describe('New Windows / Popups', () => {
    test('Capture the new window / popup before it opens', async ({ page }) => {
        const windowsPage = new WindowsPage(page);

        await windowsPage.goto();

        const [popup] = await Promise.all([
            page.waitForEvent('popup'),
            windowsPage.clickNewWindowLink()
        ]);

        await popup.waitForLoadState();
        
        const newWindowPage = new WindowsPage(popup);
        await newWindowPage.assertPageHeading('New Window');
    });
});

test.describe('Nested frames and iFrames', () => {
    test('Nested frames', async ({ page }) => {
        const nestedFrames = new NestedFrames(page);

        await nestedFrames.goto();

        await nestedFrames.assertFrameContains('frame-left', 'LEFT');
        await nestedFrames.assertFrameContains('frame-middle', 'MIDDLE');
        await nestedFrames.assertFrameContains('frame-right', 'RIGHT');
    });
test('confirm dialog - user accepts', async ({ page }) => {
        const alertsPage = new AlertsPage(page);
        await alertsPage.goto();

        const dialogPromise = page.waitForEvent('dialog');
        alertsPage.clickConfirmButton();
        const dialog = await dialogPromise;

        await alertsPage.assertDialogType(dialog, 'confirm');
        await dialog.accept();

        await alertsPage.assertResult('You clicked: Ok');
    });

    test('confirm dialog - user dismisses', async ({ page }) => {
        const alertsPage = new AlertsPage(page);
        await alertsPage.goto();

        const dialogPromise = page.waitForEvent('dialog');
        alertsPage.clickConfirmButton();
        const dialog = await dialogPromise;

        await alertsPage.assertDialogType(dialog, 'confirm');
        await dialog.dismiss();

        await alertsPage.assertResult('You clicked: Cancel');
    });

    test('prompt dialog - user enters text and accepts', async ({ page }) => {
        const alertsPage = new AlertsPage(page);
        await alertsPage.goto();

        const dialogPromise = page.waitForEvent('dialog');
        alertsPage.clickPromptButton();
        const dialog = await dialogPromise;

        await alertsPage.assertDialogType(dialog, 'prompt');
        await dialog.accept('This is an input for the prompt dialog!');

        await alertsPage.assertResult('You entered: asd');
    });
});