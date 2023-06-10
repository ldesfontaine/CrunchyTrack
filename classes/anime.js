export class Anime {
    constructor(nom,rating,episode,lien,description,genre,studio,annee,etat,episode,lienImage) {
        this.nom = nom;
        this.rating = rating;
        this.episode = episode;
        this.lien = lien;
        this.etat = etat;
        this.lienImage = lienImage;
    }

    

    // Setters and Getters

    getNom() {
        return this.nom;
    }

    getRating() {
        return this.rating;
    }

    getEpisode() {
        return this.episode;
    }

    getLien() {
        return this.lien;
    }

    getEtat() {
        return this.etat;
    }

    getLienImage() {
        return this.lienImage;
    }

    setNom(nom) {
        this.nom = nom;
    }

    setRating(rating) {
        this.rating = rating;
    }

    setEpisode(episode) {
        this.episode = episode;
    }

    setLien(lien) {
        this.lien = lien;
    }

    setEtat(etat) {
        this.etat = etat;
    }

    setLienImage(lienImage) {
        this.lienImage = lienImage;
    }



  }