import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaApiService } from '../../../../../../core/services/media-api.service';

@Component({
  selector: 'app-product-image-uploader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-3">
      <label class="block text-xs font-bold text-slate-700">
        Imagen Principal del Hardware <span class="text-rose-500">*</span>
      </label>

      <!-- Zona de Carga / Vista previa -->
      <div
        class="border-2 border-dashed rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 transition-all"
        [ngClass]="{
          'border-brand-primary bg-blue-50/50': isDragging(),
          'border-slate-200': !isDragging()
        }"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        <!-- Preview Box -->
        <div class="w-24 h-24 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center p-1 relative">
          @if (isUploading()) {
            <div class="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-1 z-10">
              <svg class="animate-spin w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span class="text-[9px] font-bold text-brand-primary">Subiendo...</span>
            </div>
          }

          @if (currentUrl) {
            <img [src]="currentUrl" alt="Vista previa producto" class="w-full h-full object-contain" />
          } @else {
            <svg class="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        </div>

        <!-- Acciones y Subida -->
        <div class="flex-1 text-center sm:text-left">
          <p class="text-xs font-semibold text-slate-800">
            Arrastra tu imagen o selecciónala de tu equipo
          </p>
          <p class="text-[11px] text-slate-400 mt-0.5">
            Formatos admitidos: PNG, JPG, WebP. Resolución mínima recomendada: 800x800px. Máx: 5MB.
          </p>

          <div class="mt-2.5 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
            <label class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors">
              Explorar Archivo
              <input
                type="file"
                class="hidden"
                accept="image/png, image/jpeg, image/webp"
                (change)="onFileSelected($event)"
              />
            </label>

            @if (currentUrl) {
              <button
                type="button"
                (click)="removeImage()"
                class="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer px-2 py-1"
              >
                Eliminar
              </button>
            }
          </div>

          @if (errorMessage()) {
            <p class="text-[11px] text-rose-600 mt-1.5 font-medium">{{ errorMessage() }}</p>
          }
        </div>
      </div>
    </div>
  `
})
export class ProductImageUploaderComponent {
  private readonly mediaApi = inject(MediaApiService);

  @Input() currentUrl: string = '';
  @Output() imageUrlChange = new EventEmitter<string>();

  public readonly isUploading = signal<boolean>(false);
  public readonly isDragging = signal<boolean>(false);
  public readonly errorMessage = signal<string | null>(null);

  public onDragOver(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging.set(true);
  }

  public onDragLeave(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging.set(false);
  }

  public onDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging.set(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFile(files[0]);
    }
  }

  public onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFile(input.files[0]);
    }
  }

  public uploadFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('El archivo seleccionado debe ser una imagen válida (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage.set('El tamaño de la imagen supera el límite permitido de 5 MB.');
      return;
    }

    this.errorMessage.set(null);
    this.isUploading.set(true);

    this.mediaApi.uploadImage(file, 'products').subscribe({
      next: (res: any) => {
        this.currentUrl = res.url;
        this.imageUrlChange.emit(res.url);
        this.isUploading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al subir la imagen al servidor multimedia.');
        this.isUploading.set(false);
      }
    });
  }

  public removeImage(): void {
    this.currentUrl = '';
    this.imageUrlChange.emit('');
    this.errorMessage.set(null);
  }
}
