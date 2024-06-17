import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'src/app/services/translate.service';
import { ITranslate } from 'src/app/interfaces/translate.interface';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-translation-list',
  templateUrl: './translation-list.component.html',
  styleUrls: ['./translation-list.component.css']
})
export class TranslationListComponent implements OnInit {
  translations: ITranslate[] = [];
  searchQuery: string = '';
  displayedTranslations: ITranslate[] = [];
  currentPage = 1;
  itemsPerPage = 9;
  showForm = false;
  selectedTranslation: ITranslate = {
    id: 0,
    originalText: '',
    translatedText: '',
    fromLanguage: '',
    toLanguage: ''
  };
  showAddFormText: string = 'Nueva Traducción';
  showAddFormSubtitle: string = 'Agrega una nueva traducción a la lista';
  errorMessage = '';
  successMessage: string = '';
  errorText: string = '';

  // Abreviaturas de idiomas
  languageAbbreviations: { [key: string]: string } = {
    'Árabe': 'AR',
    'Bengalí': 'BN',
    'Chino': 'ZH',
    'Danés': 'DA',
    'Español': 'ES',
    'Francés': 'FR',
    'Griego': 'EL',
    'Hebreo': 'HE',
    'Hindi': 'HI',
    'Inglés': 'EN',
    'Italiano': 'IT',
    'Japonés': 'JA',
    'Jemer': 'KM',
    'Koreano': 'KO',
    'Latín': 'LA',
    'Neerlandés': 'NL',
    'Persa': 'FA',
    'Polaco': 'PL',
    'Portugués': 'PT',
    'Ruso': 'RU',
    'Sueco': 'SV',
    'Turco': 'TR',
    'Ucraniano': 'UK',
    'Vietnamita': 'VI'
  };

  // Lista de idiomas para el select en el formulario de edición/agregado
  languages: string[] = Object.keys(this.languageAbbreviations);

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    this.getTranslations();
  }

  getTranslations(): void {
    this.translationService.getAllTranslations()
      .pipe(catchError(error => {
        this.showSwalAlert('error', 'Error', 'No se pudieron obtener las traducciones');
        return of([]);
      }))
      .subscribe(translations => {
        this.translations = translations;
        this.displayedTranslations = this.translations.slice(0, this.itemsPerPage);
      });
  }

  searchTranslations(): void {
    this.displayedTranslations = this.translations.filter(translation => 
      translation.originalText.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      translation.translatedText.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      this.getLanguageName(translation.fromLanguage).toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      this.getLanguageName(translation.toLanguage).toLowerCase().includes(this.searchQuery.toLowerCase())
    ).slice(0, this.itemsPerPage);
  }

  goToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedTranslations = this.translations.slice(startIndex, endIndex);
  }

  addTranslation(): void {
    // Asignamos la abreviatura correspondiente al idioma seleccionado
    this.selectedTranslation.fromLanguage = this.languageAbbreviations[this.selectedTranslation.fromLanguage];
    this.selectedTranslation.toLanguage = this.languageAbbreviations[this.selectedTranslation.toLanguage];

    if (this.selectedTranslation.id) {
      this.translationService.updateTranslation(this.selectedTranslation.id, this.selectedTranslation)
        .subscribe(
          () => {
            this.getTranslations();
            this.showForm = false;
            this.showSuccessMessage('Traducción actualizada exitosamente');
          },
          error => {
            console.error('Error updating translation:', error);
            this.showSwalAlert('error', 'Error', 'No se pudo actualizar la traducción');
          }
        );
    } else {
      const newTranslation = { ...this.selectedTranslation, translatedText: '' };
      this.translationService.translateText(newTranslation)
        .subscribe(
          translatedText => {
            this.selectedTranslation.translatedText = translatedText;
            this.getTranslations();
            this.showForm = false;
            this.showSuccessMessage('Traducción agregada exitosamente');
          },
          error => {
            console.error('Error adding translation:', error);
            this.showSwalAlert('error', 'Error', 'No se pudo agregar la traducción');
          }
        );
    }
  }
  
  confirmTranslationDeletion(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, bórralo',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.translationService.deleteTranslation(id)
          .subscribe(
            () => {
              this.getTranslations();
              this.showSwalAlert('success', 'Eliminado', 'La traducción ha sido eliminada');
            },
            () => {
              this.showSwalAlert('error', 'Error', 'No se pudo eliminar la traducción');
            }
          );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.showSwalAlert('error', 'Cancelado', 'Tu traducción está a salvo :)');
      }
    });
  }

  showSwalAlert(icon: any, title: string, text: string): void {
    Swal.fire({
      icon,
      title,
      text,
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
  }

  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  resetForm(): void {
    this.selectedTranslation = {
      id: 0,
      originalText: '',
      translatedText: '',
      fromLanguage: '',
      toLanguage: ''
    };
  }

  editTranslation(translation: ITranslate): void {
    // Convertimos las abreviaturas a nombres completos para el formulario de edición
    this.selectedTranslation = {
      ...translation,
      fromLanguage: this.getLanguageName(translation.fromLanguage),
      toLanguage: this.getLanguageName(translation.toLanguage)
    };
    this.showForm = true;
  }

  cancelAdd(): void {
    this.resetForm();
    this.showForm = false;
  }

  // Función para obtener el nombre completo del idioma a partir de su abreviatura
  getLanguageName(abbreviation: string): string {
    for (const [key, value] of Object.entries(this.languageAbbreviations)) {
      if (value === abbreviation) {
        return key;
      }
    }
    return '';
  }
}
