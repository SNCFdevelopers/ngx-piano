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

  test('should set not persistent property correctly and not send a second event', async ({page}) => {
    await page.goto('http://localhost:4200/test');

    let pianoFirstActionClickRequestPromise = page.waitForRequest(request => {
      return (request.url().startsWith('https://your-collect-domain/event?s=your-site-id')
        && request.postDataJSON()['events'][0]['name'] == 'click.action'
        && request.postDataJSON()['events'][0]['data']['click'] == 'some_action'
        && request.postDataJSON()['events'][0]['data']['property_name'] === 'value'
      );
    }, {timeout: 10_000});
    await page.getByTestId('set-not-persistent-property-service-call').click();
    await page.getByText('Add Action').click();
    let pianoFirstRequestActionClick = await pianoFirstActionClickRequestPromise;
    expect(pianoFirstRequestActionClick).toBeDefined();

    let pianoSecondActionClickRequestPromise = page.waitForRequest(request => {
      return (request.url().startsWith('https://your-collect-domain/event?s=your-site-id')
        && request.postDataJSON()['events'][0]['name'] == 'click.action'
        && request.postDataJSON()['events'][0]['data']['click'] == 'some_action'
        && request.postDataJSON()['events'][0]['data']['property_name'] === 'value'
      );
    }, {timeout: 5000}).catch(() => {});
    await page.getByText('Add Action').click();
    let pianoSecondRequestClickActionClick = await pianoSecondActionClickRequestPromise;
    expect(pianoSecondRequestClickActionClick).toBeUndefined();
  });

  test('should set persistent property correctly and only for specific events', async ({page}) => {
    await page.goto('http://localhost:4200/test');
    await page.getByTestId('set-persistent-property-service-call').click();

    await page.getByText('Add Action').click();
    const pianoRequestActionClickPromise = page.waitForRequest(request => {
      return (request.url().startsWith('https://your-collect-domain/event?s=your-site-id')
        && request.postDataJSON()['events'][0]['name'] == 'click.action'
        && request.postDataJSON()['events'][0]['data']['click'] == 'some_action'
        && request.postDataJSON()['events'][0]['data']['property_name'] === 'value')
    }, {timeout: 5000});
    let firstRequestActionClick = await pianoRequestActionClickPromise.catch(() => {});
    expect(firstRequestActionClick).toBeUndefined();


    let pianoRequestDownloadClickPromise = page.waitForRequest(request => {
      return (request.url().startsWith('https://your-collect-domain/event?s=your-site-id')
        && request.postDataJSON()['events'][0]['name'] == 'click.download'
        && request.postDataJSON()['events'][0]['data']['click'] == 'pdf'
        && request.postDataJSON()['events'][0]['data']['property_name'] === 'value')
    }, {timeout: 10_000});
    await page.getByText('Add Download Action').click();
    let firstRequestDownloadClick = await pianoRequestDownloadClickPromise;
    expect(firstRequestDownloadClick).toBeDefined();

    let pianoSecondRequestDownloadClickPromise = page.waitForRequest(request => {
      return (request.url().startsWith('https://your-collect-domain/event?s=your-site-id')
        && request.postDataJSON()['events'][0]['name'] == 'click.download'
        && request.postDataJSON()['events'][0]['data']['click'] == 'pdf'
        && request.postDataJSON()['events'][0]['data']['property_name'] === 'value')
    }, {timeout: 10_000});
    await page.getByText('Add Download Action').click();
    let secondRequestDownloadClick = await pianoSecondRequestDownloadClickPromise;
    expect(secondRequestDownloadClick).toBeDefined();
  });
  test('should send a nav event with custom title when navigate to "ngx-piano-router-metadata" route', async ({page}) => {
    await page.goto('http://localhost:4200/test');
    const pianoNavToTestRouteEventRequestPromise = page.waitForRequest(request => {
      return (request.url().startsWith('https://your-collect-domain/event?s=your-site-id')
        && request.postDataJSON()['events'][0]['name'] == 'page.display'
        && request.postDataJSON()['events'][0]['data']['page'] == 'Page de test route metadata'
        && request.postDataJSON()['events'][0]['data']['page_chapter1'] == 'Test'
      );
    }, {timeout: 10_000});
    await page.goto('http://localhost:4200/ngx-piano-router-metadata');
    await pianoNavToTestRouteEventRequestPromise;
  });
});

