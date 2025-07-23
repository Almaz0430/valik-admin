// import { useState } from 'react';
// import authService from '../services/authService';

// interface UseApiOptions<T> {
//   onSuccess?: (data: T) => void;
//   onError?: (error: Error) => void;
// }

// /**
//  * Хук для взаимодействия с API с автоматическим обновлением токена
//  */
// export const useApi = <T,>() => {
//   const [data, setData] = useState<T | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<Error | null>(null);

//   /**
//    * Выполнение запроса GET
//    */
//   const get = async (url: string, options?: UseApiOptions<T>): Promise<T | null> => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const response = await authService.fetchWithAuth(url);
      
//       if (!response.ok) {
//         throw new Error(`Ошибка запроса: ${response.status}`);
//       }
      
//       const responseData = await response.json() as T;
//       setData(responseData);
//       options?.onSuccess?.(responseData);
      
//       return responseData;
//     } catch (err) {
//       const errorObj = err instanceof Error ? err : new Error('Неизвестная ошибка');
//       setError(errorObj);
//       options?.onError?.(errorObj);
//       return null;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /**
//    * Выполнение запроса POST
//    */
//   const post = async <D,>(url: string, postData: D, options?: UseApiOptions<T>): Promise<T | null> => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const response = await authService.fetchWithAuth(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(postData),
//       });
      
//       if (!response.ok) {
//         throw new Error(`Ошибка запроса: ${response.status}`);
//       }
      
//       const responseData = await response.json() as T;
//       setData(responseData);
//       options?.onSuccess?.(responseData);
      
//       return responseData;
//     } catch (err) {
//       const errorObj = err instanceof Error ? err : new Error('Неизвестная ошибка');
//       setError(errorObj);
//       options?.onError?.(errorObj);
//       return null;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /**
//    * Выполнение запроса PUT
//    */
//   const put = async <D,>(url: string, putData: D, options?: UseApiOptions<T>): Promise<T | null> => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const response = await authService.fetchWithAuth(url, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(putData),
//       });
      
//       if (!response.ok) {
//         throw new Error(`Ошибка запроса: ${response.status}`);
//       }
      
//       const responseData = await response.json() as T;
//       setData(responseData);
//       options?.onSuccess?.(responseData);
      
//       return responseData;
//     } catch (err) {
//       const errorObj = err instanceof Error ? err : new Error('Неизвестная ошибка');
//       setError(errorObj);
//       options?.onError?.(errorObj);
//       return null;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /**
//    * Выполнение запроса DELETE
//    */
//   const remove = async (url: string, options?: UseApiOptions<T>): Promise<T | null> => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const response = await authService.fetchWithAuth(url, {
//         method: 'DELETE',
//       });
      
//       if (!response.ok) {
//         throw new Error(`Ошибка запроса: ${response.status}`);
//       }
      
//       const responseData = await response.json() as T;
//       setData(responseData);
//       options?.onSuccess?.(responseData);
      
//       return responseData;
//     } catch (err) {
//       const errorObj = err instanceof Error ? err : new Error('Неизвестная ошибка');
//       setError(errorObj);
//       options?.onError?.(errorObj);
//       return null;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     data,
//     isLoading,
//     error,
//     get,
//     post,
//     put,
//     remove,
//   };
// };

// export default useApi; 