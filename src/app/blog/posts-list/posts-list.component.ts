import { Component, OnInit, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { BlogPostsService } from '../../services/blog-posts.service';
import { isPlatformBrowser } from '@angular/common';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit {

  public postsList:any[];

  constructor(
    private blogPosts: BlogPostsService,
    private element: ElementRef,
    private scrollTo:ScrollToService,
    @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    
    if(isPlatformBrowser(this.platformId)){
      this.scrollTo.scrollTo({
        offset:this.element.nativeElement.getBoundingClientRect().top,
        duration: 0
      });
    }

    this.blogPosts.getItems(10).subscribe(items => this.postsList = items);
  }

}