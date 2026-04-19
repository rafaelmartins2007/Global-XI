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

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.getAllPlayers();
  }

  getAllPlayers() {
    this.api.getPlayers().subscribe(players => {
      this.players.set(players);
    });
  }

  deletePlayer(id: string) {
    if (confirm('Tens a certeza que queres remover este jogador?')) {
      this.api.deletePlayer(id).subscribe(() => {
        this.getAllPlayers();
      });
    }
  }
}