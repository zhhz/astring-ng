var pos = require('../pageobjects')();

describe('Metronome panel on home screen', function(){
  beforeEach(function(){
    pos.open();
    pos.sleep(5000);
  });

  it('should sleep and wait for sound fonts loaded', function(){
    //FIXME: this is very fragile
    expect(pos.soundFontScript().getInnerHtml()).toContain('MIDI.Soundfont.acoustic_grand_piano');
  });

  it('should be able to start/stop metronome', function(){
    var startBtn = pos.startBtn();

    // start / stop
    startBtn.click(); // start
    expect(startBtn.getAttribute('class')).toContain('btn btn-lg btn-success btn-danger');
    pos.sleep(2000);
    startBtn.click(); // stop
    expect(startBtn.getAttribute('class')).toContain('btn btn-lg btn-success');
    expect(pos.elapse().getText()).toEqual('00:00:02');

    // beats up /down
    expect(pos.beatsCount()).toEqual(4);
    pos.upBtn().click();
    expect(pos.beatsCount()).toEqual(5);
    pos.upBtn().click();
    expect(pos.beatsCount()).toEqual(6);
    pos.upBtn().click();
    expect(pos.beatsCount()).toEqual(7);
    pos.upBtn().click();
    expect(pos.beatsCount()).toEqual(8);
    pos.upBtn().click();
    expect(pos.beatsCount()).toEqual(8);
    pos.upBtn().click();
    expect(pos.beatsCount()).toEqual(8);

    pos.downBtn().click();
    expect(pos.beatsCount()).toEqual(7);
    pos.downBtn().click();
    expect(pos.beatsCount()).toEqual(6);
    pos.downBtn().click();
    expect(pos.beatsCount()).toEqual(5);
    pos.downBtn().click();
    expect(pos.beatsCount()).toEqual(4);
    pos.downBtn().click();
    expect(pos.beatsCount()).toEqual(3);
    pos.downBtn().click();
    expect(pos.beatsCount()).toEqual(2);
    pos.downBtn().click();
    expect(pos.beatsCount()).toEqual(2);

    // test play song
    pos.createTodo();
    expect(pos.metroBtn().isEnabled()).toBeTruthy();
    expect(pos.melodyBtn().isEnabled()).toBeFalsy();
    expect(pos.accompanyBtn().isEnabled()).toBeFalsy();
    // highlight
    pos.activeTodoList().get(0).click();
    pos.sleep(1000);
    expect(pos.metroBtn().isEnabled()).toBeTruthy();
    expect(pos.melodyBtn().isEnabled()).toBeTruthy();
    expect(pos.accompanyBtn().isEnabled()).toBeTruthy();

  });


});
