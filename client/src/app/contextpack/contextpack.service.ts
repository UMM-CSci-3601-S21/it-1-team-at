import { Injectable } from '@angular/core';
import { ContextPack } from './contextpack';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class ContextpackService {
  readonly contextPacksUrl: string = environment.apiUrl + 'contextpacks';

  constructor(private httpClient: HttpClient) {

  }

  getContextPacks(filters?: {name?: string}): Observable<ContextPack[]> {
    //change this to 'let' instead of 'const' when implementing filtering
    const httpParams: HttpParams = new HttpParams();
    return this.httpClient.get<ContextPack[]>(this.contextPacksUrl, {
      params: httpParams
    });
  }

  getContextPackById(id: string): Observable<ContextPack> {
    return this.httpClient.get<ContextPack>(this.contextPacksUrl + '/' + id);
  }

  filterContextPacks(contextPacks: ContextPack[], filter: { name?: string }): ContextPack[] {
    let filteredPacks = contextPacks;

    // Filter by name
    if (filter.name) {
      filter.name = filter.name.toLowerCase();

      filteredPacks = filteredPacks.filter(contextPack => contextPack.name.toLowerCase().indexOf(filter.name) !== -1);
    }
    return filteredPacks;
  }

  addContextPack(newContextPack: ContextPack): Observable<string> {
    return this.httpClient.post<{id: string }>(this.contextPacksUrl, newContextPack).pipe(map(res => res.id));
  }
}
