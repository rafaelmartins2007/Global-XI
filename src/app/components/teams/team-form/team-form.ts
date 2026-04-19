import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // necessário para usar ngModel no HTML
import { ApiService } from '../../../services/api';
import { Team } from '../../../models/team';

@Component({
  selector: 'app-team-form',
  imports: [FormsModule],
  templateUrl: './team-form.html',
  styleUrl: './team-form.css',
})
export class TeamForm implements OnInit {
  // id vindo da rota - null significa criação, string significa edição
  id: string | null = null;

  // signal com o objeto team - começa vazio e é preenchido pelo form ou pela API
  team = signal<Team>({
    country: '',
    confederation: '',
    coach: '',
    fifaRanking: 0,
    flagUrl: ''
  });

  // ActivatedRoute - lê os parâmetros da rota (:id)
  // Router - navega para outra página após guardar ou cancelar
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // lê o parâmetro :id da URL atual
    this.id = this.route.snapshot.paramMap.get('id');

    // se existe id estamos em modo edição - vai buscar os dados à API
    if (this.id) {
      this.api.getTeam(this.id).subscribe(team => {
        this.team.set(team); // .set() atualiza o signal e o HTML re-renderiza automaticamente
      });
    }
    // se não existe id estamos em modo criação - o form começa vazio
  }

  onSubmit() {
    if (this.id) {
      // modo edição - PUT atualiza a seleção existente
      // team() com () para obter o valor atual do signal
      this.api.updateTeam(this.id, this.team()).subscribe(() => {
        this.router.navigate(['/teams']); // volta à lista após guardar
      });
    } else {
      // modo criação - POST cria nova seleção
      this.api.createTeam(this.team()).subscribe(() => {
        this.router.navigate(['/teams']); // volta à lista após guardar
      });
    }
  }

  onCancel() {
    // volta à lista sem guardar alterações
    this.router.navigate(['/teams']);
  }
}