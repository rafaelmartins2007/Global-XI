import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api';
import { Player } from '../../../models/player';
import { Team } from '../../../models/team';
import { AgePipe } from '../../../pipes/age-pipe';

@Component({
  selector: 'app-player-detail',
  imports: [RouterLink, AgePipe],
  templateUrl: './player-detail.html',
  styleUrl: './player-detail.css',
})
export class PlayerDetail implements OnInit {
  // signal reativo para o jogador — null enquanto não chegou da API
  player = signal<Player | null>(null);

  // signal reativo para a seleção do jogador — null enquanto não chegou da API
  team = signal<Team | null>(null);

  // controla o spinner de loading
  loading = signal<boolean>(true);

  constructor(
    private api: ApiService,
    private route: ActivatedRoute, // para ler o :id da URL /players/:id
    private router: Router, // para navegar para /players depois de remover
  ) {}

  ngOnInit(): void {
    // lê o :id da URL atual, ex: /players/7 → "7"
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPlayer(id);
    }
  }

  loadPlayer(id: string) {
    // GET /Players/:id — busca os dados do jogador
    this.api.getPlayer(id).subscribe((player) => {
      this.player.set(player);
      this.loading.set(false);

      // depois de ter o jogador, usa o teamId para buscar a seleção
      this.loadTeam(player.teamId);
    });
  }

  loadTeam(teamId: string) {
    // GET /Teams/:id — busca a seleção à qual o jogador pertence
    this.api.getTeam(teamId).subscribe((team) => {
      this.team.set(team);
    });
  }

  deletePlayer() {
    const id = this.player()?.id;
    if (!id) return;

    // confirm() abre uma caixa de diálogo nativa do browser para confirmação
    if (confirm('Tens a certeza que queres remover este jogador?')) {
      // DELETE /Players/:id — remove o jogador da API
      this.api.deletePlayer(id).subscribe(() => {
        // após remover, navega para a lista de jogadores
        this.router.navigate(['/players']);
      });
    }
  }
}
