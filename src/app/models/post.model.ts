import { CommentModel } from "./comment.model";
import { PostMetaTagsModel } from "./post-meta-tags.model";

 
export class PostModel {
    public date:string;
    public title:string;
    public slug:string;//unique name as identifier of the article
    public link:string;//absolute path to the post in wordpress site
    public content?:string;
    public comments?:CommentModel[];
    public previous:PostModel;
    public next:PostModel;
    public metas:PostMetaTagsModel
    public image?:string;    
    public path?:string;//local path to the post    
    
}
