import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Alumno {
  foto: string;
  nombre: string;
  matricula: string;
  carrera: string;
  rvoe: string;
  vigencia: string;
}

@Component({
  selector: 'app-credenciales',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './credenciales.html',
  styleUrl: './credenciales.css'
})
export class Credenciales {
  @ViewChild('areaImpresion') areaImpresion!: ElementRef<HTMLElement>;

  readonly codigoBarras = '/img/uwu.png';
  fondoFrente = '/img/Group%202029.png';
  fondoReverso = '/img/Group%202030.png';

  alumno = signal<Alumno>({
    foto: '',
    nombre: 'MARIO ALBERTO PÉREZ GÓMEZ',
    matricula: '20260303567',
    carrera: 'Contaduría Pública',
    rvoe: 'ES183/2004',
    vigencia: 'AGO 2027'
  });

  panelActivo = signal<'NINGUNO' | 'VIGENCIA' | 'FORMATOS'>('NINGUNO');
  mostrarAlerta = signal(false);
  tipoCodigo = signal<'BARRAS' | 'QR'>('BARRAS');
  disenoActivo = signal(1);

  togglePanel(panel: 'VIGENCIA' | 'FORMATOS'): void {
    this.panelActivo.update(actual => (actual === panel ? 'NINGUNO' : panel));
  }

  actualizarVigencia(nuevaVigencia: string): void {
    const valor = nuevaVigencia.trim().toUpperCase();
    if (valor) {
      this.alumno.update(actual => ({ ...actual, vigencia: valor }));
    }
    this.panelActivo.set('NINGUNO');
  }

  seleccionarDiseno(numero: 1 | 2): void {
    this.disenoActivo.set(numero);
    this.fondoFrente = numero === 1 ? '/img/Group%202029.png' : '/img/Group%201959.png';
    this.fondoReverso = '/img/Group%202030.png';
    this.panelActivo.set('NINGUNO');
  }

  alternarCodigo(tipo?: 'BARRAS' | 'QR'): void {
    this.tipoCodigo.update(actual => tipo ?? (actual === 'BARRAS' ? 'QR' : 'BARRAS'));
  }

  onErrorImagen(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  imprimirCredencial(): void {
    this.panelActivo.set('NINGUNO');
    this.mostrarAlerta.set(false);

    const nodo = this.areaImpresion?.nativeElement;
    if (!nodo) return;

    const clon = nodo.cloneNode(true) as HTMLElement;
    clon.querySelectorAll('.no-print').forEach(el => el.remove());

    const estilos = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(el => el.outerHTML)
      .join('\n');

    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!doc) {
      iframe.remove();
      return;
    }

    doc.open();
    doc.write(`
      <!doctype html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <base href="${document.baseURI}">
        ${estilos}
        <style>
          @page {
            size: 54mm 85mm;
            margin: 0;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 54mm !important;
            background: #ffffff !important;
            font-family: Arial, Helvetica, "Segoe UI", Roboto, sans-serif;
          }
          .credenciales-grid {
            display: block !important;
            width: 54mm !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Cada cara ocupa exacto 54mm x 85mm sin recortes */
          .credencial-card {
            width: 54mm !important;
            height: 85mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .credencial-card:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          /* zoom escala el flujo real de 267x412px para cubrir el 100% de 54mm x 85mm */
          .lienzo-credencial {
            width: 267px !important;
            height: 419px !important;
            margin: 0 !important;
            border-radius: 0 !important;
            zoom: 0.7644 !important;
          }
        </style>
      </head>
      <body>${clon.outerHTML}</body>
      </html>
    `);
    doc.close();

    const cargas = Array.from(doc.images).map(img =>
      img.complete ? Promise.resolve() : new Promise<void>(r => { img.onload = img.onerror = () => r(); })
    );

    Promise.all(cargas).then(() => {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => iframe.remove(), 1000);
      }, 150);
    });
  }
}