import { db, initDatabase, saveDatabase } from '../../database/db-sqlite.js';
import { countryBaseRequirements } from '../../shared/shared/schema-sqlite.js';
import { getIsoCode } from '../../shared/shared/iso-m49-map.js';

// Full list of 190+ countries with minimal data for seed
// Using ISO Alpha-2 as key
const globalCountries = [
  // --- AMERICAS (35) ---
  { code: 'AG', name: 'Antigua and Barbuda', region: 'Americas' },
  { code: 'AR', name: 'Argentina', region: 'Americas' },
  { code: 'BS', name: 'Bahamas', region: 'Americas' },
  { code: 'BB', name: 'Barbados', region: 'Americas' },
  { code: 'BZ', name: 'Belize', region: 'Americas' },
  { code: 'BO', name: 'Bolivia', region: 'Americas' },
  { code: 'BR', name: 'Brazil', region: 'Americas' },
  { code: 'CA', name: 'Canada', region: 'Americas' },
  { code: 'CL', name: 'Chile', region: 'Americas' },
  { code: 'CO', name: 'Colombia', region: 'Americas' },
  { code: 'CR', name: 'Costa Rica', region: 'Americas' },
  { code: 'CU', name: 'Cuba', region: 'Americas' },
  { code: 'DM', name: 'Dominica', region: 'Americas' },
  { code: 'DO', name: 'Dominican Republic', region: 'Americas' },
  { code: 'EC', name: 'Ecuador', region: 'Americas' },
  { code: 'SV', name: 'El Salvador', region: 'Americas' },
  { code: 'GD', name: 'Grenada', region: 'Americas' },
  { code: 'GT', name: 'Guatemala', region: 'Americas' },
  { code: 'GY', name: 'Guyana', region: 'Americas' },
  { code: 'HT', name: 'Haiti', region: 'Americas' },
  { code: 'HN', name: 'Honduras', region: 'Americas' },
  { code: 'JM', name: 'Jamaica', region: 'Americas' },
  { code: 'MX', name: 'Mexico', region: 'Americas' },
  { code: 'NI', name: 'Nicaragua', region: 'Americas' },
  { code: 'PA', name: 'Panama', region: 'Americas' },
  { code: 'PY', name: 'Paraguay', region: 'Americas' },
  { code: 'PE', name: 'Peru', region: 'Americas' },
  { code: 'KN', name: 'Saint Kitts and Nevis', region: 'Americas' },
  { code: 'LC', name: 'Saint Lucia', region: 'Americas' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', region: 'Americas' },
  { code: 'SR', name: 'Suriname', region: 'Americas' },
  { code: 'TT', name: 'Trinidad and Tobago', region: 'Americas' },
  { code: 'US', name: 'United States of America', region: 'Americas' },
  { code: 'UY', name: 'Uruguay', region: 'Americas' },
  { code: 'VE', name: 'Venezuela', region: 'Americas' },

  // --- EUROPE (44) ---
  { code: 'AL', name: 'Albania', region: 'Europe' },
  { code: 'AD', name: 'Andorra', region: 'Europe' },
  { code: 'AT', name: 'Austria', region: 'Europe' },
  { code: 'BY', name: 'Belarus', region: 'Europe' },
  { code: 'BE', name: 'Belgium', region: 'Europe' },
  { code: 'BA', name: 'Bosnia and Herzegovina', region: 'Europe' },
  { code: 'BG', name: 'Bulgaria', region: 'Europe' },
  { code: 'HR', name: 'Croatia', region: 'Europe' },
  { code: 'CY', name: 'Cyprus', region: 'Europe' },
  { code: 'CZ', name: 'Czechia', region: 'Europe' },
  { code: 'DK', name: 'Denmark', region: 'Europe' },
  { code: 'EE', name: 'Estonia', region: 'Europe' },
  { code: 'FI', name: 'Finland', region: 'Europe' },
  { code: 'FR', name: 'France', region: 'Europe' },
  { code: 'DE', name: 'Germany', region: 'Europe' },
  { code: 'GR', name: 'Greece', region: 'Europe' },
  { code: 'HU', name: 'Hungary', region: 'Europe' },
  { code: 'IS', name: 'Iceland', region: 'Europe' },
  { code: 'IE', name: 'Ireland', region: 'Europe' },
  { code: 'IT', name: 'Italy', region: 'Europe' },
  { code: 'XK', name: 'Kosovo', region: 'Europe' },
  { code: 'LV', name: 'Latvia', region: 'Europe' },
  { code: 'LI', name: 'Liechtenstein', region: 'Europe' },
  { code: 'LT', name: 'Lithuania', region: 'Europe' },
  { code: 'LU', name: 'Luxembourg', region: 'Europe' },
  { code: 'MT', name: 'Malta', region: 'Europe' },
  { code: 'MD', name: 'Moldova', region: 'Europe' },
  { code: 'MC', name: 'Monaco', region: 'Europe' },
  { code: 'ME', name: 'Montenegro', region: 'Europe' },
  { code: 'NL', name: 'Netherlands', region: 'Europe' },
  { code: 'MK', name: 'North Macedonia', region: 'Europe' },
  { code: 'NO', name: 'Norway', region: 'Europe' },
  { code: 'PL', name: 'Poland', region: 'Europe' },
  { code: 'PT', name: 'Portugal', region: 'Europe' },
  { code: 'RO', name: 'Romania', region: 'Europe' },
  { code: 'RU', name: 'Russian Federation', region: 'Europe' },
  { code: 'SM', name: 'San Marino', region: 'Europe' },
  { code: 'RS', name: 'Serbia', region: 'Europe' },
  { code: 'SK', name: 'Slovakia', region: 'Europe' },
  { code: 'SI', name: 'Slovenia', region: 'Europe' },
  { code: 'ES', name: 'Spain', region: 'Europe' },
  { code: 'SE', name: 'Sweden', region: 'Europe' },
  { code: 'CH', name: 'Switzerland', region: 'Europe' },
  { code: 'UA', name: 'Ukraine', region: 'Europe' },
  { code: 'GB', name: 'United Kingdom', region: 'Europe' },
  { code: 'VA', name: 'Holy See', region: 'Europe' },

  // --- ASIA (47) ---
  { code: 'AF', name: 'Afghanistan', region: 'Asia' },
  { code: 'AM', name: 'Armenia', region: 'Asia' },
  { code: 'AZ', name: 'Azerbaijan', region: 'Asia' },
  { code: 'BH', name: 'Bahrain', region: 'Asia' },
  { code: 'BD', name: 'Bangladesh', region: 'Asia' },
  { code: 'BT', name: 'Bhutan', region: 'Asia' },
  { code: 'BN', name: 'Brunei Darussalam', region: 'Asia' },
  { code: 'KH', name: 'Cambodia', region: 'Asia' },
  { code: 'CN', name: 'China', region: 'Asia' },
  { code: 'GE', name: 'Georgia', region: 'Asia' },
  { code: 'IN', name: 'India', region: 'Asia' },
  { code: 'ID', name: 'Indonesia', region: 'Asia' },
  { code: 'IR', name: 'Iran', region: 'Asia' },
  { code: 'IQ', name: 'Iraq', region: 'Asia' },
  { code: 'IL', name: 'Israel', region: 'Asia' },
  { code: 'JP', name: 'Japan', region: 'Asia' },
  { code: 'JO', name: 'Jordan', region: 'Asia' },
  { code: 'KZ', name: 'Kazakhstan', region: 'Asia' },
  { code: 'KW', name: 'Kuwait', region: 'Asia' },
  { code: 'KG', name: 'Kyrgyzstan', region: 'Asia' },
  { code: 'LA', name: 'Lao PDR', region: 'Asia' },
  { code: 'LB', name: 'Lebanon', region: 'Asia' },
  { code: 'MY', name: 'Malaysia', region: 'Asia' },
  { code: 'MV', name: 'Maldives', region: 'Asia' },
  { code: 'MN', name: 'Mongolia', region: 'Asia' },
  { code: 'MM', name: 'Myanmar', region: 'Asia' },
  { code: 'NP', name: 'Nepal', region: 'Asia' },
  { code: 'KP', name: 'North Korea', region: 'Asia' },
  { code: 'OM', name: 'Oman', region: 'Asia' },
  { code: 'PK', name: 'Pakistan', region: 'Asia' },
  { code: 'PS', name: 'Palestine', region: 'Asia' },
  { code: 'PH', name: 'Philippines', region: 'Asia' },
  { code: 'QA', name: 'Qatar', region: 'Asia' },
  { code: 'SA', name: 'Saudi Arabia', region: 'Asia' },
  { code: 'SG', name: 'Singapore', region: 'Asia' },
  { code: 'KR', name: 'South Korea', region: 'Asia' },
  { code: 'LK', name: 'Sri Lanka', region: 'Asia' },
  { code: 'SY', name: 'Syrian Arab Republic', region: 'Asia' },
  { code: 'TW', name: 'Taiwan', region: 'Asia' },
  { code: 'TJ', name: 'Tajikistan', region: 'Asia' },
  { code: 'TH', name: 'Thailand', region: 'Asia' },
  { code: 'TR', name: 'Turkey', region: 'Asia' },
  { code: 'TM', name: 'Turkmenistan', region: 'Asia' },
  { code: 'AE', name: 'United Arab Emirates', region: 'Asia' },
  { code: 'UZ', name: 'Uzbekistan', region: 'Asia' },
  { code: 'VN', name: 'Viet Nam', region: 'Asia' },
  { code: 'YE', name: 'Yemen', region: 'Asia' },

  // --- AFRICA (54) ---
  { code: 'DZ', name: 'Algeria', region: 'Africa' },
  { code: 'AO', name: 'Angola', region: 'Africa' },
  { code: 'BJ', name: 'Benin', region: 'Africa' },
  { code: 'BW', name: 'Botswana', region: 'Africa' },
  { code: 'BF', name: 'Burkina Faso', region: 'Africa' },
  { code: 'BI', name: 'Burundi', region: 'Africa' },
  { code: 'CV', name: 'Cabo Verde', region: 'Africa' },
  { code: 'CM', name: 'Cameroon', region: 'Africa' },
  { code: 'CF', name: 'Central African Republic', region: 'Africa' },
  { code: 'TD', name: 'Chad', region: 'Africa' },
  { code: 'KM', name: 'Comoros', region: 'Africa' },
  { code: 'CG', name: 'Congo', region: 'Africa' },
  { code: 'CD', name: 'DR Congo', region: 'Africa' },
  { code: 'CI', name: 'Ivory Coast', region: 'Africa' },
  { code: 'DJ', name: 'Djibouti', region: 'Africa' },
  { code: 'EG', name: 'Egypt', region: 'Africa' },
  { code: 'GQ', name: 'Equatorial Guinea', region: 'Africa' },
  { code: 'ER', name: 'Eritrea', region: 'Africa' },
  { code: 'SZ', name: 'Eswatini', region: 'Africa' },
  { code: 'ET', name: 'Ethiopia', region: 'Africa' },
  { code: 'GA', name: 'Gabon', region: 'Africa' },
  { code: 'GM', name: 'Gambia', region: 'Africa' },
  { code: 'GH', name: 'Ghana', region: 'Africa' },
  { code: 'GN', name: 'Guinea', region: 'Africa' },
  { code: 'GW', name: 'Guinea-Bissau', region: 'Africa' },
  { code: 'KE', name: 'Kenya', region: 'Africa' },
  { code: 'LS', name: 'Lesotho', region: 'Africa' },
  { code: 'LR', name: 'Liberia', region: 'Africa' },
  { code: 'LY', name: 'Libya', region: 'Africa' },
  { code: 'MG', name: 'Madagascar', region: 'Africa' },
  { code: 'MW', name: 'Malawi', region: 'Africa' },
  { code: 'ML', name: 'Mali', region: 'Africa' },
  { code: 'MR', name: 'Mauritania', region: 'Africa' },
  { code: 'MU', name: 'Mauritius', region: 'Africa' },
  { code: 'MA', name: 'Morocco', region: 'Africa' },
  { code: 'MZ', name: 'Mozambique', region: 'Africa' },
  { code: 'NA', name: 'Namibia', region: 'Africa' },
  { code: 'NE', name: 'Niger', region: 'Africa' },
  { code: 'NG', name: 'Nigeria', region: 'Africa' },
  { code: 'RW', name: 'Rwanda', region: 'Africa' },
  { code: 'ST', name: 'Sao Tome and Principe', region: 'Africa' },
  { code: 'SN', name: 'Senegal', region: 'Africa' },
  { code: 'SC', name: 'Seychelles', region: 'Africa' },
  { code: 'SL', name: 'Sierra Leone', region: 'Africa' },
  { code: 'SO', name: 'Somalia', region: 'Africa' },
  { code: 'ZA', name: 'South Africa', region: 'Africa' },
  { code: 'SS', name: 'South Sudan', region: 'Africa' },
  { code: 'SD', name: 'Sudan', region: 'Africa' },
  { code: 'TZ', name: 'Tanzania', region: 'Africa' },
  { code: 'TG', name: 'Togo', region: 'Africa' },
  { code: 'TN', name: 'Tunisia', region: 'Africa' },
  { code: 'UG', name: 'Uganda', region: 'Africa' },
  { code: 'ZM', name: 'Zambia', region: 'Africa' },
  { code: 'ZW', name: 'Zimbabwe', region: 'Africa' },

  // --- OCEANIA (14) ---
  { code: 'AU', name: 'Australia', region: 'Oceania' },
  { code: 'FJ', name: 'Fiji', region: 'Oceania' },
  { code: 'KI', name: 'Kiribati', region: 'Oceania' },
  { code: 'MH', name: 'Marshall Islands', region: 'Oceania' },
  { code: 'FM', name: 'Micronesia', region: 'Oceania' },
  { code: 'NR', name: 'Nauru', region: 'Oceania' },
  { code: 'NZ', name: 'New Zealand', region: 'Oceania' },
  { code: 'PW', name: 'Palau', region: 'Oceania' },
  { code: 'PG', name: 'Papua New Guinea', region: 'Oceania' },
  { code: 'WS', name: 'Samoa', region: 'Oceania' },
  { code: 'SB', name: 'Solomon Islands', region: 'Oceania' },
  { code: 'TO', name: 'Tonga', region: 'Oceania' },
  { code: 'TV', name: 'Tuvalu', region: 'Oceania' },
  { code: 'VU', name: 'Vanuatu', region: 'Oceania' }
];

async function seedGlobalCountries() {
  console.log('🌍 Seeding Global Countries (190+)...');
  
  // Initialize Database
  const db = await initDatabase();
  
  // Clean up if you want a fresh start, slightly risky if we have relations
  // await db.delete(countryBaseRequirements);

  for (const country of globalCountries) {
    // Basic Requirements
    let baseDocs = [
        { name: "Factura Comercial", importance: "Mandatory" },
        { name: "Packing List", importance: "Mandatory" },
        { name: "Documento de Transporte", importance: "Mandatory" }
    ];

    if (country.code === 'CN' || country.code === 'SA' || country.code === 'AE') {
        baseDocs.push({ name: "Certificado de Origen (Visado)", importance: "Mandatory" });
    }

    try {
        await db.insert(countryBaseRequirements).values({
            countryCode: country.code,
            tradeBloc: country.region,
            baseDocuments: JSON.stringify(baseDocs),
            generalCustomsProcess: `Standard ${country.name} Import Procedure`
        }).onConflictDoUpdate({
            target: countryBaseRequirements.countryCode,
            set: {
                tradeBloc: country.region,
                baseDocuments: JSON.stringify(baseDocs)
            }
        });
        process.stdout.write('.');
    } catch (e) {
        console.error(`Error seeding ${country.name}:`, e);
    }
  }
  
  console.log('\n✅ Seed Completed: 190+ Countries');
  saveDatabase();
}

seedGlobalCountries().catch(console.error);
