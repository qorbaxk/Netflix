import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { movieAction } from "../redux/actions/movieAction";
import ClipLoader from "react-spinners/ClipLoader";
import MovieExplain from "../components/MovieExplain";
import Reviews from "../components/Reviews";
import { Container } from "react-bootstrap";
import Recommends from "../components/Recommends";

const MovieDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false); //추천영화
  const [review, setReview] = useState(true); //리뷰

  const { detailMovies, loading, movieReview, movieRecommend, trailerVideo } =
    useSelector((state) => state.mov);

  useEffect(() => {
    dispatch(movieAction.getMovieDetail(id));
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="spinner">
        <ClipLoader color="red" loading={loading} size={150} />
      </div>
    );
  }

  return (
    <div>
      <MovieExplain item={detailMovies} videoId={trailerVideo} />
      <Container>
        <div className="rv-btn">
          <button
            onClick={() => {
              setReview(!review);
              setVisible(!visible);
            }}
          >{`REVIEWS (${movieReview.results?.length})`}</button>
          <button
            onClick={() => {
              setVisible(!visible);
              setReview(!review);
            }}
          >{`RELATED MOVIES (${movieRecommend.results?.length})`}</button>
        </div>
      </Container>
      {review && <Reviews item={movieReview} />}
      {visible && <Recommends item={movieRecommend} />}
    </div>
  );
};

export default MovieDetail;
