/**
 * Constante con datos de uso global en la aplicación.
 * @type {Object}
 */
export const GLOBAL = {
  nombre: "Comunidad de regantes Pozo la Luna", // nombre largo de la comunidad
  nombreAbr: "C.R Pozo la luna", // nombre corto de la comunidad
  url: "https://jmmanzano.es/proyecto", //diferentes urls
  urlBackend: "https://jmmanzano.es/proyecto/php/index.php",
  urlLogin: "https://jmmanzano.es/proyecto/php/login.php",
  urlConfig: "https://jmmanzano.es/proyecto/php/config.php",
  pHora: 25,// precio por hora de riego
  es: { // configuración regional para las fechas
    firstDayOfWeek: 1,
    dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
    dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
    monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
  },
  csvConf: { // configuración para la exportación del csv
    delimiter: "\t",
    quote: "",
    newLine: "\r",
    includeHeaderLine: true
    }
}
