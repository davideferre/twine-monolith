import { Pages } from '../pages';


describe('Pages', () => {
  describe('matchPath', () => {
    test('matches a static url: /activities', () => {
      const match = Pages.matchPath('/activities');
      expect(match).toEqual(expect.objectContaining({
        url: '/activities',
        title: 'Activities',
      }));
    });

    test('matches a static url: /', () => {
      const match = Pages.matchPath('/');
      expect(match).toEqual(expect.objectContaining({
        url: '/',
        title: 'Home',
      }));
    });

    test('matches a static url: /password/forgot', () => {
      const match = Pages.matchPath('/password/forgot');
      expect(match).toEqual(expect.objectContaining({
        url: '/password/forgot',
        title: 'Forgot Password',
      }));
    });

    test('matches a dynamic url: /error/400', () => {
      const match = Pages.matchPath('/error/400');
      expect(match).toEqual(expect.objectContaining({
        url: '/error/:code',
        title: 'Error',
      }));
    });

    test('matches a dynamic url: /error/404', () => {
      const match = Pages.matchPath('/error/404');
      expect(match).toEqual(expect.objectContaining({
        url: '/error/:code',
        title: 'Error',
      }));
    });

    test('matches a dynamic url: /error/500', () => {
      const match = Pages.matchPath('/error/500');
      expect(match).toEqual(expect.objectContaining({
        url: '/error/:code',
        title: 'Error',
      }));
    });

    test('matches a dynamic url: /password/reset/', () => {
      const match = Pages.matchPath('/password/reset/fe89hugn0183ubg0hofnq3p40?email=foo@bar.com');
      expect(match).toEqual(expect.objectContaining({
        url: '/password/reset/:token',
        title: 'Reset Password',
      }));
    });
  });

  describe('getNavbarLinks', () => {
    test('Returns pages in the correct order', () => {
      expect(Pages.getNavbarLinks().map((p) => p.title)).toEqual([
        'Home',
        'Time',
        'Activities',
        'Volunteers',
        'Projects',
        'FAQs',
      ]);
    });
  });
});
