import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContextpackService } from './contextpack.service';
import { ContextPack, WordPack, Words } from './contextpack';

// Test Context Packs courtesy of the purple tigers @ https://github.com/UMM-CSci-3601-S21/it-1-purple-tigers
describe('ContextpackService', () => {
  // A small collection of test contextpacks
  const noun: Words = {
    word: 'you',
    forms: ['you', 'yos']
  };
  const adjective: Words = {
    word: 'green',
    forms: ['green', 'greener']
  };
  const verb: Words = {
    word: 'ran',
    forms: ['ran', 'running']
  };
  const misc: Words = {
    word: 'langerhans',
    forms: ['langerhans']
  };

  const testNouns: Words[] = [noun];
  const testVerbs: Words[] = [verb];
  const testAdjectives: Words[] = [adjective];
  const testMisc: Words[] = [misc];
  const testWordPacks: WordPack[] =[
    {
      name: 'happy',
      enabled: false,
      nouns: testNouns,
      verbs: testVerbs,
      adjectives: testAdjectives,
      misc: testMisc
    }
  ];

  const testContextPacks: ContextPack[] =
    [
      {
        _id: 'chris_id',
        name: 'fun',
        icon: 'http://placehold.it/32x32',
        enabled: true,
        wordPacks: testWordPacks
      },
      {
        _id: 'pat_id',
        name: 'sun',
        icon: 'http://placehold.it/32x32',
        enabled: true,
        wordPacks: testWordPacks
      },
      {
        _id: 'jamie_id',
        name: 'happy',
        icon: 'http://placehold.it/32x32',
        enabled: true,
        wordPacks: testWordPacks
      }
  ];
  let service: ContextpackService;
  let contextpackService: ContextpackService;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    contextpackService = new ContextpackService(httpClient);
  });


  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getContextPack() calls api/contextpacks', () => {
    // Assert that the contextpacks we get from this call to getContextPacks()
    // should be our set of test contextpacks. Because we're subscribing
    // to the result of getContextPacks(), this won't actually get
    // checked until the mocked HTTP request 'returns' a response.
    // This happens when we call req.flush(testContextPacks) a few lines
    // down.
    contextpackService.getContextPacks().subscribe(
      contextpacks => expect(contextpacks).toBe(testContextPacks)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(contextpackService.contextPacksUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testContextPacks);
  });

  it('gets a context pack given its id', () =>{
    const targetPack: ContextPack = testContextPacks[1];
    const targetId: string = targetPack._id;
    contextpackService.getContextPackById(targetId).subscribe(
      contextPack => expect(contextPack).toBe(targetPack)
      );

      const expectedUrl: string = contextpackService.contextPacksUrl + '/' + targetId;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');
      req.flush(targetPack);
    });

    it('addContextPack() posts to api/contextpacks', () => {

      contextpackService.addContextPack(testContextPacks[1]).subscribe(
        id => expect(id).toBe('testID')
      );

      const req = httpTestingController.expectOne(contextpackService.contextPacksUrl);

      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testContextPacks[1]);

      req.flush({id: 'testID'});
    });

    it('filterContextPack() filters by name', () => {
      expect(testContextPacks.length).toBe(3);
      const userName = 'u';
      expect(contextpackService.filterContextPacks(testContextPacks, { name: userName }).length).toBe(2);
    });
});
