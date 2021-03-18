import { Component, Input, OnInit } from '@angular/core';
import { ContextPack, WordPack, WordRole, Words } from './contextpack';

@Component({
  selector: 'app-contextpack-card',
  templateUrl: './contextpack-card.component.html',
  styleUrls: ['./contextpack-card.component.scss']
})
export class ContextpackCardComponent implements OnInit {

  @Input() contextPack: ContextPack;
  @Input() simple?: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  //All functions below from the minds of Team-PurpleTigers
  displayWordPacks(contextpack: WordPack){
    let  wordPacks: string;
      wordPacks = '';
        wordPacks += 'Name: ' + contextpack.name + '\n';
        wordPacks += 'Enabled: ' + contextpack.enabled + '\n';
        wordPacks += 'Nouns: \n' + this.displayWords(contextpack, 'nouns');
        wordPacks += 'Verbs: \n' + this.displayWords(contextpack, 'verbs');
        wordPacks += 'Adjectives: \n' + this.displayWords(contextpack, 'adjectives');
        wordPacks += 'Misc: \n' + this.displayWords(contextpack, 'misc');
    return wordPacks;
  }

  displayWords(wordPack: WordPack, pos: WordRole){
    let words: string[];
    let str: string;
    if (wordPack[`${pos}`] === undefined){
      words = null;
      str = null;
    }
    else{
      let i: number;
      words = [];
        for (i = 0; i < wordPack[`${pos}`].length; i++) {
          words = words.concat(wordPack[`${pos}`][i].forms) ;
        }
        str = words.join(', ');
        str += '\n';
    }

    return str;
  }

  displayAllWords(contextpack: ContextPack, pos: WordRole){
      let words: WordPack[];
      let m: number;
      let str: string;
      if(contextpack.wordPacks === undefined || contextpack.wordPacks[0][`${pos}`][0] === undefined){
        words = null;
        str = null;
      }
      else{
        words = [];
      for (m = 0; m < contextpack.wordPacks.length; m++){
          words = words.concat(contextpack.wordPacks[m]);
        }

      let z: number;
      str = '\n';
      for (z = 0; z < words.length; z++){
        str += this.displayWords(words[z], pos);
        str = str.slice(0, -1);
        if (z < words.length-1){
          str += ', ';
          }
        }
      }
      return str;
  }
}
