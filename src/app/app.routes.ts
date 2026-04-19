import { Routes } from '@angular/router';
import { TeamList } from './components/teams/team-list/team-list';
import { TeamDetail } from './components/teams/team-detail/team-detail';
import { TeamForm } from './components/teams/team-form/team-form';
import { PlayerList } from './components/players/player-list/player-list';
import { PlayerDetail } from './components/players/player-detail/player-detail';
import { PlayerForm } from './components/players/player-form/player-form';

export const routes: Routes = [
  // --- TEAMS ---
  { path: 'teams', component: TeamList },               // lista todas as seleções
  { path: 'teams/new', component: TeamForm },           // formulário para criar seleção
  { path: 'teams/:id', component: TeamDetail },         // detalhes de uma seleção pelo id
  { path: 'teams/:id/edit', component: TeamForm },      // formulário para editar seleção

  // --- PLAYERS ---
  { path: 'players', component: PlayerList },           // lista todos os jogadores
  { path: 'players/new', component: PlayerForm },       // formulário para criar jogador
  { path: 'players/:id', component: PlayerDetail },     // detalhes de um jogador pelo id
  { path: 'players/:id/edit', component: PlayerForm },  // formulário para editar jogador

  // redirect - rota vazia redireciona para /teams
  { path: '', redirectTo: '/teams', pathMatch: 'full' },
  // qualquer rota inválida também redireciona para /teams
  { path: '**', redirectTo: '/teams' },
];