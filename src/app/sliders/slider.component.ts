import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {

  sliders: any[] = [
    { img: '/assets/img/panel.jpg'
    },
    { img: '/assets/img/panel2.jpg'
    }
  ]



  constructor(public ngbCarouselConfig: NgbCarouselConfig) {
    ngbCarouselConfig.interval = 3000;
    ngbCarouselConfig.pauseOnHover = false;
  }

  ngOnInit(): void {
  }

}
