import { test, expect } from '@playwright/test';
import { pianoScriptContent } from './api-content-mock';

test.describe('Test suite with piano script', () => {
    test.beforeEach(async ({page}) => {
        await page.route('https://tag.aticdn.net/piano-analytics.js', async route => {
            await route.fulfill({body: pianoScriptContent});
        });
    });

    test('the piano script is correctly loaded', async ({page}) => {
        await page.goto('http://localhost:4200');
        await expect(page.locator('script[src="https://tag.aticdn.net/piano-analytics.js"]')).toHaveCount(1);
    });

    test('should send an event at the first load', async ({page}) => {
        const pianoEventRequestPromise = page.waitForRequest(request => {
                return (request.url().startsWith('https://your-collect-domain/event?s=your-site-id')
                    && request.postDataJSON()['events'][0]['name'] == 'page.display'
                    && request.postDataJSON()['events'][0]['data']['page'] == '/');
            }
            , {timeout: 10_000});
        await page.goto('http://localhost:4200');
        await pianoEventRequestPromise;
    });

    test('should send an nav event when navigate on different routes with the Angular router', async ({page}) => {
        await page.goto('http://localhost:4200/test');
        const pianoNavToTestRouteEventRequestPromise = page.waitForRequest(request => {
                return (request.url().startsWith('https://your-collect-domain/event?s=your-site-id')
                    && request.postDataJSON()['events'][0]['name'] == 'page.display'
                    && request.postDataJSON()['events'][0]['data']['page'] == '/a');
            }
            , {timeout: 10_000});
        await page.getByText('navigate to Page A').click();
        await pianoNavToTestRouteEventRequestPromise;
    });

    test('should send an action event when click on button where ngxPianoTrackClick directive is attached', async ({page}) => {
        await page.goto('http://localhost:4200/test');
        const pianoNavToTestRouteEventRequestPromise = page.waitForRequest(request => {
                return (request.url().startsWith('https://your-collect-domain/event?s=your-site-id')
                    && request.postDataJSON()['events'][0]['name'] == 'click.action'
                    && request.postDataJSON()['events'][0]['data']['click'] == 'some_action');
            }
            , {timeout: 10_000});
        await page.getByText('Add Action').click();
        await pianoNavToTestRouteEventRequestPromise;
    })

    test('should send a custom event when call sendEvent method of PianoTracker service', async ({page}) => {
      await page.goto('http://localhost:4200/test');
      const pianoCustomEventRequestPromise = page.waitForRequest(request => {
          return (request.url().startsWith('https://your-collect-domain/event?s=your-site-id')
            && request.postDataJSON()['events'][0]['name'] == 'search.value'
            && request.postDataJSON()['events'][0]['data']['value'] == 'some_value');
        }
        , {timeout: 10_000});
      await page.getByTestId('send-custom-event-service-call').click();
      await pianoCustomEventRequestPromise;
    });
  test('should not send an nav event when navigate on excluded routes with the Angular router', async ({page}) => {
    await page.goto('http://localhost:4200/excluded-route');
    const pianoEventRequestPromise = page.waitForRequest(request => {
        return (request.url().startsWith('https://your-collect-domain/event?s=your-site-id')
          && request.postDataJSON()['events'][0]['name'] == 'page.display'
          && request.postDataJSON()['events'][0]['data']['page'] == '/excluded-route');
      }
      , {timeout: 5000});
    let request = await pianoEventRequestPromise.catch(() => {});
    expect(request).toBeUndefined();
  });
});

