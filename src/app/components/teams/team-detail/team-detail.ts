import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api';
import { Team } from '../../../models/team';
import { Player } from '../../../models/player';
import { AgePipe } from '../../../pipes/age-pipe';

@Component({
  selector: 'app-team-detail',
  imports: [RouterLink, AgePipe],
  templateUrl: './team-detail.html',
  styleUrl: './team-detail.css',
})
export class TeamDetail implements OnInit {
  // signals reativos para a seleção e os seus jogadores
  team = signal<Team | null>(null);
  players = signal<Player[]>([]);
  loading = signal<boolean>(true);

  // null = ordem original | 'desc' = mais primeiro | 'asc' = menos primeiro
  sortGoals: 'asc' | 'desc' | null = null;
  sortGames: 'asc' | 'desc' | null = null;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute, // para ler o :id da URL
    private router: Router         // para navegar para /teams depois de remover
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTeam(id);
      this.loadPlayers(id);
    }
  }

  loadTeam(id: string) {
    this.api.getTeam(id).subscribe(team => {
      this.team.set(team);
      this.loading.set(false);
    });
  }

  loadPlayers(teamId: string) {
    this.api.getPlayersByTeam(teamId).subscribe(players => {
      this.players.set(players);
    });
  }

  // Titulares prováveis — filtra e aplica as duas ordenações
  get starters(): Player[] {
    const filtered = this.players().filter(p => p.isStartingXI);
    return this.applySortGames(this.applySortGoals(filtered));
  }

  // Suplentes — filtra e aplica as duas ordenações
  get substitutes(): Player[] {
    const filtered = this.players().filter(p => !p.isStartingXI);
    return this.applySortGames(this.applySortGoals(filtered));
  }

  // aplica ordenação por golos à lista recebida
  applySortGoals(list: Player[]): Player[] {
    const copy = [...list];
    if (this.sortGoals === 'desc') return copy.sort((a, b) => b.goals - a.goals);
    if (this.sortGoals === 'asc')  return copy.sort((a, b) => a.goals - b.goals);
    return copy;
  }

  // aplica ordenação por jogos (caps) à lista recebida
  applySortGames(list: Player[]): Player[] {
    const copy = [...list];
    if (this.sortGames === 'desc') return copy.sort((a, b) => b.caps - a.caps);
    if (this.sortGames === 'asc')  return copy.sort((a, b) => a.caps - b.caps);
    return copy;
  }

  // alterna desc → asc → null e reseta o outro botão
  toggleSortGoals() {
    if (this.sortGoals === null)        this.sortGoals = 'desc';
    else if (this.sortGoals === 'desc') this.sortGoals = 'asc';
    else                                this.sortGoals = null;
    this.sortGames = null; // só uma ordenação ativa de cada vez
  }

  toggleSortGames() {
    if (this.sortGames === null)        this.sortGames = 'desc';
    else if (this.sortGames === 'desc') this.sortGames = 'asc';
    else                                this.sortGames = null;
    this.sortGoals = null; // só uma ordenação ativa de cada vez
  }

  deleteTeam() {
    const id = this.team()?.id;
    if (!id) return;

    if (confirm('Tens a certeza que queres remover esta seleção?')) {
      this.api.deleteTeam(id).subscribe(() => {
        this.router.navigate(['/teams']);
      });
    }
  }
}