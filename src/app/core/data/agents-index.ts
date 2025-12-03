import { AgentIndex } from "../models/agents-index.model";
  
export const AGENT_INDEX: AgentIndex[] = [

  // A-RANK AGENTS
  { id: '1011', name: 'Anby',       faction: 'Cunning Hares',   specialty: 'Stun',    icon: '01', rarity: 'A', attribute: 'electric' },
  { id: '1031', name: 'Nicole',     faction: 'Cunning Hares',   specialty: 'Support', icon: '12', rarity: 'A', attribute: 'ether' },
  { id: '1061', name: 'Corin',      faction: 'Victoria Housekeeping Co.', specialty: 'Attack', icon: '09', rarity: 'A', attribute: 'physical' },
  { id: '1081', name: 'Billy',      faction: 'Cunning Hares',   specialty: 'Attack',  icon: '10', rarity: 'A', attribute: 'physical' },
  { id: '1111', name: 'Anton',      faction: 'Belobog Heavy Industries', specialty: 'Attack', icon: '15', rarity: 'A', attribute: 'electric' },
  { id: '1121', name: 'Ben',        faction: 'Belobog Heavy Industries', specialty: 'Defense', icon: '16', rarity: 'A', attribute: 'fire' },
  { id: '1131', name: 'Soukaku',    faction: 'Section 6',       specialty: 'Support', icon: '17', rarity: 'A', attribute: 'ice' },
  { id: '1151', name: 'Lucy',       faction: 'Sons of Calydon', specialty: 'Support', icon: '27', rarity: 'A', attribute: 'fire' },
  { id: '1271', name: 'Seth',       faction: 'Criminal Investigation Special Response Team', specialty: 'Defense', icon: '30', rarity: 'A', attribute: 'electric' },
  { id: '1281', name: 'Piper',      faction: 'Sons of Calydon', specialty: 'Anomaly',  icon: '28', rarity: 'A', attribute: 'physical' },
  { id: '1351', name: 'Pulchra',    faction: 'Stars of Lyra',   specialty: 'Stun',  icon: '38', rarity: 'A', attribute: 'physical' },  
  { id: '1421', name: 'Pan Yinhu',  faction: 'Yunkui Summit',   specialty: 'Defense',    icon: '45', rarity: 'A', attribute: 'physical' },
  { id: '1441', name: 'Manato',     faction: 'Spook Shack',     specialty: 'Rupture', icon: '51', rarity: 'A', attribute: 'fire' },

  // S-RANK AGENTS
    // Standard Banner (Permanent)
  { id: '1041', name: 'Soldier 11', faction: 'Obol Squad',      specialty: 'Attack',  icon: '05', rarity: 'S', attribute: 'fire' },
  { id: '1021', name: 'Nekomata',   faction: 'Cunning Hares',   specialty: 'Attack',  icon: '11', rarity: 'S', attribute: 'physical' },
  { id: '1101', name: 'Koleda',     faction: 'Belobog Heavy Industries', specialty: 'Stun', icon: '14', rarity: 'S', attribute: 'fire' },
  { id: '1141', name: 'Lycaon',     faction: 'Victoria Housekeeping Co.', specialty: 'Stun', icon: '18', rarity: 'S', attribute: 'ice' },  
  { id: '1181', name: 'Grace',      faction: 'Belobog Heavy Industries', specialty: 'Anomaly', icon: '20', rarity: 'S', attribute: 'electric' },
  { id: '1211', name: 'Rina',       faction: 'Victoria Housekeeping Co.', specialty: 'Support', icon: '22', rarity: 'S', attribute: 'electric'},
  
    // Victoria Housekeeping Co.
  { id: '1191', name: 'Ellen',      faction: 'Victoria Housekeeping Co.', specialty: 'Attack', icon: '21', rarity: 'S', attribute: 'ice' },
  
    // Criminal Investigation Special Response Team
  { id: '1241', name: 'Zhu Yuan',   faction: 'Criminal Investigation Special Response Team', specialty: 'Attack', icon: '23', rarity: 'S', attribute: 'ether' },
  { id: '1251', name: 'Qingyi',     faction: 'Criminal Investigation Special Response Team', specialty: 'Stun', icon: '29', rarity: 'S', attribute: 'electric' },
  { id: '1261', name: 'Jane Doe',   faction: 'Criminal Investigation Special Response Team', specialty: 'Anomaly', icon: '24', rarity: 'S', attribute: 'physical' },
  
    // Sons of Calydon
  { id: '1071', name: 'Caesar',     faction: 'Sons of Calydon', specialty: 'Defense', icon: '25', rarity: 'S', attribute: 'physical' },
  { id: '1171', name: 'Burnice',    faction: 'Sons of Calydon', specialty: 'Anomaly', icon: '32', rarity: 'S', attribute: 'fire' },
  { id: '1161', name: 'Lighter',    faction: 'Sons of Calydon', specialty: 'Stun',    icon: '26', rarity: 'S', attribute: 'fire' },
  
    // Hollow Special Operations Section 6
  { id: '1091', name: 'Miyabi',     faction: 'Section 6',       specialty: 'Anomaly', icon: '13', rarity: 'S', attribute: 'frost' },
  { id: '1221', name: 'Yanagi',     faction: 'Section 6',       specialty: 'Anomaly', icon: '31', rarity: 'S', attribute: 'electric' },
  { id: '1201', name: 'Harumasa',   faction: 'Section 6',       specialty: 'Attack',  icon: '35', rarity: 'S', attribute: 'electric' },
  
    // Stars of Lyra
  { id: '1311', name: 'Astra Yao',  faction: 'Stars of Lyra',   specialty: 'Support', icon: '36', rarity: 'S', attribute: 'ether' },
  { id: '1321', name: 'Evelyn',     faction: 'Stars of Lyra',   specialty: 'Attack',  icon: '37', rarity: 'S', attribute: 'fire' },
  
    // Mockingbird
  { id: '1291', name: 'Hugo',       faction: 'Mockingbird',     specialty: 'Attack', icon: '42', rarity: 'S', attribute: 'ice' },
  { id: '1331', name: 'Vivian',     faction: 'Mockingbird',     specialty: 'Anomaly', icon: '41', rarity: 'S', attribute: 'ether' },
  
    // Obol Squad (New Eridu Defense Force)
  { id: '1361', name: 'Trigger',    faction: 'Obol Squad',      specialty: 'Stun',  icon: '39', rarity: 'S', attribute: 'electric' },
  { id: '1461', name: 'Seed',       faction: 'Obol Squad',      specialty: 'Stun', icon: '48', rarity: 'S', attribute: 'electric' },
  { id: '1301', name: 'Orphie & Magus', faction: 'Obol Squad',  specialty: 'Attack', icon: '49', rarity: 'S', attribute: 'fire' },
  { id: '1381', name: 'Soldier 0',  faction: 'Obol Squad',      specialty: 'Attack',  icon: '40', rarity: 'S', attribute: 'electric' },
  
    // Yunkui Summit
  { id: '1371', name: 'Yixuan',     faction: 'Yunkui Summit',   specialty: 'Rupture',  icon: '44', rarity: 'S', attribute: 'auricink' },
  { id: '1391', name: 'Ju Fufu',    faction: 'Yunkui Summit',   specialty: 'Stun',    icon: '43', rarity: 'S', attribute: 'fire' },
  
    // Spook Shack
  { id: '1411', name: 'Yuzuha',     faction: 'Spook Shack',     specialty: 'Support',  icon: '47', rarity: 'S', attribute: 'physical' },
  { id: '1401', name: 'Alice',      faction: 'Spook Shack',     specialty: 'Anomaly', icon: '46', rarity: 'S', attribute: 'physical' },
  { id: '1451', name: 'Lucia',      faction: 'Spook Shack',     specialty: 'Support', icon: '50', rarity: 'S', attribute: 'ether' },
  { id: '1051', name: 'Yidhari',    faction: 'Spook Shack',     specialty: 'Rupture', icon: '52', rarity: 'S', attribute: 'ice' },

];