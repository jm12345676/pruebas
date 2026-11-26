import { Component, ElementRef, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import diccionario from '../../diccionario/diccionario.json'; 

export interface Alumno {
  foto: string;
  nombre: string;
  matricula: string;
  carrera: string;
  rvoe: string;
  vigencia: string;
}

export interface FormatoCredencial {
  id: string;
  nombre: string;
  frente: string;
  orientacion?: 'VERTICAL' | 'HORIZONTAL';
}

@Component({
  selector: 'app-credenciales',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './credenciales.html',
  styleUrl: './credenciales.css'
})
export class Credenciales implements OnInit {
  @ViewChild('areaImpresion') areaImpresion!: ElementRef<HTMLElement>;

  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.cargarPlantillaHorizontalDesdeBase();
    this.cargarFormatosGuardados();

    const matricula = this.route.snapshot.paramMap.get('matricula');
    if (matricula) {
      this.cargarAlumnoPorMatricula(matricula);
    }
  }

  private cargarAlumnoPorMatricula(matricula: string): void {
    // 1) Primero busca en localStorage (los datos editados en gestión)
    const guardado = localStorage.getItem('alumnos');
    if (guardado) {
      const lista = JSON.parse(guardado);
      const encontrado = lista.find((a: any) => a.matricula === matricula);
      if (encontrado) {
        const nombre = `${encontrado.nombres} ${encontrado.apellidoPaterno} ${encontrado.apellidoMaterno}`.trim();
        this.alumno.update(actual => ({
          ...actual,
          nombre: nombre.toUpperCase(),
          matricula: encontrado.matricula,
          carrera: encontrado.escuela,
          foto: encontrado.foto ?? '',
          vigencia: encontrado.vigencia || actual.vigencia
        }));
        return;
      }
    }

    // 2) Si no hay nada guardado, busca en el JSON
    const registro = diccionario.alumno.find(a => a.matricula === matricula);
    if (registro) {
      this.alumno.update(actual => ({
        ...actual,
        nombre: registro.nombre.toUpperCase(),
        matricula: registro.matricula,
        carrera: registro.carrera
      }));
    }
  }

  readonly fondoReverso = '/img/Group%202030.png';
  readonly firmaAutoridad = '/img/uwuowo.jpeg';
  private readonly STORAGE_KEY = 'ives_formatos_credenciales_v1';

  orientacion = signal<'VERTICAL' | 'HORIZONTAL'>('VERTICAL');

  formatos = signal<FormatoCredencial[]>([
    {
      id: 'diseno-1',
      nombre: 'Diseño 1',
      frente: '/img/Group%202029.png',
      orientacion: 'VERTICAL'
    },
    {
      id: 'diseno-2',
      nombre: 'Diseño 2',
      frente: this.crearPlantillaAlternativaLimpia(),
      orientacion: 'VERTICAL'
    },
    {
      id: 'diseno-h-1',
      nombre: 'Diseño 1',
      frente: this.crearPlantillaHorizontalDiseno1(),
      orientacion: 'HORIZONTAL'
    },
    {
      id: 'diseno-h-2',
      nombre: 'Diseño 2',
      frente: this.crearPlantillaHorizontalLimpia(),
      orientacion: 'HORIZONTAL'
    }
  ]);

  formatosFiltrados = computed(() =>
    this.formatos().filter(f => (f.orientacion ?? 'VERTICAL') === this.orientacion())
  );

  formatoActivoId = signal<string>('diseno-1');
  fondoFrente = '/img/Group%202029.png';

  editandoFormatoId = signal<string | null>(null);
  nuevoNombreFormato = signal<string>('');
  nuevoFrenteBase64 = signal<string>('');
  nombreArchivoFrente = signal<string>('');
  arrastrandoSobreFrente = signal<boolean>(false);
  errorFormularioFormato = signal<string>('');
  guardando = signal<boolean>(false);

  alumno = signal<Alumno>({
    foto: '',
    nombre: 'MARIO ALBERTO PÉREZ GÓMEZ',
    matricula: '20260303567',
    carrera: 'Contaduría Pública',
    rvoe: 'ES183/2004',
    vigencia: 'AGO 2027'
  });

  panelActivo = signal<'NINGUNO' | 'VIGENCIA' | 'FORMATOS' | 'AGREGAR_FORMATO'>('NINGUNO');
  tipoCodigo = signal<'BARRAS' | 'QR'>('QR');

  qrDataUrl = computed(() => {
    const matricula = encodeURIComponent(this.alumno().matricula.trim());
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&ecc=L&margin=0&color=000000&bgcolor=ffffff&data=${matricula}`;
  });

  // Código de barras Code 128 generado a partir de la matrícula
  codigoBarras = computed(() => this.generarCodigoBarras(this.alumno().matricula.trim()));

  private readonly PATRON_CODE128: string[] = [
    '212222','222122','222221','121223','121322','131222','122213','122312','132212','221213',
    '221312','231212','112232','122132','122231','113222','123122','123221','223211','221132',
    '221231','213212','223112','312131','311222','321122','321221','312212','322112','322211',
    '212123','212321','232121','111323','131123','131321','112313','132113','132311','211313',
    '231113','231311','112133','112331','132131','113123','113321','133121','313121','211331',
    '231131','213113','213311','213131','311123','311321','331121','312113','312311','332111',
    '314111','221411','431111','111224','111422','121124','121421','141122','141221','112214',
    '112412','122114','122411','142112','142211','241211','221114','413111','241112','134111',
    '111242','121142','121241','114212','124112','124211','411212','421112','421211','212141',
    '214121','412121','111143','111341','131141','114113','114311','411113','411311','113141',
    '114131','311141','411131','211412','211214','211232','2331112'
  ];

  private generarCodigoBarras(texto: string): string {
    if (typeof document === 'undefined' || !texto) return '';

    // Si son solo dígitos y cantidad par, usa Code C (más compacto); si no, Code B
    const soloDigito = /^\d+$/.test(texto) && texto.length % 2 === 0;
    const valor: number[] = [];

    if (soloDigito) {
      valor.push(105); // Start C
      for (let i = 0; i < texto.length; i += 2) {
        valor.push(parseInt(texto.substring(i, i + 2), 10));
      }
    } else {
      valor.push(104); // Start B
      for (const c of texto) {
        const codigo = c.charCodeAt(0);
        if (codigo < 32 || codigo > 126) return '';
        valor.push(codigo - 32);
      }
    }

    // Dígito verificador
    let suma = valor[0];
    for (let i = 1; i < valor.length; i++) {
      suma += valor[i] * i;
    }
    valor.push(suma % 103);
    valor.push(106); // Stop

    // Dibujo en canvas
    const modulo = 4;      // píxeles por módulo
    const margen = 10;     // módulos de margen blanco a cada lado
    const alto = 120;

    const patron = valor.map(v => this.PATRON_CODE128[v]).join('');
    const totalModulo = patron.split('').reduce((s, n) => s + parseInt(n, 10), 0);

    const canvas = document.createElement('canvas');
    canvas.width = (totalModulo + margen * 2) * modulo;
    canvas.height = alto;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    let x = margen * modulo;
    let esBarra = true;
    for (const n of patron) {
      const ancho = parseInt(n, 10) * modulo;
      if (esBarra) ctx.fillRect(x, 0, ancho, alto);
      x += ancho;
      esBarra = !esBarra;
    }

    return canvas.toDataURL('image/png');
  }

  cambiarOrientacion(nueva: 'VERTICAL' | 'HORIZONTAL'): void {
    if (this.orientacion() === nueva) return;

    this.orientacion.set(nueva);
    if (this.panelActivo() === 'AGREGAR_FORMATO') {
      this.cerrarFormularioFormato();
    }

    const disponibles = this.formatosFiltrados();
    if (disponibles.length > 0) {
      this.seleccionarFormato(disponibles[0]);
    }
  }

  private cargarPlantillaHorizontalDesdeBase(): void {
    if (typeof document === 'undefined') return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 824;
      canvas.height = 534;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 824, 534);

      const altoHeader = 162;
      const srcH = Math.round(img.height * 0.43);
      ctx.drawImage(img, 0, 0, img.width, srcH, 0, 0, 824, altoHeader);

      ctx.fillStyle = '#d4af37';
      ctx.fillRect(0, altoHeader, 824, 5);

      ctx.fillStyle = '#0B2859';
      ctx.fillRect(0, 522, 824, 12);

      const dataUrl = canvas.toDataURL('image/png');
      this.formatos.update(lista =>
        lista.map(f =>
          f.id === 'diseno-h-1' && !f.frente.startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAzo')
            ? { ...f, frente: dataUrl }
            : f
        )
      );

      if (this.formatoActivoId() === 'diseno-h-1') {
        const actual = this.formatos().find(f => f.id === 'diseno-h-1');
        if (actual) this.fondoFrente = actual.frente;
      }
    };
    img.src = '/img/Group%202029.png';
  }

  private crearPlantillaHorizontalDiseno1(): string {
    if (typeof document === 'undefined') return '/img/Group%202029.png';

    const canvas = document.createElement('canvas');
    canvas.width = 824;
    canvas.height = 534;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '/img/Group%202029.png';

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 824, 534);

    ctx.fillStyle = '#0B2859';
    ctx.fillRect(0, 0, 824, 162);

    ctx.fillStyle = '#d4af37';
    ctx.fillRect(0, 162, 824, 5);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('IVES  |  #SOMOS LINCES', 412, 95);

    ctx.fillStyle = '#0B2859';
    ctx.fillRect(0, 522, 824, 12);

    return canvas.toDataURL('image/png');
  }

  private crearPlantillaAlternativaLimpia(): string {
    if (typeof document === 'undefined') return '/img/Group%202029.png';

    const canvas = document.createElement('canvas');
    canvas.width = 534;
    canvas.height = 824;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '/img/Group%202029.png';

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 534, 824);

    const grad = ctx.createLinearGradient(0, 0, 534, 340);
    grad.addColorStop(0, '#0B2859');
    grad.addColorStop(1, '#174276');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(534, 0);
    ctx.lineTo(534, 295);
    ctx.quadraticCurveTo(267, 355, 0, 295);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, 299);
    ctx.quadraticCurveTo(267, 359, 534, 299);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UNIVERSIDAD IVES', 267, 95);

    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 17px Arial, sans-serif';
    ctx.fillText('CREDENCIAL OFICIAL', 267, 130);

    ctx.fillStyle = '#0B2859';
    ctx.fillRect(0, 810, 534, 14);

    return canvas.toDataURL('image/png');
  }

  private crearPlantillaHorizontalLimpia(): string {
    if (typeof document === 'undefined') return '/img/Group%202029.png';

    const canvas = document.createElement('canvas');
    canvas.width = 824;
    canvas.height = 534;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '/img/Group%202029.png';

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 824, 534);

    const grad = ctx.createLinearGradient(0, 0, 824, 162);
    grad.addColorStop(0, '#0B2859');
    grad.addColorStop(1, '#174276');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 824, 162);

    ctx.fillStyle = '#d4af37';
    ctx.fillRect(0, 162, 824, 5);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('UNIVERSIDAD IVES', 38, 78);

    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 17px Arial, sans-serif';
    ctx.fillText('CREDENCIAL ESCOLAR OFICIAL', 40, 114);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.beginPath();
    ctx.arc(756, 81, 48, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 21px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('IVES', 756, 88);

    ctx.fillStyle = '#0B2859';
    ctx.fillRect(0, 522, 824, 12);

    return canvas.toDataURL('image/png');
  }

  private cargarFormatosGuardados(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const guardadoRaw = localStorage.getItem(this.STORAGE_KEY);
      if (!guardadoRaw) return;

      const guardados: FormatoCredencial[] = JSON.parse(guardadoRaw);
      if (!Array.isArray(guardados) || guardados.length === 0) return;

      this.formatos.update(actuales => {
        const mapa = new Map<string, FormatoCredencial>(actuales.map(f => [f.id, f]));
        for (const item of guardados) {
          mapa.set(item.id, {
            ...item,
            orientacion: item.orientacion ?? 'VERTICAL'
          });
        }
        return Array.from(mapa.values());
      });

      const activo = this.formatos().find(f => f.id === this.formatoActivoId());
      if (activo) {
        this.fondoFrente = activo.frente;
      }
    } catch {
      console.warn('No se pudieron leer los formatos locales.');
    }
  }

  private persistirEnNavegador(lista: FormatoCredencial[]): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lista));
  }

  togglePanel(panel: 'VIGENCIA' | 'FORMATOS' | 'AGREGAR_FORMATO'): void {
    this.errorFormularioFormato.set('');

    if (panel === 'AGREGAR_FORMATO') {
      if (this.panelActivo() === 'AGREGAR_FORMATO') {
        this.cerrarFormularioFormato();
      } else {
        this.editandoFormatoId.set(null);
        this.nuevoNombreFormato.set('');
        this.nuevoFrenteBase64.set('');
        this.nombreArchivoFrente.set('');
        this.panelActivo.set('AGREGAR_FORMATO');
      }
      return;
    }

    if (this.panelActivo() === 'AGREGAR_FORMATO') {
      this.restaurarVistaPreviaActual();
    }

    this.panelActivo.update(actual => (actual === panel ? 'NINGUNO' : panel));
  }

  iniciarEdicionFormatoActivo(): void {
    const actual = this.formatos().find(f => f.id === this.formatoActivoId());
    if (!actual) return;

    this.editandoFormatoId.set(actual.id);
    this.nuevoNombreFormato.set(actual.nombre);
    this.nuevoFrenteBase64.set(actual.frente);
    this.nombreArchivoFrente.set(
      actual.frente.startsWith('data:') ? `${actual.nombre}.png` : actual.frente.split('/').pop() || 'Plantilla actual'
    );
    this.errorFormularioFormato.set('');
    this.panelActivo.set('AGREGAR_FORMATO');
  }

  actualizarVigencia(nuevaVigencia: string): void {
    const valor = nuevaVigencia.trim().toUpperCase();
    if (valor) {
      this.alumno.update(actual => ({ ...actual, vigencia: valor }));
    }
    this.panelActivo.set('NINGUNO');
  }

  seleccionarFormato(formato: FormatoCredencial): void {
    this.formatoActivoId.set(formato.id);
    this.fondoFrente = formato.frente;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrandoSobreFrente.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrandoSobreFrente.set(false);
  }

  onDropArchivo(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrandoSobreFrente.set(false);

    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.procesarImagenOptimizada(file);
    }
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.procesarImagenOptimizada(file);
    input.value = '';
  }

  private procesarImagenOptimizada(file: File): void {
    this.errorFormularioFormato.set('');
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Redimensiona proporcionalmente al tamaño de credencial (máx. 900px) para guardar ligero y nítido
        const maxDim = 900;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          const escala = maxDim / Math.max(w, h);
          w = Math.round(w * escala);
          h = Math.round(h * escala);
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const pngBase64 = canvas.toDataURL('image/png');
          this.nuevoFrenteBase64.set(pngBase64);
          this.nombreArchivoFrente.set(file.name.replace(/\.[^.]+$/, '') + '.png');
          this.fondoFrente = pngBase64;
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  quitarImagen(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.nuevoFrenteBase64.set('');
    this.nombreArchivoFrente.set('');
    this.restaurarVistaPreviaActual();
  }

  private restaurarVistaPreviaActual(): void {
    const formatoActual = this.formatosFiltrados().find(f => f.id === this.formatoActivoId())
      ?? this.formatosFiltrados()[0];
    this.fondoFrente = formatoActual?.frente || '/img/Group%202029.png';
  }

  cerrarFormularioFormato(): void {
    this.restaurarVistaPreviaActual();
    this.editandoFormatoId.set(null);
    this.nuevoNombreFormato.set('');
    this.nuevoFrenteBase64.set('');
    this.nombreArchivoFrente.set('');
    this.errorFormularioFormato.set('');
    this.panelActivo.set('NINGUNO');
  }

  guardarFormato(): void {
    const nombre = this.nuevoNombreFormato().trim();
    const frente = this.nuevoFrenteBase64();
    const idEnEdicion = this.editandoFormatoId();
    const orientacionActual = this.orientacion();

    if (!nombre) {
      this.errorFormularioFormato.set('Ingresa un nombre para el formato.');
      return;
    }

    if (!frente) {
      this.errorFormularioFormato.set('Selecciona la imagen frontal de la credencial.');
      return;
    }

    this.guardando.set(true);
    this.errorFormularioFormato.set('');

    try {
      const formatoGuardado: FormatoCredencial = {
        id: idEnEdicion || `formato-${Date.now()}`,
        nombre,
        orientacion: orientacionActual,
        frente
      };

      const listaActualizada = idEnEdicion
        ? this.formatos().map(f => (f.id === idEnEdicion ? formatoGuardado : f))
        : [...this.formatos(), formatoGuardado];

      this.persistirEnNavegador(listaActualizada);

      this.formatos.set(listaActualizada);
      this.formatoActivoId.set(formatoGuardado.id);
      this.fondoFrente = formatoGuardado.frente;

      this.editandoFormatoId.set(null);
      this.nuevoNombreFormato.set('');
      this.nuevoFrenteBase64.set('');
      this.nombreArchivoFrente.set('');
      this.panelActivo.set('NINGUNO');
    } catch {
      this.errorFormularioFormato.set('La imagen es muy pesada para el navegador. Usa una imagen más ligera.');
    } finally {
      this.guardando.set(false);
    }
  }

  alternarCodigo(tipo?: 'BARRAS' | 'QR'): void {
    this.tipoCodigo.update(actual => tipo ?? (actual === 'BARRAS' ? 'QR' : 'BARRAS'));
  }

  onErrorImagen(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  imprimirCredencial(): void {
    this.panelActivo.set('NINGUNO');

    const nodo = this.areaImpresion?.nativeElement;
    if (!nodo) return;

    const esHorizontal = this.orientacion() === 'HORIZONTAL';
    const pageW = esHorizontal ? '85mm' : '54mm';
    const pageH = esHorizontal ? '54mm' : '85mm';
    const lienzoW = esHorizontal ? '419px' : '267px';
    const lienzoH = esHorizontal ? '267px' : '419px';

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
            size: ${pageW} ${pageH};
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
            width: ${pageW} !important;
            background: #ffffff !important;
            font-family: Arial, Helvetica, "Segoe UI", Roboto, sans-serif;
          }
          .credenciales-grid {
            display: block !important;
            width: ${pageW} !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .credencial-card {
            width: ${pageW} !important;
            height: ${pageH} !important;
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
          .lienzo-credencial {
            width: ${lienzoW} !important;
            height: ${lienzoH} !important;
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