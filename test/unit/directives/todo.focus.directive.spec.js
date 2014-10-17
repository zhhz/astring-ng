describe('todoFocus directive', function () {
  beforeEach(module('a-string'));

  var scope, compile, browser;

  beforeEach(inject(function ($rootScope, $compile, $browser) {
    scope = $rootScope.$new();
    compile = $compile;
    browser = $browser;
  }));

  it('should focus on truthy expression', function () {
    var el = angular.element('<input as-focus="focus">');
    scope.focus = false;

    compile(el)(scope);
    expect(browser.deferredFns.length).toBe(0);

    scope.$apply(function () {
      scope.focus = true;
    });

    expect(browser.deferredFns.length).toBe(1);
  });
});
