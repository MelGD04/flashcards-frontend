import { Injectable } from "@angular/core";
import { Flashcard } from "../models/flashcard.model";
import { error } from "node:console";

@Injectable({
    providedIn: 'root'
})
export class FlashcardsService {
/*
    async function obtenerDatos() {
        const response = await fetch ('localhost:8000/flashcards/', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(!response.ok){
            console.error("Tengo tal error", error)
        }
        return response.json()
    }
        */

    //Aqui se llama la base de Datos
    flashcards: Flashcard[] = [
        { id: '1', question: 'Cuales son los metodos heuristicos?', answer: 'Best First, A*, Hill Climbing', category: 'Inteligencia Artificial',difficulty: 'easy', favorite: true },
        { id: '2', question: 'Formula para calcular la funcion heuristica', answer: 'f(x)=g(n)+h(n)     con g = costo aucmulado y h = heuristica', category: 'Inteligencia Artificial', difficulty: 'easy', favorite: true },
        { id: '3', question: 'los dinosaurios tenian plumas', answer: 'asere keseyo :/', category: 'ingle veo', difficulty: 'intermediate', favorite: true },
        { id: '4', question: 'esto ejuna prueba', answer: 'eyerro', category: 'vamo a poner otra', difficulty: 'easy', favorite: true },
        { id: '4', question: 'esto ejuna prueba', answer: 'eyerro', category: 'mate veo', difficulty: 'easy', favorite: false },
        { id: '4', question: 'esto ejuna prueba', answer: 'eyerro', category: 'y otra ma', difficulty: 'easy', favorite: false },
        { id: '4', question: 'esto ejuna prueba', answer: 'eyerro', category: 'mate veo', difficulty: 'easy', favorite: true },
        { id: '4', question: 'esto ejuna prueba', answer: 'eyerro', category: 'otra ma', difficulty: 'easy', favorite: true },
        { id: '4', question: 'esto ejuna prueba', answer: 'eyerro', category: 'epanol veo', difficulty: 'easy', favorite: false },
        { id: '4', question: 'esto ejuna prueba', answer: 'eyerro', category: 'eso mismo', difficulty: 'easy', favorite: true },
        { id: '4', question: 'esto ejuna prueba', answer: 'eyerro', category: 'mate veo', difficulty: 'easy', favorite: true }
    ]

    //Flip Card Method
    isFlipped = false;

    flipCard() {
        this.isFlipped = !this.isFlipped;
    }

    currentIndex = 0;
    animation = 'slide-in';
    showCard = true;

    nextCard() {
        this.animation = 'slide-out-left';
        this.showCard = false;

        setTimeout(() => {
            this.currentIndex = (this.currentIndex + 1) % this.flashcards.length;
            this.animation = 'slide-in-right';
            if(this.isFlipped){
                this.flipCard();
            }
            this.showCard = true;
        }, 70);
    }

    previousCard() {
        this.animation = 'slide-out-right';
        this.showCard = false;

        setTimeout(() => {
            this.currentIndex = (this.currentIndex - 1 + this.flashcards.length) % this.flashcards.length;
            this.animation = 'slide-in-left';
            if (this.isFlipped) {
                this.flipCard();
            }
            this.showCard = true;
        }, 70);
    }

    get currentCard() {
        return this.flashcards[this.currentIndex];
    }

    //Cambiar el color de la flashcard dependiendo de la dificultad
    getDifficultyLevel(difficulty?: string) {
        if (!difficulty) {
            // Si difficulty es undefined, devolvemos un objeto vacío o una clase por defecto
            return {};
        }

        return {
            'bg-success text-white': difficulty === 'easy',
            'bg-warning text-dark': difficulty === 'intermediate',
            'bg-danger text-white': difficulty === 'hard',
        };
    }

    getFlashcards(): Flashcard[] {
        return this.flashcards;
    }

    //Esto es de Dani tambien
    getCategories(): string[] {
        // Extrae categorías únicas
        return [...new Set(this.flashcards.map((flashcard) => flashcard.category))];
    }

    getFlashcardsByCategory(category: string): Flashcard[] {
        return this.flashcards.filter((flashcard) => flashcard.category === category);
    }

    getFlashcardByFavorite(favorite:boolean): Flashcard[]{
        return this.flashcards.filter((flashcard) => flashcard.favorite === favorite);
    }

    getFavorites(): boolean[]{
        return [...new Set(this.flashcards.map((flashcards) => flashcards.favorite))];
    }

    updateFavoriteStatus(id: string, favorite: boolean): void {
        const flashcard = this.flashcards.find(f => f.id === id);
        if (flashcard) {
            flashcard.favorite = favorite;
        }
    }
    //Hasta aqui

}