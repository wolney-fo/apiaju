# ApiAju

ApiAju is a public API designed to offer a set of information related to the city of Aracaju-SE built with NextJs on Bun.

## Table of Contents

- [ApiAju](#apiaju)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Stack](#stack)
  - [Infrastructure](#infrastructure)
  - [Project structure](#project-structure)
  - [Installation](#installation)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- Calendar
  - List holidays form year;
  - Is holiday: checks if a date is a national, state or municipal holiday;
  - Count workdays;

## Stack

- Bun
- NextJs

## Infrastructure

- Vercel

## Project structure

```
$PROJECT_ROOT
└── src
    ├── app             # Pages and Routes
    ├── components      # React Components
    ├── errors          # Application errors
    ├── lib             # Libraries configuration
    ├── services        # Domain services
    └── utils           # Useful stuffs
```

_NextJs App Router project structure: https://nextjs.org/docs/app/getting-started/project-structure_

## Installation

To install and run the application locally, follow these steps:

1. Clone the repository:
   ```sh
   git clone git@github.com:wolney-fo/apiaju
   ```
2. Navigate to the project directory:
   ```sh
   cd apiaju
   ```
3. Install the dependencies:
   ```sh
   bun install
   ```
4. Run the application:
   ```sh
   bun run dev
   ```
5. Access it on browser:
   ```sh
   http://localhost:3000
   ```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

## License

MIT by [Wolney Oliveira](https://github.com/wolney-fo)
