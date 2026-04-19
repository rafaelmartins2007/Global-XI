import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // necessário para usar ngModel no HTML
import { ApiService } from '../../../services/api';
import { Player } from '../../../models/player';
import { Team } from '../../../models/team';

@Component({
  selector: 'app-player-form',
  imports: [FormsModule],
  templateUrl: './player-form.html',
  styleUrl: './player-form.css',
})
export class PlayerForm implements OnInit {
  // id vindo da rota - null significa criação, string significa edição
  id: string | null = null;

  // signal com o objeto player - começa vazio e é preenchido pelo form ou pela API
  player = signal<Player>({
    name: '',
    position: '',
    number: 0,
    teamId: '',
    isStartingXI: false,
    fotoUrl: '',
    birthDate: '',
    club: '',
    caps: 0,
    goals: 0
  });

  // lista de seleções para o select do teamId
  teams = signal<Team[]>([]);

  // ActivatedRoute - lê os parâmetros da rota (:id)
  // Router - navega para outra página após guardar ou cancelar
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // carrega a lista de seleções para o select
    this.api.getTeams().subscribe(teams => {
      this.teams.set(teams);
    });

    // lê o parâmetro :id da URL atual
    this.id = this.route.snapshot.paramMap.get('id');

    // se existe id estamos em modo edição - vai buscar os dados à API
    if (this.id) {
      this.api.getPlayer(this.id).subscribe(player => {
        this.player.set(player); // .set() atualiza o signal e o HTML re-renderiza
      });
    }
    // se não existe id estamos em modo criação - o form começa vazio
  }

  onSubmit() {
    if (this.id) {
      // modo edição - PUT atualiza o jogador existente
      this.api.updatePlayer(this.id, this.player()).subscribe(() => {
        this.router.navigate(['/players']); // volta à lista após guardar
      });
    } else {
      // modo criação - POST cria novo jogador
      this.api.createPlayer(this.player()).subscribe(() => {
        this.router.navigate(['/players']); // volta à lista após guardar
      });
    }
  }

  onCancel() {
    // volta à lista sem guardar alterações
    this.router.navigate(['/players']);
  }
}