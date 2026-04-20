import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api';
import { Team } from '../../../models/team';

@Component({
  selector: 'app-team-list',
  imports: [RouterLink], // RouterLink para os botões Ver/Editar
  templateUrl: './team-list.html',
  styleUrl: './team-list.css',
})
export class TeamList implements OnInit {
  teams = signal<Team[]>([]);

  // ApiService é injetado para comunicar com a API
  constructor(private api: ApiService) {}

  // ngOnInit corre quando o componente é criado
  ngOnInit(): void {
    this.getAllTeams();
  }

  getAllTeams() {
    // subscribe() fica à espera da resposta da API
    // quando chega, .set() atualiza o signal e o HTML re-renderiza
    this.api.getTeams().subscribe((teams) => {
      this.teams.set(teams);
    });
  }

  deleteTeam(id: string) {
    if (confirm('Tens a certeza que queres remover esta seleção?')) {
      // depois de apagar, recarrega a lista para refletir a remoção
      this.api.deleteTeam(id).subscribe(() => {
        this.getAllTeams();
      });
    }
  }
}