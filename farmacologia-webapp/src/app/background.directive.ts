import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Directive({
  selector: '[appBackground]'
})
export class BackgroundDirective {
  @Input() correctAnswer:boolean = false;
  idRoute;
  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2, private router: Router,private route: ActivatedRoute,
    ) {
      this.idRoute = route.snapshot.params.id;
    }
  @HostListener('click') onAnswered(){
    if(this.correctAnswer){
      this.renderer.setStyle(
        this.elRef.nativeElement,
        'background-color',
        '#72f654'
      );
    }else{
      this.renderer.setStyle(
        this.elRef.nativeElement,
        'background-color',
        '#dc3545'
      );
    }
    setTimeout(()=>{
      this.router.navigate(['/course/tema/subtema/',this.idRoute]).then();
    },1800);

  }
}
