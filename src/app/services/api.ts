import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Team } from '../models/team';
import { Player } from '../models/player';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'https://69c2f4b67518bf8facbfea83.mockapi.io/api/v1'; // Base URL da API

  constructor(private http: HttpClient) {}

  // TEAMS
  getTeams() {
    return this.http.get<Team[]>(`${this.base}/Teams`); // GET todas as equipas
  }
  getTeam(id: string) {
    return this.http.get<Team>(`${this.base}/Teams/${id}`); // GET equipa pelo ID
  }
  createTeam(data: Team) {
    return this.http.post<Team>(`${this.base}/Teams`, data); // POST nova equipa
  }
  updateTeam(id: string, data: Team) {
    return this.http.put<Team>(`${this.base}/Teams/${id}`, data); // PUT atualizar equipa
  }
  deleteTeam(id: string) {
    return this.http.delete(`${this.base}/Teams/${id}`); // DELETE equipa
  }

  // PLAYERS
  getPlayers() {
    return this.http.get<Player[]>(`${this.base}/Players`); // GET todos os jogadores
  }
  getPlayer(id: string) {
    return this.http.get<Player>(`${this.base}/Players/${id}`); // GET jogador pelo ID
  }
  getPlayersByTeam(teamId: string) {
    return this.http.get<Player[]>(`${this.base}/Players?teamId=${teamId}`); // GET todos os jogadores de uma equipa
  }
  createPlayer(data: Player) {
    return this.http.post<Player>(`${this.base}/Players`, data); // POST novo jogador
  }
  updatePlayer(id: string, data: Player) {
    return this.http.put<Player>(`${this.base}/Players/${id}`, data); // PUT atualizar jogador
  }
  deletePlayer(id: string) {
    return this.http.delete(`${this.base}/Players/${id}`); // DELETE jogador
  }
}
