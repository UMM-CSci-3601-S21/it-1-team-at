import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContextpackService } from './contextpack.service';
import { ContextPack, WordPack, Words } from './contextpack';

//Shows the wordPacks inside context pack
@Component({
  selector: 'app-contextpack-content',
  templateUrl: './contextpack-content.component.html',
  styleUrls: ['./contextpack-content.component.scss']
})
export class ContextpackContentComponent implements OnInit, OnDestroy {

  contextPack: ContextPack;
  wordPacks: WordPack[];
  wordPack: WordPack;
  index: number;
  id: string;
  getContextPackSub: Subscription;

  constructor(private route: ActivatedRoute, private contextPackService: ContextpackService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      if (this.getContextPackSub) {
        this.getContextPackSub.unsubscribe();
      }
      this.getContextPackSub = this.contextPackService.getContextPackById(this.id).subscribe(contextPack => this.contextPack = contextPack);
    });
  }

  ngOnDestroy(): void {
    this.getContextPackSub.unsubscribe();
  }
}
