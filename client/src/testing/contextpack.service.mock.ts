import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ContextpackService } from '../app/contextpack/contextpack.service';
import { ContextPack, WordPack, Words } from '../app/contextpack/contextpack';
/**
 * A "mock" version of the `ContextpackService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockContextPackService extends ContextpackService {
  static noun: Words = {
    word: 'you',
    forms: ['you', 'yos']
  };
  static adjective: Words = {
    word: 'green',
    forms: ['green', 'greener']
  };
  static verb: Words = {
    word: 'ran',
    forms: ['ran', 'running']
  };
  static misc: Words = {
    word: 'langerhans',
    forms: ['langerhans']
  };

  static testNouns: Words[] = [MockContextPackService.noun];
  static testVerbs: Words[] = [MockContextPackService.verb];
  static testAdjectives: Words[] = [MockContextPackService.adjective];
  static testMisc: Words[] = [MockContextPackService.misc];
  static testWordPacks: WordPack[] =[
    {
      name: 'happy',
      enabled: false,
      nouns: MockContextPackService.testNouns,
      verbs: MockContextPackService.testVerbs,
      adjectives: MockContextPackService.testAdjectives,
      misc: MockContextPackService.testMisc
    }
  ];

  static testContextPacks: ContextPack[] =
    [
      {
        _id: 'fun_id',
        name: 'fun',
        icon: 'http://placehold.it/32x32',
        enabled: true,
        wordPacks: MockContextPackService.testWordPacks
      },
      {
        _id: 'sun_id',
        name: 'sun',
        icon: 'http://placehold.it/32x32',
        enabled: true,
        wordPacks: MockContextPackService.testWordPacks
      },
      {
        _id: 'happy_id',
        name: 'happy',
        icon: 'http://placehold.it/32x32',
        enabled: true,
        wordPacks: MockContextPackService.testWordPacks
      }
  ];

  constructor() {
    super(null);
  }

  getContextPacks(): Observable<ContextPack[]> {
    return of(MockContextPackService.testContextPacks);
  }

  getContextPackById(id: string): Observable<ContextPack> {
    // If the specified ID is for the first test user,
    // return that user, otherwise return `null` so
    // we can test illegal user requests.
    if (id === MockContextPackService.testContextPacks[0]._id) {
      return of(MockContextPackService.testContextPacks[0]);
    } else {
      return of(null);
    }
  }


}
