/**
 * Класс для отправки запросов к серверу
 */
export default class ApiService {
  /**
   * @param {string} endPoint Адрес сервера
   * @param {string} authorization Авторизационный токен
   */
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  /**
   * Метод для отправки запроса к серверу
   * @param {Object} config Объект с настройками
   * @param {string} config.url Адрес относительно сервера
   * @param {string} [config.method] Метод запроса
   * @param {string} [config.body] Тело запроса
   * @param {Headers} [config.headers] Заголовки запроса
   * @returns {Promise<Response>}
   */
  async _load({
    url,
    method = 'GET',
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    const response = await fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      await ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  /**
   * Метод для обработки ответа
   * @param {Response} response Объект ответа
   * @returns {Promise}
   */
  static parseResponse(response) {
    return response.json();
  }

  /**
   * Метод для проверки ответа
   * @param {Response} response Объект ответа
   */
  //TODO заменить метод на оригинальный static checkStatus(response) {
  //   if (!response.ok) {
  //     throw new Error(`${response.status}: ${response.statusText}`);
  //   }
  // }

  static async checkStatus(response) {
    if (!response.ok) {
      let errorMessage = `${response.status}: ${response.statusText}`;
      try {
        const errorBody = await response.json(); // читаем JSON с ошибкой
        console.error('[API ERROR BODY]', errorBody);
        errorMessage += `\n${JSON.stringify(errorBody, null, 2)}`;
      } catch {
      // если тело не JSON, оставляем только статус
      }
      throw new Error(errorMessage);
    }
  }

  /**
   * Метод для обработки ошибок
   * @param {Error} err Объект ошибки
   */
  static catchError(err) {
    throw err;
  }
}
