import { Injectable } from '@angular/core'; 
import { map } from 'rxjs/operators';
import { PostModel } from '../models/post.model';
import { HttpClient } from '@angular/common/http';
import { WpPost } from '../models/wp/wp-post.model';
import { environment } from '../../environments/environment';
import { ContactModel } from '../models/contact.model';
import { WpMedia } from '../models/wp/wp-media.interface';
import { WpPostOverview } from '../models/wp/wp-post-overview.model';
import { Observable } from 'rxjs';



@Injectable()
export class WordpressService {

  constructor(private http: HttpClient) { }

  retrieveEmbeddedPosts(offset:number, per_page:number, search:string){
    return this.http.get<any[]>(`${environment.wordpressUrl}/posts?_embed&per_page=${per_page}&offset=${offset}&search=${search}`)
      .pipe(
        map(data => {
          /* this must be an array of posts*/
          return data.map(item => {
            let wpItem = new WpPost(item);

            return <PostModel>{
              date: wpItem.date(),
              title: wpItem.title(),
              link: wpItem.link(),
              image: wpItem.featuredImage('medium_large')
            }})
        })
      );
  }

  retrievePostsOverview(offset:number, per_page:number, search:string){
    return this.http.get<any[]>(`${environment.wordpressCustomUrl}/posts?&per_page=${per_page}&offset=${offset}&search=${search}`)
      .pipe(
        map(data => {
          /* this must be an array of posts*/
          return data.map(item => {
            let wpItem = new WpPostOverview(item);

            let post = <PostModel>{
              date: wpItem.date(),
              title: wpItem.title(),
              slug: wpItem.slug(),
              path: 'blog/' + wpItem.path(),
              link: wpItem.link(),
              image: wpItem.featuredMediaSrc()
            };

            return post;
          });
        })
      );
  } 
  
  
  retrievePostBySlug(slug:string):Observable<PostModel>{
    return this.http.get<any>(`${environment.wordpressUrl}/posts?slug=${slug}`)
      .pipe(
        map(data => {
          /* this is an array including 1 single post (slugs are unitary)*/
          return data.map(item => {
            let wpItem = new WpPost(item);

            let post = <PostModel>{
              date: wpItem.date(),
              title: wpItem.title(),
              link: wpItem.link(),
              content: wpItem.content(),
              metas: wpItem.metas()
            };


            //if there's featuredMedia, retrieve it async and update the post model in the future
            if(wpItem.featuredMedia()){
              post.image = "in process";//set thumbnail
              this.retrieveMedia(wpItem.featuredMedia()).subscribe(media =>{
                wpItem.setMedia(media);
                post.image = wpItem.featuredImage('large');
                post.metas["og:image"] = post.image;
                post.metas["twitter:image"] = post.image;
              });
            }

            //but return the post object asap
            return post;
          })[0];//We want to return just a single post, not an array
        })
      );
  }  
  
  retrievePosts(offset:number, per_page:number, search:string){
    return this.http.get<any[]>(`${environment.wordpressUrl}/posts?&per_page=${per_page}&offset=${offset}&search=${search}`)
      .pipe(
        map(data => {
          /* this must be an array of posts*/
          return data.map(item => {
            let wpItem = new WpPost(item);

            let post = <PostModel>{
              date: wpItem.date(),
              title: wpItem.title(),
              link: wpItem.link()
            };

            //if there's featuredMedia, retrieve it async and update the post model in the future
            if(wpItem.featuredMedia()){
              this.retrieveMedia(wpItem.featuredMedia()).subscribe(media =>{
                wpItem.setMedia(media);
                post.image = wpItem.featuredImage('medium_large');
              });
            }

            //but return the post object asap
            return post;
          });
        })
      );
  } 
  
  retrieveMedia(media:number|boolean){
    if(media){
      return this.http.get<WpMedia>(`${environment.wordpressUrl}/media/${media}`);
    }
  }

  contact(data:ContactModel){
    var formData = new FormData();
    formData.append('contact', data.name);
    formData.append('email', data.email);
    formData.append('topic', data.topic);
    formData.append('message', data.message);

    return this.http.post<any>(environment.contactUrl, formData).pipe(
      map(data => {
        if(data.status == 'mail_sent'){
          return data.message;
        }
        else{
          throw new Error(data.message);
        }
      })
    );
  }

}
