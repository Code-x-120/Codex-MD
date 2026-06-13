import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import axios from 'axios';

const API_BASE = 'https://www.thesportsdb.com/api/v1/json/3';
const OPENLIGA_BASE = 'https://api.openligadb.de/v1';

const LEAGUES = {
  epl: { name: 'English Premier League', id: 4328, openliga: null },
  laliga: { name: 'La Liga', id: 4335, openliga: null },
  seriea: { name: 'Serie A', id: 4332, openliga: null },
  bundesliga: { name: 'Bundesliga', id: 4331, openliga: 'bl1' },
  ligue1: { name: 'Ligue 1', id: 4334, openliga: null },
  cl: { name: 'UEFA Champions League', id: 4480, openliga: null },
  euro: { name: 'UEFA Europa League', id: 4482, openliga: null },
};

const CMD_CONFIG = {
  eplstanding: { league: 'epl', type: 'standing' },
  eplstandings: { league: 'epl', type: 'standing' },
  laligastanding: { league: 'laliga', type: 'standing' },
  laligastandings: { league: 'laliga', type: 'standing' },
  serieastanding: { league: 'seriea', type: 'standing' },
  serieastandings: { league: 'seriea', type: 'standing' },
  bundesligastanding: { league: 'bundesliga', type: 'standing' },
  bundesligastandings: { league: 'bundesliga', type: 'standing' },
  ligue1standing: { league: 'ligue1', type: 'standing' },
  ligue1standings: { league: 'ligue1', type: 'standing' },
  clstanding: { league: 'cl', type: 'standing' },
  clstandings: { league: 'cl', type: 'standing' },
  eplscorers: { league: 'epl', type: 'scorers' },
  laligascorers: { league: 'laliga', type: 'scorers' },
  serieascorers: { league: 'seriea', type: 'scorers' },
  bundesligascorers: { league: 'bundesliga', type: 'scorers' },
  ligue1scorers: { league: 'ligue1', type: 'scorers' },
  clscorers: { league: 'cl', type: 'scorers' },
  topscorers: { league: 'epl', type: 'scorers' },
  eplmatches: { league: 'epl', type: 'matches' },
  laligamatches: { league: 'laliga', type: 'matches' },
  serieamatches: { league: 'seriea', type: 'matches' },
  bundesligamatches: { league: 'bundesliga', type: 'matches' },
  ligue1matches: { league: 'ligue1', type: 'matches' },
  clmatches: { league: 'cl', type: 'matches' },
  euroleaguematches: { league: 'euro', type: 'matches' },
};

async function fetchTheSportsDB(endpoint) {
  const { data } = await axios.get(`${API_BASE}/${endpoint}`, { timeout: 15000 });
  return data;
}

async function fetchStandings(leagueId) {
  const data = await fetchTheSportsDB(`lookuptable.php?l=${leagueId}`);
  return data?.table || [];
}

async function fetchScorersFromDB(leagueId) {
  try {
    const data = await fetchTheSportsDB(`lookupscorers.php?l=${leagueId}`);
    if (data?.scorers?.length) return data.scorers;
  } catch {}
  return null;
}

async function fetchOpenLigaGoalGetters(leagueShort, season) {
  try {
    const { data } = await axios.get(
      `${OPENLIGA_BASE}/getgoalgetters/${leagueShort}/${season}`,
      { timeout: 10000 }
    );
    return data || [];
  } catch {
    return [];
  }
}

async function fetchOpenLigaStandings(leagueShort, season) {
  try {
    const { data } = await axios.get(
      `${OPENLIGA_BASE}/getbltable/${leagueShort}/${season}`,
      { timeout: 10000 }
    );
    return data || [];
  } catch {
    return [];
  }
}

async function fetchMatches(leagueId) {
  const data = await fetchTheSportsDB(`eventsseason.php?id=${leagueId}`);
  return data?.events || [];
}

function formatStandings(leagueName, table) {
  if (!table?.length) {
    return `╭─ *${leagueName} Standings*\n│ No standings data available right now.\n╰─ Codex-MD`;
  }
  const header = `╭─ *${leagueName} Standings*`;
  const cols = '│ #  Team                P  W  D  L  GF GA Pts';
  const rows = table.slice(0, 20).map((t, i) => {
    const pos = String(t.intRank || i + 1);
    const team = (t.strTeam || 'Unknown').slice(0, 18);
    const p = t.intPlayed ?? '-';
    const w = t.intWin ?? '-';
    const d = t.intDraw ?? '-';
    const l = t.intLoss ?? '-';
    const gf = t.intGoalsFor ?? '-';
    const ga = t.intGoalsAgainst ?? '-';
    const pts = t.intPoints ?? '-';
    return `│ ${pos.padStart(2)}. ${team.padEnd(18)} ${String(p).padStart(2)} ${String(w).padStart(2)} ${String(d).padStart(2)} ${String(l).padStart(2)} ${String(gf).padStart(2)} ${String(ga).padStart(2)} ${String(pts).padStart(3)}`;
  }).join('\n');
  return `${header}\n${cols}\n${rows}\n╰─ Codex-MD`;
}

function formatOpenLigaStandings(leagueName, table) {
  if (!table?.length) return null;
  const header = `╭─ *${leagueName} Standings*`;
  const cols = '│ #  Team                P  W  D  L  GF GA Pts';
  const rows = table.slice(0, 20).map((t, i) => {
    const pos = String(t.rank || t.position || i + 1);
    const team = (t.teamName || t.team?.teamName || 'Unknown').slice(0, 18);
    const p = t.matches ?? '-';
    const w = t.won ?? '-';
    const d = t.draw ?? '-';
    const l = t.lost ?? '-';
    const gf = t.goals ?? '-';
    const ga = t.goalsAgainst ?? '-';
    const pts = t.points ?? '-';
    return `│ ${pos.padStart(2)}. ${team.padEnd(18)} ${String(p).padStart(2)} ${String(w).padStart(2)} ${String(d).padStart(2)} ${String(l).padStart(2)} ${String(gf).padStart(2)} ${String(ga).padStart(2)} ${String(pts).padStart(3)}`;
  }).join('\n');
  return `${header}\n${cols}\n${rows}\n╰─ Codex-MD`;
}

function formatScorers(leagueName, result) {
  if (!result) {
    return `╭─ *${leagueName} Top Scorers*\n│ No top scorer data available for this league right now.\n╰─ Codex-MD`;
  }
  if (result.source === 'openliga') {
    const header = `╭─ *${leagueName} Top Scorers*`;
    const rows = result.data.slice(0, 20).map((p, i) => {
      const name = (p.playerName || p.player?.playerName || 'Unknown').slice(0, 22);
      const goals = p.goalCount ?? p.goals ?? 0;
      const team = (p.teamName || p.team?.teamName || '').slice(0, 14);
      return `│ ${String(i + 1).padStart(2)}. ${name.padEnd(22)} ${String(goals).padStart(3)}g  ${team}`;
    }).join('\n');
    return `${header}\n│ #  Player                  Goals  Team\n${rows}\n╰─ Codex-MD`;
  }
  if (result.source === 'scorers') {
    const header = `╭─ *${leagueName} Top Scorers*`;
    const rows = result.data.slice(0, 20).map((p, i) => {
      const name = (p.strPlayer || 'Unknown').slice(0, 22);
      const goals = p.intGoals || p.intScore || 0;
      const team = (p.strTeam || '').slice(0, 14);
      return `│ ${String(i + 1).padStart(2)}. ${name.padEnd(22)} ${String(goals).padStart(3)}g  ${team}`;
    }).join('\n');
    return `${header}\n│ #  Player                  Goals  Team\n${rows}\n╰─ Codex-MD`;
  }
  if (result.source === 'standings') {
    const header = `╭─ *${leagueName} Team Goals (Top Scorers N/A)*`;
    const rows = result.data.slice(0, 10).map((t, i) => {
      const team = (t.strTeam || 'Unknown').slice(0, 20);
      const gf = t.intGoalsFor ?? 0;
      const ga = t.intGoalsAgainst ?? 0;
      return `│ ${String(i + 1).padStart(2)}. ${team.padEnd(20)} GF:${String(gf).padStart(3)} GA:${String(ga).padStart(3)}`;
    }).join('\n');
    return `${header}\n│ #  Team                 GF  GA\n${rows}\n│ *Individual scorers unavailable via free API*\n╰─ Codex-MD`;
  }
  return `╭─ *${leagueName} Top Scorers*\n│ Data temporarily unavailable.\n╰─ Codex-MD`;
}

function formatMatches(leagueName, events) {
  if (!events?.length) {
    return `╭─ *${leagueName} Matches*\n│ No match data available right now.\n╰─ Codex-MD`;
  }
  const now = new Date();
  const upcoming = events.filter(e => new Date(e.dateEvent || e.strTimestamp || 0) >= now);
  const recent = events.filter(e => new Date(e.dateEvent || e.strTimestamp || 0) < now);
  const show = (upcoming.length ? upcoming : recent).slice(0, 15);
  const label = upcoming.length ? 'Upcoming Fixtures' : 'Recent Results';
  const header = `╭─ *${leagueName} - ${label}*`;
  const rows = show.map((e, i) => {
    const home = (e.strHomeTeam || e.homeTeam || '?').slice(0, 16);
    const away = (e.strAwayTeam || e.awayTeam || '?').slice(0, 16);
    const date = e.dateEvent || e.strTimestamp || '';
    const dateStr = date ? date.slice(0, 10) : '';
    const score = e.strHomeTeamScore !== null && e.strHomeTeamScore !== undefined
      ? `${e.strHomeTeamScore} - ${e.strAwayTeamScore}`
      : 'vs';
    return `│ ${String(i + 1).padStart(2)}. ${home.padEnd(16)} ${score.padStart(5)} ${away.padEnd(16)} ${dateStr}`;
  }).join('\n');
  return `${header}\n│ #  Home             Score  Away             Date\n${rows}\n╰─ Codex-MD`;
}

async function handleStandings(cmdConfig, leagueInfo) {
  if (leagueInfo.openliga) {
    const season = new Date().getFullYear();
    const olTable = await fetchOpenLigaStandings(leagueInfo.openliga, season);
    if (olTable?.length) return olTable;
  }
  return fetchStandings(leagueInfo.id);
}

async function handleScorers(cmdConfig, leagueInfo) {
  if (leagueInfo.openliga) {
    const season = new Date().getFullYear();
    const olScorers = await fetchOpenLigaGoalGetters(leagueInfo.openliga, season);
    if (olScorers?.length) {
      return { source: 'openliga', data: olScorers };
    }
  }
  const scorers = await fetchScorersFromDB(leagueInfo.id);
  if (scorers?.length) {
    return { source: 'scorers', data: scorers };
  }
  const table = await fetchStandings(leagueInfo.id);
  if (table?.length) {
    const sorted = [...table].sort(
      (a, b) => (parseInt(b.intGoalsFor) || 0) - (parseInt(a.intGoalsFor) || 0)
    );
    return { source: 'standings', data: sorted.slice(0, 10) };
  }
  return null;
}

async function handleMatches(cmdConfig, leagueInfo) {
  return fetchMatches(leagueInfo.id);
}

export default {
  name: 'sports',
  aliases: [
    'eplmatches', 'eplstanding', 'eplstandings', 'eplscorers',
    'laligamatches', 'laligastanding', 'laligastandings', 'laligascorers',
    'serieamatches', 'serieastanding', 'serieastandings', 'serieascorers',
    'bundesligamatches', 'bundesligastanding', 'bundesligastandings', 'bundesligascorers',
    'ligue1matches', 'ligue1standing', 'ligue1standings', 'ligue1scorers',
    'clmatches', 'clstanding', 'clstandings', 'clscorers',
    'euroleaguematches', 'topscorers',
  ],
  description: 'Football/Sports league data',
  category: 'Search',
  run: async (context) => {
    const { client, m, command, text } = context;
    const fq = getFakeQuoted(m);
    const cmdConfig = CMD_CONFIG[command];

    if (!cmdConfig) return;

    const leagueInfo = LEAGUES[cmdConfig.league];
    if (!leagueInfo) {
      return client.sendMessage(m.chat, {
        text: '╭─ *Sports*\n│ League not configured for this command.\n╰─ Codex-MD',
      }, { quoted: fq });
    }

    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    try {
      if (cmdConfig.type === 'standing') {
        const table = await handleStandings(cmdConfig, leagueInfo);
        const msg = Array.isArray(table) ? formatStandings(leagueInfo.name, table) : formatOpenLigaStandings(leagueInfo.name, table) || formatStandings(leagueInfo.name, []);
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        return client.sendMessage(m.chat, { text: msg }, { quoted: fq });
      }

      if (cmdConfig.type === 'scorers') {
        const result = await handleScorers(cmdConfig, leagueInfo);
        const msg = formatScorers(leagueInfo.name, result);
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        return client.sendMessage(m.chat, { text: msg }, { quoted: fq });
      }

      if (cmdConfig.type === 'matches') {
        const events = await handleMatches(cmdConfig, leagueInfo);
        const msg = formatMatches(leagueInfo.name, events);
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        return client.sendMessage(m.chat, { text: msg }, { quoted: fq });
      }
    } catch (e) {
      console.error('Sports plugin error:', e);
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return client.sendMessage(m.chat, {
        text: `╭─ *Error*\n│ Failed to fetch ${leagueInfo.name} data.\n│ The sports API might be down or try again later.\n╰─ Codex-MD`,
      }, { quoted: fq });
    }
  },
};
