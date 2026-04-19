import { Pipe, PipeTransform } from '@angular/core';

// name: 'age' é o nome usado no HTML: {{ birthDate | age }}
@Pipe({ name: 'age', standalone: true })
export class AgePipe implements PipeTransform {
  // transform recebe a data de nascimento e devolve a idade em anos
  transform(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);   // converte a string para Date

    let age = today.getFullYear() - birth.getFullYear(); // diferença de anos

    const m = today.getMonth() - birth.getMonth();
    // se ainda não fez anos este mês, ou é o mês mas ainda não foi o dia, subtrai 1
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

    return age;
  }
}