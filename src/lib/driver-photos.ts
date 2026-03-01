// F1 2025 driver headshot URLs via OpenF1 media CDN
const DRIVER_PHOTOS: Record<string, string> = {
  max_verstappen: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png",
  lando_norris: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png",
  charles_leclerc: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png",
  oscar_piastri: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png",
  carlos_sainz: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png",
  lewis_hamilton: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png",
  george_russell: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png",
  sergio_perez: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png",
  fernando_alonso: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png",
  lance_stroll: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png",
  pierre_gasly: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png",
  esteban_ocon: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png",
  alexander_albon: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png",
  yuki_tsunoda: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png",
  daniel_ricciardo: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/D/DANRIC01_Daniel_Ricciardo/danric01.png",
  nico_hulkenberg: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png",
  kevin_magnussen: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/K/KEVMAG01_Kevin_Magnussen/kevmag01.png",
  valtteri_bottas: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png",
  guanyu_zhou: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GUAZHO01_Guanyu_Zhou/guazho01.png",
  logan_sargeant: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LOGSAR01_Logan_Sargeant/logsar01.png",
  liam_lawson: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png",
  oliver_bearman: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png",
  jack_doohan: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/J/JACDOO01_Jack_Doohan/jacdoo01.png",
  isack_hadjar: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png",
  gabriel_bortoleto: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabbor01.png",
  andrea_kimi_antonelli: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ANDANT01_Andrea_Kimi_Antonelli/andant01.png",
};

// Aliases for various API ID formats
const DRIVER_ID_ALIASES: Record<string, string> = {
  verstappen: "max_verstappen",
  norris: "lando_norris",
  leclerc: "charles_leclerc",
  piastri: "oscar_piastri",
  sainz: "carlos_sainz",
  hamilton: "lewis_hamilton",
  russell: "george_russell",
  perez: "sergio_perez",
  alonso: "fernando_alonso",
  stroll: "lance_stroll",
  gasly: "pierre_gasly",
  ocon: "esteban_ocon",
  albon: "alexander_albon",
  tsunoda: "yuki_tsunoda",
  ricciardo: "daniel_ricciardo",
  hulkenberg: "nico_hulkenberg",
  magnussen: "kevin_magnussen",
  bottas: "valtteri_bottas",
  zhou: "guanyu_zhou",
  sargeant: "logan_sargeant",
  lawson: "liam_lawson",
  bearman: "oliver_bearman",
  doohan: "jack_doohan",
  hadjar: "isack_hadjar",
  bortoleto: "gabriel_bortoleto",
  antonelli: "andrea_kimi_antonelli",
  colapinto: "logan_sargeant", // fallback
};

export function getDriverPhoto(driverId: string): string {
  const normalized = driverId.toLowerCase();
  const key = DRIVER_ID_ALIASES[normalized] || normalized;
  return DRIVER_PHOTOS[key] || "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/default.png";
}
