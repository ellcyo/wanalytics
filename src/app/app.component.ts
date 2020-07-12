import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from './api.service';
import { finalize } from 'rxjs/operators';
import { Corrs } from './model/corrs';
import { stringify } from '@angular/compiler/src/util';
import { calcPossibleSecurityContexts } from '@angular/compiler/src/template_parser/binding_parser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'wanalytics';
  uploadedFiles: any[] = [];
  payload: any;
  lista: Corrs[];
  filhos: Corrs[];
  resultado = [];
  response: any;
  showProgressBrowser: Boolean = false;
  map = new Map<string, object>();

  constructor(private messageService: MessageService, private apiService: ApiService) {

  }

  onUpload(event) {
    this.showProgressBrowser = true;

    for (let file of event.files) {
      this.uploadDocument(file);
    }

    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }

  uploadDocument(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.payload = JSON.parse(fileReader.result.toString());

      this.resumeProdutos();

      //Buscando os dados
      this.apiCorrelacao();
    }
    fileReader.readAsText(file);
  }

  resumeProdutos() {
    this.map = new Map<string, object>();

    for (let s of this.payload.sales) {
      this.map.set(s.StockCode, s)
    }
  }

  apiCorrelacao() {
    this.apiService.correlacao(this.payload).pipe(
      finalize(() => {
        this.showProgressBrowser = false;
      })
    ).subscribe(response => {
      this.response = response;

      this.percorrer(response);
    });
  }


  percorrer(obj) {
    //console.log(typeof Object.keys(obj)[0], typeof Object.values(obj)[0]);
    let ob: Object;
    let p: object;

    this.lista = [];

    let corr: Corrs;
    for (let n = 0; n < Object.getOwnPropertyNames(obj).length; n++) {
      corr = new Corrs();
      corr.sku = Object.keys(obj)[n];

      //Buscando os Produtos e os preços
      p = this.map.get(corr.sku);
      corr.name = p['Description'];
      corr.price = p['UnitPrice'];

      corr.lista = new Array();
      ob = Object.values(obj)[n]
      for (let x = 0; x < Object.getOwnPropertyNames(ob).length; x++) {
        corr.lista.push(ob[x]);
      }

      this.lista.push(corr);
    }
  }

  generateArray(obj) {
    return Object.keys(obj).map((key) => { key });
  }

  expandTable(prod, expand) {
    this.filhos = new Array();
    let c: Corrs;
    let p: object;

    for (let pr of prod.lista) {
      c = new Corrs();
      c.sku = pr;

      p = this.map.get(c.sku);
      if (typeof p === 'object') {
        c.name = p['Description'];
        c.price = p['UnitPrice'];
        this.filhos.push(c);
      }
    }

  }
}

