import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api';
import { Player } from '../../../models/player';
import { Team } from '../../../models/team';
import { AgePipe } from '../../../pipes/age-pipe';

@Component({
  selector: 'app-player-list',
  imports: [RouterLink, AgePipe],
  templateUrl: './player-list.html',
  styleUrl: './player-list.css',
})
export class PlayerList implements OnInit {
  players = signal<Player[]>([]);
  teams: { [id: string]: Team } = {};

  // null = ordem original | 'desc' = mais primeiro | 'asc' = menos primeiro
  sortGoals: 'asc' | 'desc' | null = null;
  sortGames: 'asc' | 'desc' | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getAllPlayers();
    // carrega as seleções e guarda num mapa por id para acesso fácil no HTML
    this.api.getTeams().subscribe(teams => {
      teams.forEach(t => this.teams[t.id!] = t);
    });
  }

  getAllPlayers() {
    this.api.getPlayers().subscribe((players) => {
      this.players.set(players);
    });
  }

  // getter que aplica as duas ordenações encadeadas - igual ao team-detail
  get sortedPlayers(): Player[] {
    return this.applySortGames(this.applySortGoals([...this.players()]));
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

  deletePlayer(id: string) {
    if (confirm('Tens a certeza que queres remover este jogador?')) {
      this.api.deletePlayer(id).subscribe(() => {
        this.getAllPlayers();
      });
    }
  }
}