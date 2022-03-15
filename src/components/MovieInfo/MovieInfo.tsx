import React, { FC, useEffect, useState } from 'react';
import styles from './MovieInfo.module.scss';
import '../MovieInfo/MovieInfo.module.scss';
import { useParams } from 'react-router-dom';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import { Alert, Box, Fade, Modal, Rating, Snackbar } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';

interface MovieInfoProps { }


const MovieInfo: FC<MovieInfoProps> = () => {

  const { id } = useParams();

  const [data, setData] = useState(null);

  const [releaseDate, setReleaseDate] = useState(null);

  const [duration, setDuration] = useState(null);

  const [friendRating, setFriendRating] = useState('?');

  const [personalRating, setPersonalRating] = useState(null);

  const [addedToMyList, setAddedToMyList] = useState(false);

  //Modal Variables
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => { setOpenModal(true); setStarRatingValue(personalRating); }
  const handleCloseModal = () => setOpenModal(false);
  const [starRatingValue, setStarRatingValue] = useState(null);

  //Rating Feedback Variables
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const showSnackbarFeedback = () => setOpenSnackbar(true);


  var token = localStorage.getItem('token');




  const getMovieDetails = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };
    fetch(`${process.env.REACT_APP_API}/MovieInfo/MovieInfoGetRequest?movieID=${id}`, requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.warn("Error while processing the Movie Info request!");
        }
      })
      .then(info => {




        setData(info);
        

        //Set the tab title to the title and release date in brackets
        info.movie.releaseDate.includes('(') ? document.title = info.movie.title + " " + info.movie.releaseDate : document.title = info.movie.title + " (" + info.movie.releaseDate + ")";

        //Format duration in "?h ??m" format
        info.movie.duration < 60 ? setDuration(info.movie.duration + "m") : setDuration(Math.floor(info.movie.duration / 60) + 'h ' + info.movie.duration % 60 + 'm');

        //Cut brackets for subtitle string as long as it is not a time period (includes '–')
        if (info.movie.releaseDate.includes('(') && !(info.movie.releaseDate.includes('–')))
          setReleaseDate(info.movie.releaseDate.substring(1, info.movie.releaseDate.length - 1));
        else
          setReleaseDate(info.movie.releaseDate);

        window.scrollTo(0, 0);


      });
  }


  const getMovieRatings = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };
    fetch(`${process.env.REACT_APP_API}/MovieInfo/MovieRatingsGetRequest?movieID=${id}`, requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.warn("Error while processing the Movie Ratings request!");
        }
      })
      .then(info => {
        info.friendRating != 0 && setFriendRating(info.friendRating.toFixed(1));
        info.personalRating != 0 && setPersonalRating(info.personalRating);
      });

    window.scrollTo(0, 0);
  }


  function displayPersonalRating() {

    if (personalRating == null) {
      return (
        <>
          <div className={styles.ratings__ratingSource}>
            <StarBorderRoundedIcon className={styles.ratings__ratingStar} />
            <span className={styles.personalRating__actionLabel}>Rate</span>
          </div>
        </>
      )
    } else {
      return (
        <>
          <div className={styles.ratings__ratingSource}>
            <StarRoundedIcon className={styles.ratings__ratingStar} />
            <span className={styles.ratings__ratingNumber}>{personalRating}</span>
            <span className={styles.ratings__ratingOutOf}>/10</span>
          </div>
        </>
      )
    }
  }


  function displayMyList() {

    if (addedToMyList) {
      return (
        <>
          <div className={styles.ratings__ratingSource}>
            <BookmarkRoundedIcon className={styles.myList__icon} />
            <span className={styles.myList__actionLabel}>Added</span>
          </div>
        </>
      )
    } else {
      return (
        <>
          <div className={styles.ratings__ratingSource}>
            <BookmarkBorderRoundedIcon className={styles.myList__icon} />
            <span className={styles.myList__actionLabel}>Add</span>
          </div>
        </>
      )
    }
  }


  const submitRating = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };
    fetch(`${process.env.REACT_APP_API}/MovieInfo/RateMovie?movieID=${id}&rating=${starRatingValue}`, requestOptions)
      .then(response => {
        if (response.ok) {
          handleCloseModal();
          setTimeout(() => {
            setPersonalRating(starRatingValue);
            showSnackbarFeedback();
          }, 150);
          return response.json();
        } else {
          console.warn("Error while processing the the give a rating request!");
        }
      })
  }


  const removeRating = () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };
    fetch(`${process.env.REACT_APP_API}/MovieInfo/RemoveRating?movieID=${id}`, requestOptions)
      .then(response => {
        if (response.ok) {
          handleCloseModal();
          setTimeout(() => {
            setPersonalRating(null);
            showSnackbarFeedback();
          }, 150);
          return response.json();
        } else {
          console.warn("Error while processing the the give a rating request!");
        }
      })
  }


  function formatSubittleInfo() {

    let subtitleString: string = "";

    if (data.movie.releaseDate != null) subtitleString += releaseDate;
    if (data.movie.maturityRating != null) subtitleString += ' | ' + data.movie.maturityRating;
    if (data.movie.duration != null) subtitleString += ' | ' + duration;

    return subtitleString;

  }




  function displayCrewMembers(memberPosition) {

    if (data.staff.$values.some(member => member.position === memberPosition))
      return (
        <>
          {
            memberPosition == "Actor" ?
              <span className={styles.crew__crewPosition}>{memberPosition}s:</span>
              :
              <span className={styles.crew__crewPosition}>{memberPosition}:</span>
          }
          <span className={styles.crew__actorNames}>
            {
              data.staff.$values.filter(member => member.position === memberPosition).map((member, i) => (
                <>
                  <span className={styles.crew__crewName} key={i}>&nbsp;{member.name}</span>
                  <br />
                </>
              ))
            }
          </span>
          <br />
        </>
      );
  }

  function displaySnackbarFeedback() {

    return (
      <>
        <Snackbar open={openSnackbar} autoHideDuration={2500} onClose={(event, reason) => {
          reason != 'clickaway' &&
            setOpenSnackbar(false);
        }}>

          <Alert onClose={(event?: React.SyntheticEvent | Event, reason?: string) => {
            reason != 'clickaway' &&
              setOpenSnackbar(false);
          }} severity="success" sx={{ background: 'rgb(56, 142, 60)', borderRadius: '7px', color: 'white' }}>
            Change successful!
          </Alert>

        </Snackbar>
      </>

    );
  }

  function displayRatingModal() {

    return (
      <>
        <Modal open={openModal} onClose={handleCloseModal}>
          <Fade in={openModal}>
            <Box className={styles.personalRating__modal}>


              <CloseRoundedIcon fontSize="medium" onClick={handleCloseModal} className={styles.personalRating__modal__closeBtn} />

              <StarRoundedIcon id='growingStar' className={styles.personalRating__modal__growingStar} />

              {starRatingValue != null ?
                <h1 id='growingStarTitle' className={styles.personalRating__modal__starTitle}>{starRatingValue}</h1>
                :
                <h1 className={styles.personalRating__modal__starTitle}>?</h1>
              }


              <h3 className={styles.personalRating__modal__rateLabel}>Rate</h3>
              <h2>{data.movie.title}</h2>
              <Rating max={10}
                icon={<StarRoundedIcon className={styles.personalRating__modal__pickerStarFilled} />}
                emptyIcon={<StarBorderRoundedIcon className={styles.personalRating__modal__pickerStarEmpty} />}
                defaultValue={starRatingValue}
                onChange={(event, newValue) => {

                  setStarRatingValue(newValue);

                  document.getElementById('growingStar').style.transform = `scale(${1 + newValue * 0.03})`;

                  if (newValue != null && newValue != personalRating)
                    document.getElementById('submitRatingBtn').classList.add(styles['personalRating__modal__submitButtonActive']);

                  else
                    document.getElementById('submitRatingBtn').classList.remove(styles['personalRating__modal__submitButtonActive']);

                }}
              />

              <div id='submitRatingBtn' onClick={submitRating} className={styles.personalRating__modal__submitButton}>Submit</div>

              {personalRating != null &&
                <div onClick={removeRating} className={styles.personalRating__modal__removeRatingButton}>Remove rating</div>
              }

            </Box>
          </Fade>
        </Modal>
      </>
    );
  }



  useEffect(() => {

    getMovieDetails();
    getMovieRatings();


  }, [id]);



  return (
    <>
      {
        data && (
          <>
            {displayRatingModal()}
            {displaySnackbarFeedback()}

            <div className={styles.banner} style={{ backgroundImage: `url(${data.movie.thumbnail})` }}></div>

            <div className={styles.content}>

              <div className={styles.movieImage} style={{ backgroundImage: `url(${data.movie.thumbnail})` }}></div>
              <div className={styles.movieInfo}>
                <h1 className={styles.movieInfo__title}>{data.movie.title}</h1>
                <h2 className={styles.movieInfo__subtitle}>{formatSubittleInfo()}</h2>
                <p className={styles.movieInfo__description}>{data.movie.description}</p>
              </div>

              <div onClick={handleOpenModal} className={styles.personalRating}>
                <span className={styles.personalRating__title}>My Rating:</span>
                {displayPersonalRating()}
              </div>


              <div onClick={handleOpenModal} className={styles.myList}>
                <span className={styles.personalRating__title}>My List:</span>
                {displayMyList()}
              </div>





              <div>



              </div>

              <div className={styles.ratings}>
                <span className={styles.sectionTitle}>Ratings:</span>
                <hr className={styles.sectionSeparator} />

                <div className={styles.ratings__ratingSection}>
                  <div className={styles.ratings__ratingSource}>
                    <img src="/IMDb_icon.svg" alt="IMDb:" />
                    <StarRoundedIcon className={styles.ratings__ratingStar} />
                  {data.movie.rating == null ?
                  <span className={styles.ratings__ratingNumber}>?</span>
                  :

                  <span className={styles.ratings__ratingNumber}>{data.movie.rating.toFixed(1)}</span>
                  
                  }
                    

                    <span className={styles.ratings__ratingOutOf}>/10</span>
                  </div>

                  <div className={styles.ratings__ratingSource}>
                    <img src="/FriendRating_icon.svg" alt="Friend Rating:" />
                    <StarRoundedIcon className={styles.ratings__ratingStar} />
                    <span className={styles.ratings__ratingNumber}>{friendRating}</span>
                    <span className={styles.ratings__ratingOutOf}>/10</span>
                  </div>

                </div>

              </div>

              <div className={styles.genres}>
                <span className={styles.sectionTitle}>Genres:</span>
                <hr className={styles.sectionSeparator} />
                {
                  data.genres.$values.map((genre, i) => (
                    <a href={'/' + genre} key={i} className={styles.genres__item}>{genre}</a>
                  ))
                }
              </div>

              <div className={styles.crew}>
                <span className={styles.sectionTitle}>Crew:</span>
                <hr className={styles.sectionSeparator} />
                <div className={styles.crew__crewMembers}>

                  {displayCrewMembers("Director")}

                  {displayCrewMembers("Writer")}

                  {displayCrewMembers("Actor")}

                </div>

              </div>

            </div>



          </>

        )
      }
    </>
  );
}

export default MovieInfo;
