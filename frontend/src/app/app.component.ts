import { Component, OnInit } from '@angular/core';
import { SockService } from './service/sockService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private sockService: SockService) {

  }

  ngOnInit() {
    for (let i = 0; i < 1000; i++) {
      this.sockService.get(`/products/${Math.round(Math.random()*1000)}`);
    }
  }
}
