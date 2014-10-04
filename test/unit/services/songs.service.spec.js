describe("Songs service", function(){
  var books = {
    "Suzuki": {
      "Book1": [ "Etude", "Minuet No. 1" ],
      "Book2": [ "Musette", "Hunters Chorus", "Waltz", "Minuet" ]
    },
    "Panni": {
      "Book1": [ "song1", "song2" ],
      "Book2": [ "song3", "song4" ]
    }
  };

  var songs = [ { category : 'Suzuki', book : 'Book1', title : 'Etude' },
                { category : 'Suzuki', book : 'Book1', title : 'Minuet No. 1' },
                { category : 'Suzuki', book : 'Book2', title : 'Musette' },
                { category : 'Suzuki', book : 'Book2', title : 'Hunters Chorus' },
                { category : 'Suzuki', book : 'Book2', title : 'Waltz' },
                { category : 'Suzuki', book : 'Book2', title : 'Minuet' },
                { category : 'Panni', book : 'Book1', title : 'song1' },
                { category : 'Panni', book : 'Book1', title : 'song2' },
                { category : 'Panni', book : 'Book2', title : 'song3' },
                { category : 'Panni', book : 'Book2', title : 'song4' } ];

  beforeEach(module('a-string'));

  var service, mockBackend;
  beforeEach(inject(function(Songs, $httpBackend){
    service = Songs;
    mockBackend = $httpBackend;
  }));

  it("#getBooks should return all the books", function(){
    mockBackend.expectGET('/api/books').respond(200, books);
    var songsFromBooks;
    service.getBooks().then(function(resolved){songsFromBooks = resolved;});
    mockBackend.flush();

    expect(songsFromBooks).toEqual(songs)
  });

  it("#getSongs should return the songs with the notes", function(){
    mockBackend.expectGET('/api/songs?title=Minuet No. 1').respond(200, 'OK');
    var song;
    service.getSongs({title: 'Minuet No. 1'}).then(function(resolved){song = 'OK';});
    mockBackend.flush();
    expect(song).toEqual('OK');
  });

  afterEach(function(){
    // ensure that all expects set on the $httpBackend were actually called
    mockBackend.verifyNoOutstandingExpectation();
    // ensure that all requests to the server have actually responded (using flush())
    mockBackend.verifyNoOutstandingRequest();
  });
});
