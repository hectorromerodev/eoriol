import { Component, OnInit, Input, HostListener } from '@angular/core';
import { WindowRefService } from '../../services/globals.service';

@Component({
  selector: 'app-blog-card',
  host: {'class': 'card card-content', "[attr.tabindex]": "0"},
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss']
})
export class BlogCardComponent implements OnInit {

  @Input() item:any;

  @HostListener('click', ['$event.target'])
  onClick(target){
    this.winRef.nativeWindow.open(this.item.link);
  }
  
  constructor(private winRef: WindowRefService) { 
  }

  ngOnInit() {
    
  }

}