export type PetSpecies =
  | "Dog" | "Cat" | "Rabbit" | "Hamster" | "Guinea Pig" | "Mouse" | "Rat" | "Parrot" | "Canary" | "Finch" | "Budgie" | "Cockatiel" | "Lovebird" | "Pigeon" | "Dove" | "Chicken" | "Duck" | "Goose" | "Turkey" | "Quail" | "Fish" | "Turtle" | "Tortoise" | "Lizard" | "Gecko" | "Iguana" | "Chameleon" | "Snake" | "Frog" | "Axolotl" | "Hedgehog" | "Ferret" | "Chinchilla" | "Sugar Glider" | "Hermit Crab" | "Crab" | "Shrimp" | "Snail" | "Spider" | "Scorpion" | "Goat" | "Sheep" | "Pig" | "Horse" | "Donkey" | "Alpaca" | "Llama" | "Cow" | "Water Buffalo" | "Deer" | "Other";

export type PetGender = "Male" | "Female";

export type PetStatus =
  | "ACTIVE"
  | "LOST"
  | "FOUND";

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  gender: PetGender;
  dateOfBirth: string;
  color?: string;
  weight?: number;
  microchipId?: string;
  notes?: string;
  photo?: string;
  status: PetStatus;
  createdAt: string;
  qrCodeId: string;
}