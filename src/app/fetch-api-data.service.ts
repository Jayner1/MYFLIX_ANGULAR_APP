import { Injectable } from "@angular/core";
import { catchError } from "rxjs";
import { HttpClient, HttpHeaders, HttpErrorResponse, } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map } from "rxjs/operators";

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://movie-api-08ww.onrender.com';
@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  /**
   * User registration
   * @service POST to the user endpoint
   * @param userDetails 
   * @returns A JSON object holding data about the added user
   * @function userRegistration
   */
  userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(`${apiUrl}/users`, userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * User login
   * @service POST to the login endpoint
   * @param userDetails 
   * @returns A JSON object holding data about the logged-in user
   * @function userLogin
   */
  userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(`${apiUrl}/login`, userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get all movies
   * @service GET all movies from movies endpoint
   * @returns A JSON abject holding data about all movies
   * @function getAllMovies
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http
      .get(`${apiUrl}/movies`, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get one movie
   * @service GET a single movie from the movies/:title endpoint
   * @param title 
   * @returns A JSON object holding data about one movie
   * @function getMovie
   */
  getMovie(title: string): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http
      .get(`${apiUrl}/movies/${title}`, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get director
   * @service GET data about a director by name from the movies/Director/:directorName endpoint
   * @param directorName 
   * @returns A JSON object holding data about the specified director
   * @function getDirector
   */
  getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http
      .get(`${apiUrl}/movies/directors/${directorName}`, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get genre
   * @service GET data about a genre by name from the movies/Genre/:genreName endpoint
   * @param genreName 
   * @returns A JSON object holding the name, description and movies of a genre
   * @function getGenre
   */
  getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http
      .get(`${apiUrl}/movies/genre/${genreName}`, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get user
   * @service GET the user data by name from the user/username endpoint
   * @returns A JSON object holding data about the user
   * @function getUser
   */
  getUser(): Observable<any> {
    const username = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    return this.http
      .get(`${apiUrl}/users/${username}`, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get favorite movies for a user
   * @service GET favorite movies from the user data by name from the user/username endpoint
   * @returns the user's favorite movies list
   * @function getFavoriteMovies
   */
  getFavoriteMovies(): Observable<any> {
    const username = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    return this.http
      .get(`${apiUrl}/users/${username}`, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + token,
        }),
      })
      .pipe(
        map(this.extractResponseData),
        map((data) => data.FavoriteMovies),
        catchError(this.handleError)
      );
  }

  /**
   * Add a movie to favorite movies
   * @service POST a movie to user's favorite movies list at endpoint /users/:Username/:movies/:MovieID
   * @param movieId 
   * @returns A JSON object holding the updated user data
   * @function addFavoriteMovie
   */
  addFavoriteMovie(movieId: string): Observable<any> {
    const username = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    return this.http
      .post(
        `${apiUrl}/users/${username}/movies/${movieId}`,
        { FavoriteMovie: movieId },
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Edit user
   * @service PUT request to update user at endpoint users/username
   * @param updatedUser 
   * @returns A JSON object holding the updated user data
   * @function editUser
   */
  editUser(updatedUser: any): Observable<any> {
    const username = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    return this.http
      .put(`${apiUrl}/users/${username}`, updatedUser, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Delete user
   * @service DELETE the user
   * @returns a message on delete
   * @function deleteUser
   */
  deleteUser(): Observable<any> {
    const username = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    return this.http
      .delete(`${apiUrl}/users/${username}`, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

   /**
   * Delete a movie from the favorite movies
   * @service DELETE favorite movie at endpoint /users/:Username/:movies/:MovieID
   * @param movieId 
   * @returns A JSON object holding the updated user data
   * @function removeFavoriteMovie
   */
  removeFavoriteMovie(movieId: string): Observable<any> {
    const username = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    return this.http
      .delete(`${apiUrl}/users/${username}/movies/${movieId}`, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Extract the response data from the HTTP response
   * @param res 
   * @returns the response body or an empty object
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
   * Handle API call errors
   * @param error 
   * @returns error message
   * @function handleError
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error("Some error occurred:", error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status},` + `Error body is: ${error.error}`
      );
    }
    return throwError("Something bad happened; please try again later");
  }
}