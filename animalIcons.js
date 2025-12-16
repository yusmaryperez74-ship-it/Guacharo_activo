// Mapeo de animales a sus emojis/iconos - 76 ANIMALES OFICIALES GUÁCHARO ACTIVO
export const animalIcons = {
  // 00-09
  'Ballena': '🐋',
  'Delfín': '🐬',
  'Carnero': '🐏',
  'Toro': '🐂',
  'Ciempiés': '🐛',
  'Alacrán': '🦂',
  'León': '🦁',
  'Rana': '🐸',
  'Perico': '🦜',
  'Ratón': '🐭',
  'Águila': '🦅',
  
  // 10-19
  'Tigre': '🐯',
  'Gato': '🐱',
  'Caballo': '🐴',
  'Mono': '🐵',
  'Paloma': '🕊️',
  'Zorro': '🦊',
  'Oso': '🐻',
  'Pavo': '🦃',
  'Burro': '🫏',
  'Chivo': '🐐',
  
  // 20-29
  'Cochino': '🐷',
  'Gallo': '🐓',
  'Camello': '🐫',
  'Cebra': '🦓',
  'Iguana': '🦎',
  'Gallina': '🐔',
  'Vaca': '🐄',
  'Perro': '🐕',
  'Zamuro': '🦅',
  'Elefante': '🐘',
  
  // 30-39
  'Caimán': '🐊',
  'Lapa': '🐰',
  'Ardilla': '🐿️',
  'Pescado': '🐟',
  'Venado': '🦌',
  'Jirafa': '🦒',
  'Culebra': '🐍',
  'Tortuga': '🐢',
  'Búfalo': '🐃',
  'Lechuza': '🦉',
  
  // 40-49
  'Avispa': '🐝',
  'Canguro': '🦘',
  'Tucán': '🦜',
  'Mariposa': '🦋',
  'Chigüire': '🦫',
  'Garza': '🦢',
  'Puma': '🐆',
  'Pavo Real': '🦚',
  'Puercoespín': '🦔',
  'Pereza': '🦥',
  
  // 50-59
  'Canario': '🐤',
  'Pelícano': '🦆',
  'Pulpo': '🐙',
  'Caracol': '🐌',
  'Grillo': '🦗',
  'Oso Hormiguero': '🐻',
  'Tiburón': '🦈',
  'Pato': '🦆',
  'Hormiga': '🐜',
  'Pantera': '🐆',
  
  // 60-69
  'Camaleón': '🦎',
  'Panda': '🐼',
  'Cachicamo': '🦔',
  'Cangrejo': '🦀',
  'Gavilán': '🦅',
  'Araña': '🕷️',
  'Lobo': '🐺',
  'Avestruz': '🦤',
  'Jaguar': '🐆',
  'Conejo': '🐰',
  
  // 70-75
  'Bisonte': '🦬',
  'Guacamaya': '🦜',
  'Gorila': '🦍',
  'Hipopótamo': '🦛',
  'Turpial': '🐦',
  'Guácharo': '🦇',
};

// Función para obtener el icono de un animal
export const getAnimalIcon = (animalName) => {
  if (!animalName) return '🎲';
  
  // Normalizar el nombre (quitar acentos, mayúsculas, espacios)
  const normalized = animalName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
  
  // Buscar coincidencia exacta primero
  for (const [key, icon] of Object.entries(animalIcons)) {
    const normalizedKey = key
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    
    if (normalizedKey === normalized) {
      return icon;
    }
  }
  
  // Buscar coincidencia parcial
  for (const [key, icon] of Object.entries(animalIcons)) {
    const normalizedKey = key
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    
    if (normalizedKey.includes(normalized) || normalized.includes(normalizedKey)) {
      return icon;
    }
  }
  
  // Si no se encuentra, retornar un icono genérico
  return '🎲';
};

// Función para obtener el icono por número - 77 ANIMALES COMPLETOS
export const getAnimalIconByNumber = (numero) => {
  const animalMap = {
    // 00-09
    100: '🐋',  // Ballena (00)
    0: '🐬',    // Delfín
    1: '🐏',    // Carnero
    2: '🐂',    // Toro
    3: '🐛',    // Ciempiés
    4: '🦂',    // Alacrán
    5: '🦁',    // León
    6: '🐸',    // Rana
    7: '🦜',    // Perico
    8: '🐭',    // Ratón
    9: '🦅',    // Águila
    
    // 10-19
    10: '🐯',   // Tigre
    11: '🐱',   // Gato
    12: '🐴',   // Caballo
    13: '🐵',   // Mono
    14: '🕊️',   // Paloma
    15: '🦊',   // Zorro
    16: '🐻',   // Oso
    17: '🦃',   // Pavo
    18: '🫏',   // Burro
    19: '🐐',   // Chivo
    
    // 20-29
    20: '🐷',   // Cochino
    21: '🐓',   // Gallo
    22: '🐫',   // Camello
    23: '🦓',   // Cebra
    24: '🦎',   // Iguana
    25: '🐔',   // Gallina
    26: '🐄',   // Vaca
    27: '🐕',   // Perro
    28: '🦅',   // Zamuro
    29: '🐘',   // Elefante
    
    // 30-39
    30: '🐊',   // Caimán
    31: '🐢',   // Lapa
    32: '🐿️',   // Ardilla
    33: '🐟',   // Pescado
    34: '🦌',   // Venado
    35: '🦒',   // Jirafa
    36: '🐍',   // Culebra
    37: '🐢',   // Tortuga
    38: '🦉',   // Lechuza
    39: '🦫',   // Chigüire
    
    // 40-49
    40: '🦤',   // Avestruz
    41: '🦘',   // Canguro
    42: '🐢',   // Morrocoy
    43: '🐪',   // Jorobado
    44: '🦩',   // Garza
    45: '🐋',   // Ballena
    46: '🐆',   // Puma
    47: '🦚',   // Pavo Real
    48: '🐜',   // Hormiga
    49: '🐻',   // Oso Hormiguero
    
    // 50-59
    50: '🦥',   // Pereza
    51: '🐤',   // Canario
    52: '🦜',   // Cotorra
    53: '🐙',   // Pulpo
    54: '🐌',   // Caracol
    55: '🦗',   // Grillo
    56: '🦝',   // Mapache
    57: '🦈',   // Tiburón
    58: '🦆',   // Pato
    59: '🦇',   // Murciélago
    
    // 60-69
    60: '🦦',   // Nutria
    61: '🦎',   // Camaleón
    62: '🦏',   // Rinoceronte
    63: '🦔',   // Cachicamo
    64: '🦅',   // Gavilán
    65: '🕷️',   // Araña
    66: '🐸',   // Sapo
    67: '🦡',   // Comadreja
    68: '🐰',   // Conejo
    69: '🐍',   // Serpiente
    
    // 70-75
    70: '🦜',   // Guacamaya
    71: '🐊',   // Cocodrilo
    72: '🦛',   // Hipopótamo
    73: '🐆',   // Pantera
    74: '🦅',   // Cuervo
    75: '🦉',   // Búho
  };
  
  return animalMap[numero] || '🎲';
};

// Función para obtener color por animal (para variedad visual)
export const getAnimalColor = (numero) => {
  const colors = [
    '#8B5CF6', // Morado
    '#A78BFA', // Morado claro
    '#C4B5FD', // Morado muy claro
    '#EC4899', // Rosa
    '#F472B6', // Rosa claro
    '#D946EF', // Magenta
    '#7C3AED', // Morado oscuro
    '#6D28D9', // Morado muy oscuro
  ];
  
  return colors[numero % colors.length];
};

export default {
  animalIcons,
  getAnimalIcon,
  getAnimalIconByNumber,
  getAnimalColor,
};
