import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

// Importamos la clase principal desde el archivo login.ts
import { LoginComponent } from './login';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Como es un componente "standalone", lo ponemos en imports junto con los módulos de prueba
      imports: [
        LoginComponent,
        HttpClientTestingModule, // Simula el backend para las pruebas
        RouterTestingModule      // Simula las rutas para que no de error el redireccionamiento
      ]
    })
        .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Esta es la prueba básica: verifica que el componente exista y se construya bien
    expect(component).toBeTruthy();
  });
});