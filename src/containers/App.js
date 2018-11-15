import React, { Component } from 'react';
import Navigation from "./Navigation/Navigation"
import Layout from './Layout/Layout'; 
import axios from 'axios'; 
import MovieRow from '../components/MovieRow/MovieRow'
import Modal from '../components/UI/Modal/Modal'; 
import MovieSummary from '../components/MovieRow/MovieSummary/MovieSummary'; 



class App extends Component {

  state = {
    toggleMovieList: true,
    //an array that will hold all of our movies component 
    rows: [],
    toggleModal: false,
    movieDetails: {},
  }

makeAipCall = (searchItem) => {
  const url = `https://api.themoviedb.org/3/search/multi?api_key=9ea839ec7891591994ec0f540b4b199f&language=en-US&include_adult=false&query=${searchItem}`;
      axios.get(url)
         .then(res => {
            console.log(res.data.results); 
            // extract the data from json object 
            const results = res.data.results;
            let movieImageUrl; 
            let movieRows = [];
            results.forEach((movie) => {
               // manually build our image url and set it on the movie object 
               if (movie.poster_path !== null && movie.media_type !== "person") {
                  movieImageUrl = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
                 // pass in the movie object to our MovieRow component and keep it in a variable called 
                 // movieComponent 
                 const movieComponent = <MovieRow
                   movieDetails={() => this.selectMovieHandler(movie.id)}
                   key={movie.id}
                   movieImage={movieImageUrl}
                   movie={movie} />
                 // push our movieComponent to our movieRows array; 
                 movieRows.push(movieComponent);
               } 
              
            })
            // update state 
            this.setState({ rows: movieRows });
         }).catch(error => {
            console.log(error);
         });
   }

  onSearchHandler = (event) => {
    this.setState({
      toggleMovieList: false
    }); 
    const userInput = event.target.value; 
    this.makeAipCall(userInput); 
    console.log(userInput);

    if (userInput === "") {
      this.setState({
        toggleMovieList: true
      }); 
    } 
  }

  selectMovieHandler = (movieId) => {
    this.setState({toggleModal: true}); 
    console.log(movieId); 
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=224ce27b38a3805ecf6f6c36eb3ba9d0&append_to_response=tv,videos`;
    axios.get(url)
      .then(res => {

        const movieData = res.data; 
        console.log(movieData); 
        this.setState({movieDetails: movieData}); 
      }).catch(error => {

        console.log(error); 
      }); 
  
  }

  closeModal = () => {
    this.setState({ toggleModal: false }); 
  }

   render() {

      return (
         <div>  
          <Navigation showMovies={this.onSearchHandler} />
          {this.state.toggleMovieList ? <Layout /> : <div //onClick={this.onChangeHandler} 
                                            className="search-container">{this.state.rows}</div>}
          <Modal show={this.state.toggleModal} modalClosed={this.closeModal}>
            <MovieSummary movie={this.state.movieDetails}/>
          </Modal>  
         </div>

      );
   }
}

export default App; 








// curl --request GET \
// --url 'https://api.themoviedb.org/3/find/ur95210597?api_key=224ce27b38a3805ecf6f6c36eb3ba9d0&language=en-US&external_source=imdb_id' \
//   --data '{}'