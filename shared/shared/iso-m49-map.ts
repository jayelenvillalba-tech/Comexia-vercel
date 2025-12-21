export const isoToM49: Record<string, string> = {
  'AR': '032', // Argentina
  'BR': '076', // Brazil
  'CL': '152', // Chile
  'CN': '156', // China
  'CO': '170', // Colombia
  'DE': '276', // Germany
  'ES': '724', // Spain
  'FR': '250', // France
  'GB': '826', // United Kingdom
  'IN': '356', // India
  'IT': '380', // Italy
  'JP': '392', // Japan
  'KR': '410', // Rep. of Korea
  'MX': '484', // Mexico
  'NL': '528', // Netherlands
  'PE': '604', // Peru
  'PY': '600', // Paraguay
  'RU': '643', // Russian Federation
  'US': '840', // USA
  'UY': '858', // Uruguay
  'VN': '704', // Viet Nam
  'ZA': '710', // South Africa
  'DZ': '012', // Algeria
  'AU': '036', // Australia
  'AT': '040', // Austria
  'BD': '050', // Bangladesh
  'BE': '056', // Belgium
  'BO': '068', // Bolivia
  'CA': '124', // Canada
  'CR': '188', // Costa Rica
  'HR': '191', // Croatia
  'CU': '192', // Cuba
  'CY': '196', // Cyprus
  'CZ': '203', // Czechia
  'DK': '208', // Denmark
  'DO': '214', // Dominican Rep
  'EC': '218', // Ecuador
  'EG': '818', // Egypt
  'SV': '222', // El Salvador
  'EE': '233', // Estonia
  'FI': '246', // Finland
  'GR': '300', // Greece
  'GT': '320', // Guatemala
  'HN': '340', // Honduras
  'HK': '344', // Hong Kong
  'HU': '348', // Hungary
  'ID': '360', // Indonesia
  'IE': '372', // Ireland
  'IL': '376', // Israel
  'JM': '388', // Jamaica
  'JO': '400', // Jordan
  'KZ': '398', // Kazakhstan
  'KE': '404', // Kenya
  'KW': '414', // Kuwait
  'LV': '428', // Latvia
  'LB': '422', // Lebanon
  'LT': '440', // Lithuania
  'LU': '442', // Luxembourg
  'MY': '458', // Malaysia
  'MA': '504', // Morocco
  'NZ': '554', // New Zealand
  'NI': '558', // Nicaragua
  'NO': '578', // Norway
  'OM': '512', // Oman
  'PK': '586', // Pakistan
  'PA': '591', // Panama
  'PH': '608', // Philippines
  'PL': '616', // Poland
  'PT': '620', // Portugal
  'QA': '634', // Qatar
  'RO': '642', // Romania
  'SA': '682', // Saudi Arabia
  'SG': '702', // Singapore
  'SK': '703', // Slovakia
  'SI': '705', // Slovenia
  'SE': '752', // Sweden
  'CH': '756', // Switzerland
  'TW': '158', // Taiwan
  'TH': '764', // Thailand
  'TR': '792', // Turkey
  'UA': '804', // Ukraine
  'AE': '784', // UAE
  'GB': '826', // UK
  'VE': '862', // Venezuela
};

export const m49ToIso: Record<string, string> = Object.entries(isoToM49).reduce((acc, [iso, m49]) => {
  acc[m49] = iso;
  return acc;
}, {} as Record<string, string>);

export function getM49Code(isoCode: string): string | undefined {
  return isoToM49[isoCode.toUpperCase()];
}

export function getIsoCode(m49Code: string): string | undefined {
  return m49ToIso[m49Code];
}
