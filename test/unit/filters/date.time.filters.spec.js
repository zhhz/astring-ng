describe('secondsToTime filter', function(){
  beforeEach(module('a-string'));

  var filter;
  // NOTE: you have to use secondsToTime***Filter***
  // angular adds the Filter automaticly, even you defined your filter as
  // secondsToTime
  beforeEach(inject(function(secondsToTimeFilter){
    filter = secondsToTimeFilter;
  }));

  it('should return time format', function(){
    expect(filter(12)).toBe('00:00:12');
    expect(filter(59)).toBe('00:00:59');
    expect(filter(61)).toBe('00:01:01');
    expect(filter(135)).toBe('00:02:15');
    expect(filter(3591)).toBe('00:59:51');
    expect(filter(3600)).toBe('01:00:00');
    expect(filter(3695)).toBe('01:01:35');
  });
});
