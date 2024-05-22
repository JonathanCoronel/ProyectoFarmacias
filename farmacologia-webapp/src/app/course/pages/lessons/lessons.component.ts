import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs/operators';
import { ContentService } from 'src/app/core/services/contents/content.service';
import { ResourceService } from 'src/app/core/services/contents/resource.service';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {
  contents: any = [];
  resources: any = [];
  tabs = [
    { name: 'VIDEOS', active: true },
    { name: 'IMAGENES', active: false },
    { name: 'ARTICULOS', active: false },
  ];
  selectedTab = this.tabs[0];
  constructor(
    private route:ActivatedRoute,
    private contentService:ContentService,
    private resourceService: ResourceService,
    private sanitizer: DomSanitizer
  ) { }
  public urlVideo;
  ngOnInit(): void {
      this.route.paramMap
      .pipe(
        map((param:ParamMap)=>{
          // @ts-ignore
          return param.params.id;
        })
      ).subscribe(topicId =>{
        this.contentService.getContentsById(topicId).subscribe(res => {
          this.contents = res.data;
            console.log(res.data);
          }, error => {
            console.log('error');
            console.log(error);
          });
          this.resourceService.getResourceById(topicId).subscribe(res => {
            this.resources = res.data;
            
              console.log(res.data);
            }, error => {
              console.log('error');
              console.log(error);
            });
        
      });
  }
  changeSection(tab: any) {
    this.selectedTab = tab;
    this.tabs[0].active = false;
    this.tabs[1].active = false;
    this.tabs[2].active = false;
    this.tabs[this.tabs.indexOf(tab)].active = true;
  }
  changeURL(url:any):any{
    this.urlVideo= this.sanitizer.bypassSecurityTrustResourceUrl(url);
    const idVideo = this.urlVideo.changingThisBreaksApplicationSecurity.split('=');
    this.urlVideo="https://www.youtube.com/embed/"+idVideo[1];
    const link = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlVideo);
    return link;
  }


}
