import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api';
import { Player } from '../../../models/player';
import { AgePipe } from '../../../pipes/age-pipe'; // pipe para calcular idade

@Component({
  selector: 'app-player-list',
  imports: [RouterLink, AgePipe], // AgePipe declarado aqui para usar no HTML
  templateUrl: './player-list.html',
  styleUrl: './player-list.css',
})
export class PlayerList implements OnInit {
  // signal reativo - atualiza o HTML automaticamente quando muda
  players = signal<Player[]>([]);

  // controla a direção da ordenação: 'desc' = mais golos primeiro, 'asc' = menos golos primeiro
  // null = sem ordenação ativa (ordem original da API)
  sortGoals: 'asc' | 'desc' | null = null;
  sortGames: 'asc' | 'desc' | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getAllPlayers();
  }

  getAllPlayers() {
    this.api.getPlayers().subscribe((players) => {
      this.players.set(players);
      // resetar a ordenação quando a lista é recarregada
      this.sortGoals = null;
      this.sortGames = null;
    });
  }

  // getter computado — devolve a lista ordenada conforme sortGoals
  // é recalculado automaticamente sempre que players() ou sortGoals mudam
  get sortedPlayers(): Player[] {
    const list = [...this.players()]; // cópia do array para não mutar o signal original

    if (this.sortGoals === 'desc') {
      // ordenar do maior para o menor número de golos
      return list.sort((a, b) => b.goals - a.goals);
    }
    if (this.sortGoals === 'asc') {
      // ordenar do menor para o maior número de golos
      return list.sort((a, b) => a.goals - b.goals);
    }

      if (this.sortGames === 'desc') {
      // ordenar do maior para o menor número de jogos 
      return list.sort((a, b) => b.caps - a.caps);
    }
    if (this.sortGames === 'asc') {
      // ordenar do menor para o maior número de jogos
      return list.sort((a, b) => a.caps - b.caps);
    }


    // sem ordenação: devolve a lista na ordem original
    return list;
  }



  

  // alterna entre desc → asc → null ao clicar no botão
  toggleSortGoals() {
    if (this.sortGoals === null) {
      this.sortGoals = 'desc'; // 1º clique: mais golos primeiro
    } else if (this.sortGoals === 'desc') {
      this.sortGoals = 'asc'; // 2º clique: menos golos primeiro
    } else {
      this.sortGoals = null; // 3º clique: volta à ordem original
    }
  }

  toggleSortGames() {
    if (this.sortGames === null) {
      this.sortGames = 'desc'; // 1º clique: mais jogos primeiro
    } else if (this.sortGames === 'desc') {
      this.sortGames = 'asc'; // 2º clique: menos jogos primeiro
    } else {
      this.sortGames = null; // 3º clique: volta à ordem original
    }
  }

  deletePlayer(id: string) {
    if (confirm('Tens a certeza que queres remover este jogador?')) {
      this.api.deletePlayer(id).subscribe(() => {
        this.getAllPlayers();
      });
    }
  }
}
