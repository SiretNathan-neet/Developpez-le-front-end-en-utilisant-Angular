# OlympicGamesStarter

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

Don't forget to install your node_modules before starting (`npm install`).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Where to start

As you can see, an architecture has already been defined for the project. It is just a suggestion, you can choose to use your own. The predefined architecture includes (in addition to the default angular architecture) the following:

- `components` folder: contains every reusable components
- `pages` folder: contains components used for routing
- `core` folder: contains the business logic (`services` and `models` folders)

I suggest you to start by understanding this starter code. Pay an extra attention to the `app-routing.module.ts` and the `olympic.service.ts`.

Once mastered, you should continue by creating the typescript interfaces inside the `models` folder. As you can see I already created two files corresponding to the data included inside the `olympic.json`. With your interfaces, improve the code by replacing every `any` by the corresponding interface.

You're now ready to implement the requested features.

Good luck!

## About this project 

This is an Angular web application that allows users to visualize Olympic games data like medals count per country or athletes per country. It displays informations with statistics showed as graphs using ngx-chart library. 
The main goal is to provide a simple and intuitive interface to manipulate for the user in order to optimize its usage.

## Features 

This application possesses different type of features such as : 
1. Medals visualization by country with an interactive pie chart
2. A line chart showing a country's own statistics within multiple edition of the competition
3. Simple use navigation between overview and country-specific details 
4. Responsive design from mobile phone to computer screen size

## Specificities 

Framework: Angular 
Language: TypeScript
Charts: Ngx-Charts
Styling: SCSS
Routing: Angular Router
HTTP Client: Angular HTTPClient

## Prerequisites to have in mind

To make this application work on your computer, you will need to install : 
1. Node.js
2. npm (npm install)
3. Angular CLI


