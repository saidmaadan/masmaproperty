import axios from 'axios';
import { $ } from './bling';

function ajaxFavorite(e){
  e.preventDefault();
  axios
    .post(this.action)
    .then(res => {
      const isFavorite = this.favorite.classList.toggle('heart__button--hearted');
      $('.heart-count').textContent = res.data.favorites.length;
      if(isFavorite){
        this.favorite.classList.add('heart__button--float');
        setTimeout(() => this.favorite.classList.remove('heart__button--float'), 2500);
      }

    })
    .catch(console.error);
}

export default ajaxFavorite;
