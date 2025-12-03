export interface AgentIndex {
  id: string;
  name: string;
  specialty: string;
  faction: string;
  icon: string;
  rarity: 'A' | 'S';
  attribute: 'ether' | 'fire' | 'ice' | 'physical' | 'electric' | 'auricink' | 'frost';
}